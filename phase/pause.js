import getInputs from '@/state/input';
import ids from './ids';

export default (time) => () => {
  const { pause } = getInputs();
  if (time > 10 && pause) {
    return {
      nextId: ids.main,
      nextArgs: [0],
      stateUpdate: {},
    };
  }
  return {
    nextId: ids.pause,
    nextArgs: [time + 1],
    stateUpdate: {},
  };
};
