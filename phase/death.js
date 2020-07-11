import dependencies from 'dependencies';
import {
  center, boardRadius,
  canvasContext, clearCanvas,
  drawBackground, drawTape, drawGuide, drawCenterDot, drawOutline, drawEventGauge,
} from '@/view/canvas';
import { enemyIdToRenderer } from '@/enemy/index';
import ids from './ids';

const { pi2, cos, sin } = dependencies.globals;

const drawDeadPlayer = (x, y, time) => {
  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.fillStyle = `rgba(255, 0, 0, ${1 - time / 90})`;
  canvasContext.arc(x, y, 20 + time / 4.5, 0, pi2);
  canvasContext.fill();
  canvasContext.closePath();
  canvasContext.restore();
};

const drawDeathMask = (x, y, time) => {
  canvasContext.save();
  canvasContext.beginPath();
  const gradient = canvasContext.createRadialGradient(x, y, 0, x, y, boardRadius * 2);
  gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
  gradient.addColorStop(0.05, 'rgba(255, 0, 0, 0)');
  gradient.addColorStop(0.3 + 0.7 * (time / 90), 'rgba(255, 0, 0, 0.5)');
  canvasContext.fillStyle = gradient;
  canvasContext.arc(x, y, boardRadius * 2, 0, pi2);
  canvasContext.fill();
  canvasContext.closePath();
  canvasContext.restore();
};

export default (time = 0) => ({
  playerAngle,
  playerRadius,
  enemies,
}) => {
  clearCanvas();
  drawBackground();
  drawTape();
  drawGuide(playerAngle);
  const px = center + playerRadius * cos(-playerAngle);
  const py = center + playerRadius * sin(-playerAngle);
  drawDeadPlayer(px, py, time);
  enemies.forEach((enemy) => enemyIdToRenderer.get(enemy.id)(canvasContext, enemy));
  drawCenterDot();
  drawOutline();
  drawEventGauge(0);
  drawDeathMask(px, py, time);
  return time < 90 ? {
    nextId: ids.death,
    nextArgs: [time + 1],
    stateUpdate: {},
  } : {
    nextId: ids.main,
    nextArgs: [],
    stateUpdate: {
      playerInvincible: 60,
      playerAngle: 0,
      playerRadius: boardRadius / 2,
    },
  };
};
