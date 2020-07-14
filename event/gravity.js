import enemyIds from '@/enemy/ids';
import dependencies from 'dependencies';
import makeEvent from './makeEvent';
import ids from './ids';

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
  id: ids.rotate,
  name: '重力',
  wait: 300,
  duration,
  inputEffect,
  props: { gravity, lines: [] },
});
