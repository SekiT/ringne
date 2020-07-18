import { center, boardRadius } from '@/view/canvas';
import { swimOrb, linearOrb } from '@/enemy/orb';
import dependencies from 'dependencies';
import modes from './modes';
import { vanishOrAgeEnemies, vanishByInvinciblePlayer } from './util';
import stage2 from './2';

const {
  pi, pi2, random,
} = dependencies.globals;

const orbSize = new Map([
  [modes.easy, () => 6 + random() * 2],
  [modes.normal, () => 6 + random() * 3],
  [modes.hard, () => 6 + random() * 4],
]);

const swimOrbWait = new Map([
  [modes.easy, (level) => 30 - level * 2],
  [modes.normal, (level) => 27 - level * 2],
  [modes.hard, (level) => 13 - level],
]);

const swimOrbSpeed = new Map([
  [modes.easy, () => -0.008 * random()],
  [modes.normal, () => -0.01 * random()],
  [modes.hard, () => -0.016 * random()],
]);

const addOrNotLinearOrb = new Map([
  [modes.easy, () => false],
  [modes.normal, (level, time) => level > 5 && time >= 30 - level * 2],
  [modes.hard, (level, time) => level > 5 && time >= 27 - level * 2],
]);

const linearOrbSpeed = new Map([
  [modes.easy, () => 0.5 + random() * 0.5],
  [modes.normal, () => 0.7 + random() * 0.6],
  [modes.hard, () => 1 + random()],
]);

const stage1 = (swimOrbTime = 0, linearOrbTime = 0) => (mode, level, levelUp, state) => {
  const {
    enemies, evt, px, py, pa, playerInvincible,
  } = state;
  if (levelUp && level === 11) {
    return { enemies: vanishOrAgeEnemies(enemies), nextStage: stage2(), evt };
  }
  const addSwimOrb = swimOrbTime >= swimOrbWait.get(mode)(level);
  const addLinearOrb = addOrNotLinearOrb.get(mode)(level, linearOrbTime);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    addSwimOrb ? [
      swimOrb(
        -pa + 0.4 + random() * pi * 1.6,
        random() * boardRadius,
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ] : [],
    addLinearOrb ? [
      linearOrb(
        center + (2 * random() - 1) * 20,
        center + (2 * random() - 1) * 20,
        random() * pi2,
        linearOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
        'white',
        'blue',
      ),
    ] : [],
  ].flat();
  return levelUp && level % 10 === 1 ? {
    enemies: vanishOrAgeEnemies(enemies), nextStage: stage2(), evt,
  } : {
    enemies: nextEnemies,
    nextStage: stage1(addSwimOrb ? 0 : swimOrbTime + 1, addLinearOrb ? 0 : linearOrbTime + 1),
    evt,
  };
};

export default stage1;
