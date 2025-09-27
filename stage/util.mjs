import dependencies from 'dependencies';

import enemyIds from '@/enemy/ids';
import eventIds from '@/event/ids';
import none from '@/event/none';
import { center } from '@/view/canvas';

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

export const makeNextEvent = (eventGenerator, eventReload) => (mode, level, evtTime, evt) => {
  const { id, eventTime, duration } = evt;
  if (id === eventIds.none) {
    if (evtTime === 30) {
      return {
        nextEvt: eventGenerator(mode, level),
        nextEvtTime: evtTime + 1,
      };
    }
    return { nextEvt: evt, nextEvtTime: evtTime + 1 };
  }
  if (id !== eventIds.none && eventTime < duration) {
    return { nextEvt: evt, nextEvtTime: evtTime + 1 };
  }
  return { nextEvt: none(), nextEvtTime: -eventReload.get(mode) };
};
