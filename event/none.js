import makeEvent from './makeEvent';
import ids from './ids';

const afterEffect = (_props, _eventTime, context) => {
  context.resetTransform();
};

export default () => makeEvent({
  id: ids.none,
  name: '-',
  wait: Number.POSITIVE_INFINITY,
  duration: 0,
  props: {},
  afterEffect,
});
