import dependencies from 'dependencies';
import view from '@/lib/view';

const {
  pi2, cos, sin, document,
} = dependencies.globals;

export const boardRadius = 200;
export const canvasWidth = boardRadius * 2 + 10;
export const center = canvasWidth / 2;

const canvasElement = document.createElement('canvas');
canvasElement.width = canvasWidth;
canvasElement.height = canvasWidth;
Object.assign(canvasElement.style, {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(70vw, 70vh)',
  height: 'min(70vw, 70vh)',
});

export const canvasContext = canvasElement.getContext('2d');

const outlineElement = canvasElement.cloneNode();
const outlineContext = outlineElement.getContext('2d');

export const canvasView = view({ width: 0, opacity: 1 }, (render) => ({ opacity }) => {
  canvasElement.style.opacity = opacity;
  outlineElement.style.opacity = opacity;
  return render`${canvasElement}${outlineElement}`;
});

export const clearCanvas = () => {
  canvasElement.width = canvasWidth;
  outlineElement.width = canvasWidth;
  canvasContext.clip(canvasContext.arc(center, center, boardRadius, 0, pi2));
};

export const drawBackground = () => {
  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.fillStyle = 'black';
  canvasContext.arc(center, center, boardRadius, 0, pi2);
  canvasContext.fill();
  canvasContext.closePath();
  canvasContext.restore();
};

export const drawTape = (rate = 1) => {
  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.strokeStyle = 'white';
  canvasContext.lineWidth = 1;
  canvasContext.moveTo(center, center);
  canvasContext.lineTo(center + rate * boardRadius, center);
  canvasContext.stroke();
  canvasContext.closePath();
  canvasContext.restore();
};

export const drawGuide = (angle, rate = 1, color = 'red') => {
  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = 1;
  canvasContext.moveTo(center, center);
  const r = rate * boardRadius;
  canvasContext.lineTo(center + r * cos(-angle), center + r * sin(-angle));
  canvasContext.stroke();
  canvasContext.closePath();
  canvasContext.restore();
};

export const drawPlayer = (x, y) => {
  canvasContext.save();
  canvasContext.beginPath();
  const gradient = canvasContext.createRadialGradient(x, y, 0, x, y, 20);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
  canvasContext.fillStyle = gradient;
  canvasContext.arc(x, y, 20, 0, pi2);
  canvasContext.fill();
  canvasContext.closePath();
  canvasContext.restore();
};

export const drawCenterDot = () => {
  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.fillStyle = 'white';
  canvasContext.arc(center, center, 3, 0, pi2);
  canvasContext.fill();
  canvasContext.closePath();
  canvasContext.restore();
};

export const drawOutline = (angle = -pi2) => {
  outlineContext.clearRect(0, 0, canvasWidth, canvasWidth);
  outlineContext.save();
  outlineContext.beginPath();
  outlineContext.setLineDash([10, 10]);
  outlineContext.strokeStyle = 'white';
  outlineContext.lineWidth = 3;
  outlineContext.arc(center, center, boardRadius, 0, angle, true);
  outlineContext.stroke();
  outlineContext.closePath();
  outlineContext.restore();
};

export const drawEventGauge = (rate) => {
  outlineContext.save();
  outlineContext.beginPath();
  outlineContext.setLineDash([10, 10]);
  outlineContext.strokeStyle = 'magenta';
  outlineContext.lineWidth = 3;
  outlineContext.arc(center, center, boardRadius, 0, -rate * pi2, true);
  outlineContext.stroke();
  outlineContext.closePath();
  outlineContext.restore();
};
