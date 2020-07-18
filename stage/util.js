import { center } from '@/view/canvas';
import enemyIds from '@/enemy/ids';
import dependencies from 'dependencies';

const { max, cos, sin } = dependencies.globals;

export const vanishOrAgeEnemies = (enemies) => enemies.flatMap((enemy) => (
  enemy.id === enemyIds.swimOrb ? [{ ...enemy, time: max(enemy.time, 270) }] : []
));

export const vanishByInvinciblePlayer = (playerInvincible, px, py) => (enemy) => {
  if ([enemyIds.swimOrb, enemyIds.linearOrb].includes(enemy.id)) {
    const { x, y } = enemy.id === enemyIds.linearOrb ? enemy : {
      x: center + enemy.radius * cos(enemy.angle),
      y: center + enemy.radius * sin(enemy.angle),
    };
    const dx = x - px;
    const dy = y - py;
    const dr = 60 - playerInvincible;
    return dx * dx + dy * dy <= dr * dr ? [] : [enemy];
  }
  return [enemy];
};
