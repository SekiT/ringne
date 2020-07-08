import dependencies from 'dependencies';
import {
  center, boardRadius,
  context, clearCanvas,
  drawBackground, drawTape, drawGuide, drawPlayer, drawCenterDot, drawOutline, drawEventGauge,
} from '@/view/canvas';
import getInputs from '@/state/input';
import ids from './ids';

const {
  pi, cos, sin, min, max,
} = dependencies.globals;

export default (pauseTime = 0) => ({
  playerAngle, playerRadius,
}) => {
  const {
    inner, outer, quick, brake, pause,
  } = getInputs();
  if (pause && pauseTime > 10) {
    return {
      nextId: ids.pause,
      nextArgs: [0],
      stateUpdate: {},
    };
  }
  const pa = playerAngle + 0.007 + (quick - brake) * 0.005;
  const pr = min(max(playerRadius + (outer - inner) * 2, 10), boardRadius - 10);
  clearCanvas();
  drawBackground();
  drawTape();
  drawGuide(playerAngle);
  const px = center + pr * cos(-pa);
  const py = center + pr * sin(-pa);
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
  return {
    nextId: ids.main,
    nextArgs: [pauseTime + 1],
    stateUpdate: { playerAngle: pa, playerRadius: pr },
  };
};
