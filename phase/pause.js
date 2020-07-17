import getInputs from '@/state/input';
import ids from './ids';

export default (time) => () => (
  time > 10 && getInputs().pause ? {
    nextId: ids.main,
    nextArgs: [0],
    stateUpdate: {},
  } : {
    nextId: ids.pause,
    nextArgs: [time + 1],
    stateUpdate: {},
  }
);
