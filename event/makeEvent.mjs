const identity = (state) => state;

export default ({
  id, name, wait, duration, inputEffect = identity, afterEffect = identity, props,
}) => ({
  id,
  name,
  wait,
  waitTime: 0,
  duration,
  eventTime: 0,
  inputEffect,
  afterEffect,
  props,
});
