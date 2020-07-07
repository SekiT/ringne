import { view } from '@/lib/view';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const {
  pi, cos, sin, createElement,
} = dependencies.globals;

const element = createElement('canvas');
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

// Center dot
context.beginPath();
context.fillStyle = 'white';
context.arc(205, 205, 3, 0, 2 * pi);
context.fill();
context.closePath();

// Guide line
context.beginPath();
context.strokeStyle = 'white';
context.lineWidth = 1;
context.moveTo(205, 205);
context.lineTo(405, 205);
context.stroke();
context.closePath();

// Player
context.beginPath();
const gradient = context.createRadialGradient(305, 205, 0, 305, 205, 20);
gradient.addColorStop(0, 'red');
gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
context.fillStyle = gradient;
context.arc(305, 205, 20, 0, 2 * pi);
context.fill();
context.closePath();

// Outline
context.beginPath();
context.strokeStyle = 'white';
context.lineWidth = 3;
const l = 100;
const w = pi / l;
for (let i = 0; i < l; i += 2) {
  const a1 = i * 2 * w;
  const a2 = a1 + w * 2;
  context.moveTo(205 + 200 * cos(a1), 205 + 200 * sin(a1));
  context.arc(205, 205, 200, a1, a2);
}
context.stroke();
context.closePath();
