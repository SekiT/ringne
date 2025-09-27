import dependencies from 'dependencies';

import ids from './ids';
import makeEvent from './makeEvent';

const { pi2, infinity } = dependencies.globals;

const inputEffect = ({ deaths, pa }, evt) => {
  const { props: { done, speed } } = evt;
  return {
    pa: done ? pa + speed : pa + speed - deaths * pi2,
    evt: { ...evt, props: { done: true, speed: speed + 0.0001 } },
  };
};

export default () => makeEvent({
  id: ids.memorial,
  name: '回向',
  wait: 300,
  duration: infinity,
  inputEffect,
  props: { done: false, speed: 0 },
});
