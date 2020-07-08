import { center } from '@/view/canvas';
import dependencies from 'dependencies';
import ids from './ids';

const {
  pi, min, cos, sin,
} = dependencies.globals;

const pi2 = pi * 2;

const hitTestOrb = (px, py, x, y, width) => {
  const dx = px - x;
  const dy = py - y;
  const dr = width / 2 + 3;
  return dx * dx + dy * dy <= dr * dr;
};

const renderShadow = (context, time, x, y, width) => {
  context.save();
  context.beginPath();
  context.fillStyle = 'rgba(0, 255, 0, 0.5)';
  context.arc(x, y, width * (2 - time / 30), 0, pi2);
  context.fill();
  context.closePath();
  context.restore();
};

const renderOrb = (context, x, y, width, fillColor, strokeColor, opacity) => {
  context.save();
  context.beginPath();
  context.globalAlpha = opacity;
  context.fillStyle = fillColor;
  context.strokeStyle = strokeColor;
  context.arc(x, y, width, 0, pi2);
  context.fill();
  context.stroke();
  context.closePath();
  context.restore();
};

export const swimOrb = (angle, radius, speed, width, time = 0) => ({
  id: ids.swimOrb,
  time,
  angle,
  radius,
  speed,
  width,
});

export const moveSwimOrb = ({
  time, angle, radius, speed, width,
}, context, px, py) => {
  const x = center + radius * cos(angle);
  const y = center + radius * sin(angle);
  if (time <= 30) {
    renderShadow(context, time, x, y, width);
  }
  if (time >= 15) {
    const opacity = min((time - 15) / 30, 1);
    renderOrb(context, x, y, width, 'white', 'lime', opacity);
  }
  return {
    nextEnemies: [swimOrb(angle + (time < 45 ? 0 : speed), radius, speed, width, time + 1)],
    hit: time <= 45 ? false : hitTestOrb(px, py, x, y, width),
  };
};

export const linearOrb = (x, y, angle, speed, width, fillColor, strokeColor, time = 0) => ({
  id: ids.linearOrb,
  time,
  x,
  y,
  angle,
  speed,
  width,
  fillColor,
  strokeColor,
});

export const moveLinearOrb = () => ({
  time, x, y, angle, speed, width, fillColor, strokeColor,
}, context, px, py) => {
  if (time <= 30) {
    renderShadow(context, time, x, y, width);
  }
  if (time >= 15) {
    const opacity = min((time - 15) / 30, 1);
    renderOrb(context, x, y, width, fillColor, strokeColor, opacity);
  }
  const nextX = x + speed * cos(angle);
  const nextY = y + speed * sin(angle);
  return {
    nextEnemies: [linearOrb(nextX, nextY, angle, speed, width, time + 1)],
    hit: time <= 45 ? false : hitTestOrb(px, py, x, y, width),
  };
};
