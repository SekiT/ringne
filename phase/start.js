import levelView from '@/view/level';
import modeView from '@/view/mode';
import deathsView from '@/view/deaths';
import eventView from '@/view/event';
import {
  canvasContext as context,
  center, boardRadius,
  clearCanvas,
  drawBackground, drawTape, drawGuide, drawPlayer,
  drawCenterDot, drawOutline,
} from '@/view/canvas';
import dependencies from 'dependencies';
import ids from './ids';

const {
  pi2, min, max, trunc,
} = dependencies.globals;

const drawCount = (time) => {
  context.save();
  context.beginPath();
  const opacity = 1 - min(max(((time % 60) - 15) / 30, 0), 1);
  context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  context.shadowColor = 'rgba(255, 255, 255, 0.5)';
  context.shadowBlur = 10;
  context.font = `${boardRadius / 3}px serif`;
  context.textAlign = 'center';
  context.fillText(3 - trunc(time / 60), center, boardRadius / 2);
  context.restore();
};

export default (time = 0) => ({
  level, mode,
}) => {
  if (time === 0) {
    levelView.update(() => ({ level }));
    modeView.update(() => ({ mode }));
  }
  const appearance = min(time / 30, 1);
  levelView.update(() => ({ appearance }));
  modeView.update(() => ({ appearance }));
  deathsView.update(() => ({ appearance }));
  eventView.update(() => ({ appearance, name: '-' }));
  clearCanvas();
  drawBackground();
  drawTape(min(time / 30, 1));
  drawGuide(0, min(max((time - 60) / 30, 0), 1));
  context.globalAlpha = min(max((time - 30) / 30, 0), 1);
  drawPlayer(center + boardRadius / 2, center);
  context.globalAlpha = min(time / 30, 1);
  drawCenterDot();
  context.globalAlpha = 1;
  if (time < 180) {
    drawCount(time);
  }
  drawOutline(-(time / 160) * pi2);
  return time < 180 ? {
    nextId: ids.start,
    nextArgs: [time + 1],
    stateUpdate: {},
  } : {
    nextId: ids.main,
    nextArgs: [],
    stateUpdate: {},
  };
};
