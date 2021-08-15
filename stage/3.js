import dependencies from 'dependencies';
import { center, boardRadius } from '@/view/canvas';
import none from '@/event/none';
import { lazer } from '@/enemy/lazer';
import { swimOrb } from '@/enemy/orb';
import modes from './modes';
import { vanishOrAgeEnemies, vanishByInvinciblePlayer } from './util';
import stage4 from './4';

const {
  pi, cos, sin, random,
} = dependencies.globals;

const orbWait = new Map([
  [modes.easy, (level) => 30 - level * 2],
  [modes.normal, (level) => 27 - level * 2],
  [modes.hard, (level) => 14 - level],
]);

const orbSpeed = new Map([
  [modes.easy, () => -0.008 * random()],
  [modes.normal, () => -0.01 * random()],
  [modes.hard, () => -0.01 * random()],
]);

const orbSize = new Map([
  [modes.easy, () => 6 + random() * 2],
  [modes.normal, () => 6 + random() * 3],
  [modes.hard, () => 6 + random() * 4],
]);

const lazerParams = new Map([
  [modes.easy, {
    wait: (level) => 300 - level * 10,
    radius: 0.7,
    angle: (la) => la + pi * (0.9 + random() * 0.2),
  }],
  [modes.normal, {
    wait: (level) => 200 - level * 10,
    radius: 0.8,
    angle: (la) => la + pi * (0.9 + random() * 0.2),
  }],
  [modes.hard, {
    wait: (level) => 150 - level * 10,
    radius: 0.95,
    angle: (la) => la + pi * (0.8 + random() * 0.4),
  }],
]);

const stage3 = (orbTime = 0, lazerTime = 0, lazerAngle = pi / 3) => (mode, level, levelUp, {
  enemies, px, py, pa, playerInvincible,
}) => {
  const addSwimOrb = orbTime >= orbWait.get(mode)(level - 20);
  const { wait, radius, angle } = lazerParams.get(mode);
  const addLazer = lazerTime >= wait(level - 20);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    addSwimOrb ? [
      swimOrb(
        -pa + 0.4 + random() * pi * 1.6,
        random() * boardRadius,
        orbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ] : [],
    addLazer ? [
      lazer(
        center + radius * boardRadius * cos(lazerAngle),
        center + radius * boardRadius * sin(lazerAngle),
        angle(lazerAngle),
      ),
    ] : [],
  ].flat();
  return levelUp && level % 10 === 1 ? {
    enemies: vanishOrAgeEnemies(nextEnemies),
    evt: none(),
    nextStage: stage4(),
  } : {
    enemies: nextEnemies,
    evt: none(),
    nextStage: stage3(
      addSwimOrb ? 0 : orbTime + 1,
      addLazer ? 0 : lazerTime + 1,
      addLazer ? lazerAngle + pi / 3 : lazerAngle,
    ),
  };
};

export default stage3;
