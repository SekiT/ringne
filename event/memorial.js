import dependencies from 'dependencies';
import ids from './ids';
import makeEvent from './makeEvent';

const { pi2, infinity } = dependencies.globals;

const inputEffect = ({ deaths, pa }, evt) => ({
  pa: evt.props.done ? pa : pa - deaths * pi2,
  evt: { ...evt, props: { done: true } },
});

export default () => makeEvent({
  id: ids.memorial,
  name: '回向',
  wait: 300,
  duration: infinity,
  inputEffect,
  props: { done: false },
});
