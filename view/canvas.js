import { view } from '@/lib/view';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const {
  pi2, cos, sin, document,
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

export const canvasContext = element.getContext('2d');
canvasContext.clip(canvasContext.arc(center, center, boardRadius, 0, pi2));

const outlineElement = element.cloneNode();
const outlineContext = outlineElement.getContext('2d');

export const canvasView = view({ width: 0 }, (render) => ({ width }) => {
  const additionalStyle = {
    width: `${width}px`,
    height: `${width}px`,
  };
  Object.assign(element.style, additionalStyle);
  Object.assign(outlineElement.style, additionalStyle);
  return render`${element}${outlineElement}`;
});

windowSize.subscribe(({ width: w, height: h }) => {
  const width = Math.min(w * 0.7, h * 0.7);
  canvasView.update(() => ({ width }));
});

export const clearCanvas = () => {
  canvasContext.clearRect(0, 0, canvasWidth, canvasWidth);
  outlineContext.clearRect(0, 0, canvasWidth, canvasWidth);
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

export const drawTape = () => {
  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.strokeStyle = 'white';
  canvasContext.lineWidth = 1;
  canvasContext.moveTo(center, center);
  canvasContext.lineTo(center + boardRadius, center);
  canvasContext.stroke();
  canvasContext.closePath();
  canvasContext.restore();
};

export const drawGuide = (angle) => {
  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.strokeStyle = 'red';
  canvasContext.lineWidth = 1;
  canvasContext.moveTo(center, center);
  canvasContext.lineTo(center + boardRadius * cos(-angle), center + boardRadius * sin(-angle));
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
