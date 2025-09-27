import dependencies from 'dependencies';

import ids from './ids';
import makeEvent from './makeEvent';

import enemyIds from '@/enemy/ids';

const { max } = dependencies.globals;

const pullSwimOrb = (enemy, gravity) => {
  const { radius, time } = enemy;
  if (time < 30) {
    return enemy;
  }
  return radius === 0
    ? { ...enemy, time: max(time, 270) }
    : { ...enemy, radius: max(radius - gravity, 0) };
};

const inputEffect = (state, { props: { gravity } }) => {
  const { pr, enemies } = state;
  return {
    ...state,
    pr: max(pr - gravity, 10),
    enemies: enemies.map((enemy) => (
      enemy.id !== enemyIds.swimOrb ? enemy : pullSwimOrb(enemy, gravity)
    )),
  };
};

export default (gravity, duration) => makeEvent({
  id: ids.gravity,
  name: '重力',
  wait: 300,
  duration,
  inputEffect,
  props: { gravity, lines: [] },
});
