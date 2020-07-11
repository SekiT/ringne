import none from '@/event/none';

const three = (time = 0) => (_mode, _level, _levelUp, { enemies }) => ({
  enemies, nextStage: three(time + 1), evt: none(),
});

export default three;
