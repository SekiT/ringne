import getInputs from '@/state/input';
import ids from './ids';
import initialState from './initialState';

export default (time) => ({ mode }) => {
  const { escape, pause } = getInputs();
  if (escape) {
    return {
      nextId: ids.title,
      nextArgs: [],
      stateUpdate: {
        ...initialState(),
        mode,
      },
    };
  }
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
