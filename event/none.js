import dependencies from 'dependencies';
import makeEvent from './makeEvent';
import ids from './ids';

const { infinity } = dependencies.globals;

export default () => makeEvent({
  id: ids.none,
  name: '-',
  wait: infinity,
  duration: 0,
  props: {},
});
