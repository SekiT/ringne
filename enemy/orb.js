import { center, boardRadius } from '@/view/canvas';
import dependencies from 'dependencies';
import ids from './ids';

const {
  pi2, min, cos, sin,
} = dependencies.globals;

const hitTestOrb = (px, py, x, y, width) => {
  const dx = px - x;
  const dy = py - y;
  const dr = width / 2 + 3;
  return dx * dx + dy * dy <= dr * dr;
};

const renderShadow = (context, time, x, y, width, color) => {
  context.save();
  context.beginPath();
  context.globalAlpha = 0.5;
  context.fillStyle = color;
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

export const swimOrb = (angle, radius, speed, width, time = 0, color = 'lime') => ({
  id: ids.swimOrb,
  time,
  angle,
  radius,
  speed,
  width,
  color,
});

export const renderSwimOrb = (context, {
  time, angle, radius, width, color,
}) => {
  const x = center + radius * cos(angle);
  const y = center + radius * sin(angle);
  if (time <= 30) {
    renderShadow(context, time, x, y, width, color);
  }
  if (time >= 15) {
    const opacity = min(min((time - 15) / 30, 1), (300 - time) / 30);
    renderOrb(context, x, y, width, 'white', color, opacity);
  }
};

export const moveSwimOrb = (enemy, px, py) => {
  const {
    time, angle, radius, speed, width,
  } = enemy;
  const x = center + radius * cos(angle);
  const y = center + radius * sin(angle);
  return {
    nextEnemies: time >= 300
      ? []
      : [{ ...enemy, angle: angle + (time < 45 ? 0 : speed), time: time + 1 }],
    hit: time < 45 || time > 270
      ? false
      : hitTestOrb(px, py, x, y, width),
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

export const renderLinearOrb = (context, {
  time, x, y, width, fillColor, strokeColor,
}) => {
  if (time <= 30) {
    renderShadow(context, time, x, y, width, strokeColor);
  }
  if (time >= 15) {
    const opacity = min((time - 15) / 30, 1);
    renderOrb(context, x, y, width, fillColor, strokeColor, opacity);
  }
};

export const moveLinearOrb = (enemy, px, py) => {
  const {
    time, x, y, angle, speed, width,
  } = enemy;
  if (time < 45) {
    return {
      nextEnemies: [{ ...enemy, time: time + 1 }],
      hit: false,
    };
  }
  const nextX = x + speed * cos(angle);
  const nextY = y + speed * sin(angle);
  const dx = nextX - center;
  const dy = nextY - center;
  const dr = boardRadius + width / 2;
  return dx * dx + dy * dy > dr * dr ? {
    nextEnemies: [],
    hit: false,
  } : {
    nextEnemies: [{
      ...enemy, x: nextX, y: nextY, time: time + 1,
    }],
    hit: hitTestOrb(px, py, x, y, width),
  };
};
