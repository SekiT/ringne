import none from '@/event/none';
import { lazer } from '@/enemy/lazer';
import dependencies from 'dependencies';

const { pi2, random } = dependencies.globals;

const three = (time = 0) => (_mode, _level, _levelUp, { enemies }) => {
  const nextEnemies = [
    ...enemies,
    time % 100 === 50 ? [
      lazer(100 + random() * 200, 100 + random() * 200, random() * pi2),
    ] : [],
  ].flat();
  return {
    enemies: nextEnemies,
    evt: none(),
    nextStage: three(time + 1),
  };
};

export default three;
