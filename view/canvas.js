import { view } from '@/lib/view';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const {
  pi, cos, sin, document,
} = dependencies.globals;

export const boardRadius = 200;
export const canvasWidth = boardRadius * 2 + 10;
export const center = canvasWidth / 2;

const element = document.createElement('canvas');
element.width = canvasWidth;
element.height = canvasWidth;
Object.assign(element.style, {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

export const context = element.getContext('2d');

export const canvasView = view({ width: 0 }, (render) => ({ width }) => {
  Object.assign(element.style, {
    width: `${width}px`,
    height: `${width}px`,
  });
  return render`${element}`;
});

windowSize.subscribe(({ width: w, height: h }) => {
  const width = Math.min(w * 0.7, h * 0.7);
  canvasView.update(() => ({ width }));
});

const pi2 = pi * 2;

export const drawBackground = () => {
  context.save();
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(center, center, boardRadius, 0, pi2);
  context.fill();
  context.closePath();
  context.restore();
};

export const drawTape = () => {
  context.save();
  context.beginPath();
  context.strokeStyle = 'white';
  context.lineWidth = 1;
  context.moveTo(center, center);
  context.lineTo(center + boardRadius, center);
  context.stroke();
  context.closePath();
  context.restore();
};

export const drawGuide = (angle) => {
  context.save();
  context.beginPath();
  context.strokeStyle = 'red';
  context.lineWidth = 1;
  context.moveTo(center, center);
  context.lineTo(center + boardRadius * cos(-angle), center + boardRadius * sin(-angle));
  context.stroke();
  context.closePath();
  context.restore();
};

export const drawPlayer = (x, y) => {
  context.save();
  context.beginPath();
  const gradient = context.createRadialGradient(x, y, 0, x, y, 20);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
  context.fillStyle = gradient;
  context.arc(x, y, 20, 0, pi2);
  context.fill();
  context.closePath();
  context.restore();
};

export const drawCenterDot = () => {
  context.save();
  context.beginPath();
  context.fillStyle = 'white';
  context.arc(center, center, 3, 0, pi2);
  context.fill();
  context.closePath();
  context.restore();
};

export const drawOutline = () => {
  context.save();
  context.beginPath();
  context.setLineDash([10, 10]);
  context.strokeStyle = 'white';
  context.lineWidth = 3;
  context.arc(center, center, boardRadius, 0, -pi2, true);
  context.stroke();
  context.closePath();
  context.restore();
};

export const drawEventGauge = (rate) => {
  context.save();
  context.beginPath();
  context.setLineDash([10, 10]);
  context.strokeStyle = 'magenta';
  context.lineWidth = 3;
  context.arc(center, center, boardRadius, 0, -rate * pi2, true);
  context.stroke();
  context.closePath();
  context.restore();
};
