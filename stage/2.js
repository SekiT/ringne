import { boardRadius } from '@/view/canvas';
import { swimOrb } from '@/enemy/orb';
import rotate from '@/event/rotate';
import none from '@/event/none';
import eventIds from '@/event/ids';
import dependencies from 'dependencies';
import modes from './modes';

const { pi2, random } = dependencies.globals;

const swimOrbSpeed = new Map([
  [modes.easy, () => -0.008 * random()],
  [modes.normal, () => -0.01 * random()],
  [modes.hard, () => -0.02 * random()],
]);

const orbSize = new Map([
  [modes.easy, () => 6 + random() * 2],
  [modes.normal, () => 6 + random() * 3],
  [modes.hard, () => 6 + random() * 4],
]);

const two = (time = 0) => (mode, level, levelUp, state) => {
  const enemies = [
    state.enemies,
    random() >= 0.07 ? [] : [
      swimOrb(
        random() * pi2,
        random() * boardRadius,
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ],
  ].flat();
  const { id, eventTime, duration } = state.evt;
  let evt;
  let nextTime;
  if (id === eventIds.none) {
    if (time === 30) {
      evt = rotate(random() < 0.5 ? -0.02 : 0.02, pi2 / 0.01);
      nextTime = time + 1;
    } else {
      evt = state.evt;
      nextTime = time + 1;
    }
  } else if (id === eventIds.rotate && eventTime < duration) {
    evt = state.evt;
    nextTime = time + 1;
  } else {
    evt = none();
    nextTime = -600;
  }
  return { enemies, nextStage: two(nextTime), evt };
};

export default two;
