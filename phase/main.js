import ids from './ids';

export default () => () => ({
  nextId: ids.main,
  nextArgs: [],
  stateUpdate: {},
});
