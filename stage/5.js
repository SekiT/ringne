import { center } from '@/view/canvas';
import none from '@/event/none';
import { landolt } from '@/enemy/landolt';
import dependencies from 'dependencies';

const { pi, pi2, random } = dependencies.globals;

const stage5 = (time = 0) => (mode, level, levelUp, {
  enemies,
}) => {
  const nextEnemies = [
    enemies,
    time % 100 === 50 ? [
      landolt(
        center,
        center,
        random() * pi2,
        1,
        0.03,
        0.6,
        pi / 2.5,
        5,
      ),
    ] : [],
  ].flat();
  return {
    enemies: nextEnemies,
    nextStage: stage5(time + 1),
    evt: none(),
  };
};

export default stage5;
