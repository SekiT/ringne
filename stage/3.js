import { center, boardRadius } from '@/view/canvas';
import none from '@/event/none';
import enemyIds from '@/enemy/ids';
import { lazer } from '@/enemy/lazer';
import { swimOrb } from '@/enemy/orb';
import dependencies from 'dependencies';
import modes from './modes';

const {
  pi, cos, sin, random,
} = dependencies.globals;

const orbFrequency = new Map([
  [modes.easy, (level) => 30 - level * 2],
  [modes.normal, (level) => 27 - level * 2],
  [modes.hard, (level) => 13 - level],
]);

const orbSpeed = new Map([
  [modes.easy, () => -0.008 * random()],
  [modes.normal, () => -0.01 * random()],
  [modes.hard, () => -0.02 * random()],
]);

const orbSize = new Map([
  [modes.easy, () => 6 + random() * 2],
  [modes.normal, () => 6 + random() * 3],
  [modes.hard, () => 6 + random() * 4],
]);

const vanishByInvinciblePlayer = (playerInvincible, px, py) => (enemy) => {
  if (enemy.id !== enemyIds.swimOrb) { return [enemy]; }
  const dx = center + enemy.radius * cos(enemy.angle) - px;
  const dy = center + enemy.radius * sin(enemy.angle) - py;
  const dr = 60 - playerInvincible;
  return dx * dx + dy * dy <= dr * dr ? [] : [enemy];
};

const spawnLazerOrNot = (mode, level, lf, la) => {
  if (mode === modes.easy) {
    if (lf >= 300 - level * 10) {
      return {
        lazers: [
          lazer(
            center + 0.7 * boardRadius * cos(la),
            center + 0.7 * boardRadius * sin(la),
            la + pi * (0.9 + random() * 0.2),
          ),
        ],
        nextLf: 0,
        nextLa: la + pi / 3,
      };
    }
  }
  if (mode === modes.normal) {
    if (lf >= 200 - level * 10) {
      return {
        lazers: [
          lazer(
            center + 0.8 * boardRadius * cos(la),
            center + 0.8 * boardRadius * sin(la),
            la + pi * (0.9 + random() * 0.2),
          ),
        ],
        nextLf: 0,
        nextLa: la + pi / 3,
      };
    }
  }
  if (mode === modes.hard) {
    if (lf >= 150 - level * 10) {
      return {
        lazers: [
          lazer(
            center + 0.95 * boardRadius * cos(la),
            center + 0.95 * boardRadius * sin(la),
            la + pi * (0.8 + random() * 0.4),
          ),
        ],
        nextLf: 0,
        nextLa: la + pi / 3,
      };
    }
  }
  return { lazers: [], nextLf: lf + 1, nextLa: la };
};

const three = (time = 0, lf = 0, la = pi / 3) => (mode, level, levelUp, {
  enemies, px, py, pa, playerInvincible,
}) => {
  const { lazers, nextLf, nextLa } = spawnLazerOrNot(mode, level - 20, lf, la);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    time % orbFrequency.get(mode)(level - 20) === 0 ? [
      swimOrb(
        -pa + 0.4 + random() * pi * 1.6,
        random() * boardRadius,
        orbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ] : [],
    lazers,
  ].flat();
  return {
    enemies: nextEnemies,
    evt: none(),
    nextStage: three(time + 1, nextLf, nextLa),
  };
};

export default three;
