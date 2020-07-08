import {
  center,
  context, clearCanvas,
  drawBackground, drawTape, drawGuide, drawPlayer, drawCenterDot, drawOutline, drawEventGauge,
} from '@/view/canvas';
import dependencies from 'dependencies';
import ids from './ids';

const { pi, cos, sin } = dependencies.globals;

export default () => ({
  playerAngle, playerRadius,
}) => {
  clearCanvas();
  drawBackground();
  drawTape();
  drawGuide(playerAngle);
  const px = center + playerRadius * cos(-playerAngle);
  const py = center + playerRadius * sin(-playerAngle);
  drawPlayer(px, py);
  // Test to draw orbs
  for (let i = 0; i < 200; i += 1) {
    const a = Math.random() * pi * 2;
    const r = Math.random() * 200;
    const x = center + r * cos(a);
    const y = center + r * sin(a);
    context.save();
    context.beginPath();
    context.fillStyle = 'white';
    context.strokeStyle = 'lime';
    context.arc(x, y, 5, 0, 2 * pi);
    context.fill();
    context.stroke();
    context.closePath();
    context.restore();
  }
  drawCenterDot();
  drawOutline();
  drawEventGauge(0.29);
  return playerAngle > pi * 2 ? {
    nextId: ids.title,
    nextArgs: [],
    stateUpdate: {},
  } : {
    nextId: ids.main,
    nextArgs: [],
    stateUpdate: { playerAngle: playerAngle + 0.007 },
  };
};
