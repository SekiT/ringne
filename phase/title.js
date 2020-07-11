import {
  canvasContext as context, center, canvasWidth, clearCanvas,
} from '@/view/canvas';
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

export default (time = 0) => () => {
  clearCanvas();
  drawTitle(min(time / 60, 1));
  drawSubtitle(min(max((time - 75) / 30, 0), 1));
  return {
    nextId: ids.title,
    nextArgs: [time + 1],
    stateUpdate: {},
  };
};
