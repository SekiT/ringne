import {
  canvasContext as context, center, canvasWidth, clearCanvas,
} from '@/view/canvas';
import modeButtonsView from '@/view/title/mode';
import { buttonIds, getClicks, resetClicks } from '@/state/buttonClicks';
import dependencies from 'dependencies';
import ids from './ids';

const { min, max } = dependencies.globals;

const drawTitle = (opacity) => {
  context.save();
  context.beginPath();
  context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  context.shadowColor = 'rgba(255, 255, 255, 0.5)';
  context.shadowBlur = 10;
  context.font = `${canvasWidth / 4}px serif`;
  context.fillText('輪廻', center - canvasWidth / 4, center - canvasWidth / 10);
  context.closePath();
  context.restore();
};

const drawSubtitle = (opacity) => {
  context.save();
  context.beginPath();
  context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  context.shadowColor = 'rgba(255, 255, 255, 0.5)';
  context.shadowBlur = 10;
  context.font = `${canvasWidth / 10}px serif`;
  context.fillText('−回向−', center - canvasWidth / 6, center + canvasWidth / 30);
  context.closePath();
  context.restore();
};

export default (time = 0) => ({ mode }) => {
  clearCanvas();
  drawTitle(min(time / 60, 1));
  const opacity = min(max((time - 75) / 30, 0), 1);
  drawSubtitle(opacity);
  modeButtonsView.update(() => ({ opacity }));
  if (time >= 75) {
    const [nextMode, startWhat] = getClicks().reduce(
      ([m, w], { id, param }) => (
        id === buttonIds.mode ? [param, w] : [m, id]
      ),
      [mode, null],
    );
    resetClicks();
    modeButtonsView.update(() => ({ mode: nextMode }));
    if (startWhat === null) {
      return {
        nextId: ids.title,
        nextArgs: [time + 1],
        stateUpdate: { mode: nextMode },
      };
    }
    return {
      nextId: ids.main,
      nextArgs: [],
      stateUpdate: { mode: nextMode },
    };
  }
  resetClicks();
  return {
    nextId: ids.title,
    nextArgs: [time + 1],
    stateUpdate: {},
  };
};
