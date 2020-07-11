import {
  canvasContext as context, center, canvasWidth, clearCanvas,
} from '@/view/canvas';
import startButtonsView from '@/view/title/startButtons';
import modeButtonsView from '@/view/title/modeButtons';
import levelView from '@/view/level';
import modeView from '@/view/mode';
import deathsView from '@/view/deaths';
import eventView from '@/view/event';
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
  if (time === 0) {
    levelView.update(() => ({ appearance: 0 }));
    modeView.update(() => ({ appearance: 0 }));
    deathsView.update(() => ({ appearance: 0 }));
    eventView.update(() => ({ appearance: 0 }));
  }
  clearCanvas();
  drawTitle(min(time / 60, 1));
  const opacity = min(max((time - 75) / 30, 0), 1);
  drawSubtitle(opacity);
  startButtonsView.update(() => ({ opacity }));
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
    startButtonsView.update(() => ({ opacity: 0 }));
    modeButtonsView.update(() => ({ opacity: 0 }));
    return {
      nextId: ids.start,
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
