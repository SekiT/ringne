import dependencies from 'dependencies';

import ids from './ids';
import makeEvent from './makeEvent';

const { infinity } = dependencies.globals;

export default () => makeEvent({
  id: ids.none,
  name: '-',
  wait: infinity,
  duration: 0,
  props: {},
});
