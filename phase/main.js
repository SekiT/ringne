import {
  center,
  context, clearCanvas,
  drawBackground, drawTape, drawGuide, drawPlayer, drawCenterDot, drawOutline, drawEventGauge,
} from '@/view/canvas';
import dependencies from 'dependencies';
import ids from './ids';

const { cos, sin } = dependencies.globals;

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
  drawCenterDot();
  drawOutline();
  drawEventGauge(0.29);
  return {
    nextId: ids.main,
    nextArgs: [],
    stateUpdate: { playerAngle: playerAngle + 0.007 },
  };
};
