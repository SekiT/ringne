import dependencies from 'dependencies';
import { boardRadius } from '@/view/canvas';
import enemyIds from '@/enemy/ids';
import makeEvent from './makeEvent';
import ids from './ids';

const {
  pi, sqrt, cos, sin, atan2,
} = dependencies.globals;

const disableInputs = {
  inner: false,
  outer: false,
  quick: false,
  brake: false,
};

const inputEffect = (state, { eventTime, duration, props: { speed } }) => {
  if (eventTime >= duration) {
    return {
      enemies: state.enemies.map((enemy) => (
        enemy.id === enemyIds.swimOrb
          ? { ...enemy, color: 'lime' }
          : enemy
      )),
    };
  }
  const {
    inner, outer, quick, brake, enemies,
  } = state;
  const inputX = outer - inner;
  const inputY = brake - quick;
  if (inputX === 0 && inputY === 0) {
    return {
      ...disableInputs,
      enemies: enemies.map((enemy) => (
        enemy.id === enemyIds.swimOrb ? { ...enemy, color: 'red' } : enemy
      )),
    };
  }
  const direction = atan2(inputY, inputX);
  const cosd = cos(direction);
  const sind = sin(direction);
  const dx = speed * cosd;
  const dy = speed * sind;
  return {
    ...disableInputs,
    enemies: enemies.map((enemy) => {
      if (enemy.id !== enemyIds.swimOrb) return enemy;
      const { angle, radius } = enemy;
      const nextX = radius * cos(angle) + dx;
      const nextY = radius * sin(angle) + dy;
      const a = atan2(nextY, nextX);
      const r = sqrt(nextX * nextX + nextY * nextY);
      const br = boardRadius + enemy.width;
      return {
        ...enemy,
        angle: r > br ? a + pi : a,
        radius: r > br ? br * 2 - r : r,
        color: 'red',
      };
    }),
  };
};

export default (speed, duration) => makeEvent({
  id: ids.swap,
  name: '遍憑',
  wait: 300,
  duration,
  inputEffect,
  props: { speed },
});
