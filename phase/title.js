import dependencies from 'dependencies';
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
import stage1 from '@/stage/1';
import ids from './ids';
import initialState from './initialState';

const {
  min, max, round, random,
} = dependencies.globals;

const drawTitle = (opacity) => {
  context.save();
  context.beginPath();
  context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  context.shadowColor = 'rgba(255, 255, 255, 0.5)';
  context.shadowBlur = 10;
  context.font = `${canvasWidth / 4}px serif`;
  context.textAlign = 'center';
  context.fillText('輪廻', center, center - canvasWidth / 10);
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
  context.textAlign = 'center';
  context.fillText('−回向−', center, center + canvasWidth / 30);
  context.closePath();
  context.restore();
};

export default (time = 0) => ({ mode, level, practice }) => {
  if (time === 0) {
    levelView.update(() => ({ appearance: 0, playerAngle: 0 }));
    modeView.update(() => ({ appearance: 0 }));
    deathsView.update(() => ({ appearance: 0, deaths: 0 }));
    eventView.update(() => ({ appearance: 0, name: '-' }));
  }
  clearCanvas();
  drawTitle(min(time / 60, (165 - time) / 60, 1));
  const opacity = max(min((time - 75) / 30, (165 - time) / 60, 1), 0);
  drawSubtitle(opacity);
  startButtonsView.update(() => ({
    startOpacity: (time > 105 && !practice ? round(random()) : 1) * opacity,
    practiceOpacity: (time > 105 && practice ? round(random()) : 1) * opacity,
  }));
  modeButtonsView.update(() => ({ opacity: time > 105 && practice ? 1 : opacity }));
  if (time === 105) {
    const [nextMode, startWhat] = getClicks().reduce(
      ([m, w], { id, param }) => {
        if (id === buttonIds.mode) {
          return [param, w];
        }
        if ([buttonIds.start, buttonIds.practice].includes(id)) {
          return [m, id];
        }
        return [m, w];
      },
      [mode, null],
    );
    resetClicks();
    modeButtonsView.update(() => ({ mode: nextMode }));
    return {
      nextId: ids.title,
      nextArgs: [startWhat === null ? 105 : 106],
      stateUpdate: { mode: nextMode, practice: startWhat === buttonIds.practice },
    };
  }
  resetClicks();
  return time === 165 ? {
    nextId: practice ? ids.practice : ids.start,
    nextArgs: [],
    stateUpdate: {
      level: practice ? 1 : level,
      stage: stage1(),
    },
  } : {
    nextId: ids.title,
    nextArgs: [time + 1],
    stateUpdate: time === 0 ? { ...initialState(), mode } : {},
  };
};
