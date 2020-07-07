import { view } from '@/lib/view';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const {
  pi, cos, sin, document,
} = dependencies.globals;

const element = document.createElement('canvas');
element.width = 410;
element.height = 410;
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

// Tentative drawings

// Background
context.beginPath();
context.fillStyle = 'black';
context.arc(205, 205, 200, 0, 2 * pi);
context.fill();
context.closePath();

// Start/Goal line
context.beginPath();
context.strokeStyle = 'white';
context.lineWidth = 1;
context.moveTo(205, 205);
context.lineTo(405, 205);
context.stroke();
context.closePath();

const playerAngle = -pi / 6;
const playerRadius = 100;

const px = 205 + playerRadius * cos(playerAngle);
const py = 205 + playerRadius * sin(playerAngle);

// Guide line
context.beginPath();
context.strokeStyle = 'red';
context.lineWidth = 1;
context.moveTo(205, 205);
context.lineTo(205 + 200 * cos(playerAngle), 205 + 200 * sin(playerAngle));
context.stroke();
context.closePath();

// Player
context.beginPath();
const gradient = context.createRadialGradient(px, py, 0, px, py, 20);
gradient.addColorStop(0, 'red');
gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
context.fillStyle = gradient;
context.arc(px, py, 20, 0, 2 * pi);
context.fill();
context.closePath();

// Center dot
context.beginPath();
context.fillStyle = 'white';
context.arc(205, 205, 3, 0, 2 * pi);
context.fill();
context.closePath();

// Outline
context.beginPath();
context.setLineDash([10, 10]);
context.strokeStyle = 'white';
context.lineWidth = 3;
context.arc(205, 205, 200, 0, -2 * pi, true);
context.stroke();
context.closePath();

context.beginPath();
context.setLineDash([10, 10]);
context.strokeStyle = 'magenta';
context.lineWidth = 3;
context.arc(205, 205, 200, 0, -0.68 * pi, true);
context.stroke();
context.closePath();
