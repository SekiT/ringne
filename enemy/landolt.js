import { center, boardRadius } from '@/view/canvas';
import dependencies from 'dependencies';
import ids from './ids';

const {
  pi, max, sqrt, cos, sin,
} = dependencies.globals;

export const landolt = (x, y, angle, radius, angleSpeed, radiusSpeed, holeWidth, lineWidth) => ({
  id: ids.landolt,
  x,
  y,
  angle,
  radius,
  angleSpeed,
  radiusSpeed,
  holeWidth,
  lineWidth,
});

export const renderLandolt = (context, {
  x, y, angle, radius, holeWidth, lineWidth,
}) => {
  context.save();
  context.beginPath();
  const r1 = max(radius - lineWidth, 0);
  const r2 = max(radius + lineWidth, 0);
  const gradient = context.createRadialGradient(x, y, r1, x, y, r2);
  gradient.addColorStop(0, 'rgba(200, 200, 200, 0.5)');
  gradient.addColorStop(0.25, 'rgba(200, 200, 200, 1)');
  gradient.addColorStop(0.75, 'rgba(200, 200, 200, 1)');
  gradient.addColorStop(1, 'rgba(200, 200, 200, 0.5)');
  context.strokeStyle = gradient;
  context.lineWidth = lineWidth * 2;
  context.lineCap = 'round';
  context.arc(x, y, radius, angle - holeWidth / 2, angle + holeWidth / 2, true);
  context.stroke();
  context.restore();
};

const doesDisappear = (x, y, radius, width) => {
  const dx = x - center;
  const dy = y - center;
  return radius > sqrt(dx * dx + dy * dy) + boardRadius + width * 2;
};

const hitTest = (x, y, angle, radius, holeWidth, lineWidth, px, py) => {
  const dx = px - x;
  const dy = py - y;
  const r2 = dx * dx + dy * dy;
  const innerRadius = radius - lineWidth / 2 - 3;
  const outerRadius = radius + lineWidth / 2 + 3;
  if (r2 < innerRadius * innerRadius || r2 > outerRadius * outerRadius) {
    return false;
  }
  const normalAngle1 = angle - holeWidth / 2 + pi / 2;
  const normalAngle2 = angle + holeWidth / 2 - pi / 2;
  return cos(normalAngle1) * dx + sin(normalAngle1) * dy < 0
    || cos(normalAngle2) * dx + sin(normalAngle2) * dy < 0;
};

export const moveLandolt = (enemy, px, py) => {
  const {
    x, y, angle, radius, angleSpeed, radiusSpeed, holeWidth, lineWidth,
  } = enemy;
  return {
    nextEnemies: doesDisappear(x, y, radius, lineWidth) ? [] : [
      { ...enemy, angle: angle + angleSpeed, radius: radius + radiusSpeed },
    ],
    hit: hitTest(x, y, angle, radius, holeWidth, lineWidth, px, py),
  };
};
