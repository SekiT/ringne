import dependencies from 'dependencies';
import { center, drawPlayer, drawGuide } from '@/view/canvas';
import enemyIds from '@/enemy/ids';
import { hitTestOrb } from '@/enemy/orb';
import { vanishByInvinciblePlayer } from '@/stage/util';
import ids from './ids';
import makeEvent from './makeEvent';

const {
  pi, min, cos, sin, random,
} = dependencies.globals;

const inputEffect = ({
  playerInvincible, pa, pr, enemies,
}, evt) => {
  const { time } = evt.props;
  const t = min(time / 60, 1);
  drawGuide(pa - pi, t, 'cyan');
  const shadowX = center + pr * cos(-pa + pi);
  const shadowY = center + pr * sin(-pa + pi);
  if ((t === 1 && playerInvincible === 0) || random() < 0.5) {
    drawPlayer(shadowX, shadowY);
  }
  const hit = t === 1 && playerInvincible === 0 && enemies.some(({
    id, angle, radius, width,
  }) => {
    if (id === enemyIds.swimOrb) {
      const ex = center + radius * cos(angle);
      const ey = center + radius * sin(angle);
      return hitTestOrb(ex, ey, shadowX, shadowY, width);
    }
    return false;
  });
  return {
    pa: hit ? pa - pi : pa,
    evt: { ...evt, props: { time: time + 1 } },
    enemies: playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, shadowX, shadowY))
      : enemies,
  };
};

export default (duration) => makeEvent({
  id: ids.mirror,
  name: '裏現',
  wait: 300,
  duration,
  inputEffect,
  props: { time: 0 },
});
