import {
  context, center, drawTape, drawGuide, drawPlayer, drawOutline, drawCenterDot, drawBackground, drawEventGauge,
} from '@/view/canvas';
import dependencies from 'dependencies';
import ids from './ids';

const { cos, sin } = dependencies.globals;

export default () => ({
  level, playerAngle, playerRadius, deaths,
}) => {
  drawBackground();
  drawTape();
  drawGuide(playerAngle);
  const px = center + playerRadius * cos(playerAngle);
  const py = center + playerRadius * sin(playerAngle);
  drawPlayer(px, py);
  drawCenterDot();
  drawOutline();
  drawEventGauge(0.29);
  return {
    nextId: ids.main,
    nextArgs: [],
    stateUpdate: {},
  };
};
