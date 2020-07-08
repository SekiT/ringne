import ids from './ids';

export default (time = 0) => () => (time < 120 ? {
  nextId: ids.title,
  nextArgs: [time + 1],
  stateUpdate: {},
} : {
  nextId: ids.main,
  nextArgs: [0],
  stateUpdate: {
    playerAngle: 0,
    playerRadius: 100,
    enemies: [],
  },
});
