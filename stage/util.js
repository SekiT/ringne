import { center } from '@/view/canvas';
import enemyIds from '@/enemy/ids';
import dependencies from 'dependencies';

const { max, cos, sin } = dependencies.globals;

const { swimOrb, linearOrb, orbToCenter } = enemyIds;

export const vanishOrAgeEnemies = (enemies) => enemies.flatMap((enemy) => (
  enemy.id === swimOrb ? [{ ...enemy, time: max(enemy.time, 270) }] : []
));

export const vanishByInvinciblePlayer = (playerInvincible, px, py) => (enemy) => {
  const { id, angle, radius } = enemy;
  if ([swimOrb, linearOrb, orbToCenter].includes(id)) {
    const { x, y } = id === swimOrb ? {
      x: center + radius * cos(angle),
      y: center + radius * sin(angle),
    } : enemy;
    const dx = x - px;
    const dy = y - py;
    const dr = 60 - playerInvincible;
    return dx * dx + dy * dy <= dr * dr ? [] : [enemy];
  }
  return [enemy];
};
