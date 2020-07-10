import makeEvent from './makeEvent';
import ids from './ids';

export default () => makeEvent({
  id: ids.none,
  name: '-',
  wait: Number.POSITIVE_INFINITY,
  duration: 0,
  props: {},
});
