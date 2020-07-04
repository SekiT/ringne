import ids from './ids';

export default () => () => ({
  nextId: ids.title,
  nextArgs: [],
  stateUpdate: {},
});
