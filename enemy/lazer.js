import dependencies from 'dependencies';
import { canvasWidth } from '@/view/canvas';
import ids from './ids';

const {
  document, min, max, abs, cos, sin,
} = dependencies.globals;

export const lazer = (x, y, angle, time = 0) => ({
  id: ids.lazer,
  time,
  x,
  y,
  angle,
});

const length = (time) => max(canvasWidth * 2 * ((time - 60) / 15), 0);
const width = (time) => max(min(time - 75, 155 - time, 15), 1);

const hitTest = (px, py, x, y, angle, time) => {
  const dx = px - x;
  const dy = py - y;
  const projectedToAngle = dx * cos(angle) + dy * sin(angle);
  const distance = abs(-dx * sin(angle) + dy * cos(angle)) - 3;
  return projectedToAngle >= 0 && projectedToAngle <= length(time) && distance <= width(time) / 2;
};

export const moveLazer = ({
  time, x, y, angle,
}, px, py) => ({
  nextEnemies: time >= 185 ? [] : [lazer(x, y, angle, time + 1)],
  hit: time > 45 && time < 155 && hitTest(px, py, x, y, angle, time),
});

const renderBackground = (context, time, x, y) => {
  const t = 1 - time / 30;
  context.save();
  context.fillStyle = `rgba(255, 255, 0, ${t / 2})`;
  context.beginPath();
  const w = 20 + t * 40;
  const d = w / 2;
  context.fillRect(x - d, y - d, w, w);
  context.restore();
};

const bodyCanvas = document.createElement('canvas');
bodyCanvas.width = 20;
bodyCanvas.height = 20;

const bodyContext = bodyCanvas.getContext('2d');
bodyContext.strokeStyle = 'black';
bodyContext.lineWidth = 1;
bodyContext.beginPath();
bodyContext.fillStyle = '#ff0';
bodyContext.moveTo(0, 0);
bodyContext.lineTo(8, 2);
bodyContext.lineTo(8, 18);
bodyContext.lineTo(0, 20);
bodyContext.closePath();
bodyContext.fill();
bodyContext.stroke();
bodyContext.fillStyle = '#66f';
bodyContext.fillRect(5, 5, 15, 10);
bodyContext.strokeRect(5, 5, 15, 10);
bodyContext.beginPath();
bodyContext.moveTo(10, 10);
bodyContext.lineTo(20, 10);
bodyContext.closePath();
bodyContext.stroke();

const renderLineInAdvance = (context, x, y, angle) => {
  context.save();
  context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + canvasWidth * 2 * cos(angle), y + canvasWidth * 2 * sin(angle));
  context.closePath();
  context.stroke();
  context.restore();
};

const renderBeam = (context, x, y, time) => {
  context.save();
  const w = width(time);
  const gradient = context.createLinearGradient(x, y - w, x, y + w);
  gradient.addColorStop(0, 'rgba(255, 255, 0, 0)');
  gradient.addColorStop(0.25, 'rgba(255, 255, 0, 1)');
  gradient.addColorStop(0.75, 'rgba(255, 255, 0, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
  context.fillStyle = gradient;
  context.fillRect(x, y - w, length(time), w * 2);
  context.restore();
};

export const renderLazer = (context, {
  time, x, y, angle,
}) => {
  if (time >= 15 && time <= 60) {
    renderLineInAdvance(context, x, y, angle);
  }
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.translate(-x, -y);
  if (time < 30) {
    renderBackground(context, time, x, y);
  }
  if (time > 15) {
    context.globalAlpha = min((time - 15) / 30, (185 - time) / 30, 1);
    context.drawImage(bodyCanvas, x - 10, y - 10);
  }
  if (time > 60 && time < 155) {
    context.globalAlpha = 1;
    renderBeam(context, x, y, time);
  }
  context.restore();
};
