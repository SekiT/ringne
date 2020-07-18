import { center, boardRadius } from '@/view/canvas';
import none from '@/event/none';
import { swimOrb } from '@/enemy/orb';
import { landolt } from '@/enemy/landolt';
import dependencies from 'dependencies';
import modes from './modes';
import { vanishOrAgeEnemies, vanishByInvinciblePlayer } from './util';

const {
  pi, pi2, cos, sin, random,
} = dependencies.globals;

const orbWait = new Map([
  [modes.easy, (level) => 60 - level * 3],
  [modes.normal, (level) => 54 - level * 4],
  [modes.hard, (level) => 26 - level * 2],
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

const landoltWait = new Map([
  [modes.easy, (level) => 500 - level * 20],
  [modes.normal, (level) => 300 - level * 30],
  [modes.hard, (level) => 250 - level * 30],
]);

const landoltParams = new Map([
  [modes.easy, { speed: 0.4, hole: pi / 1.3, width: 5 }],
  [modes.normal, { speed: 0.5, hole: pi / 1.5, width: 6 }],
  [modes.hard, { speed: 0.6, hole: pi / 2.3, width: 7 }],
]);

const makeLandolt = (mode, level, angle) => {
  const { speed, hole, width } = landoltParams.get(mode);
  const x = center + (level <= 45 ? 0 : (boardRadius / 2) * cos(angle));
  const y = center + (level <= 45 ? 0 : (boardRadius / 2) * sin(angle));
  return landolt(x, y, random() * pi2, 1, random() < 0.5 ? 0.03 : -0.03, speed, hole, width);
};

const stage5 = (swimOrbTime = 0, landoltTime = 100) => (mode, level, levelUp, {
  enemies, pa, px, py, playerInvincible,
}) => {
  const addSwimOrb = swimOrbTime >= orbWait.get(mode)(level - 40);
  const addLandolt = landoltTime >= landoltWait.get(mode)((level - 1) % 5);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    addSwimOrb ? [
      swimOrb(
        -pa + 0.4 + random() * pi * 1.6,
        boardRadius * random(),
        orbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ] : [],
    addLandolt ? [makeLandolt(mode, level, pi - pa)] : [],
  ].flat();
  return levelUp && level % 10 === 1 ? {
    enemies: vanishOrAgeEnemies(nextEnemies),
    nextStage: stage5(),
    evt: none(),
  } : {
    enemies: nextEnemies,
    nextStage: stage5(addSwimOrb ? 0 : swimOrbTime + 1, addLandolt ? 0 : landoltTime + 1),
    evt: none(),
  };
};

export default stage5;
