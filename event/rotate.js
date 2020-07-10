import { center } from '@/view/canvas';
import makeEvent from './makeEvent';
import ids from './ids';

const afterEffect = (props, eventTime, context) => {
  context.resetTransform();
  context.translate(center, center);
  context.rotate(eventTime * props.speed);
  context.translate(-center, -center);
  return props;
};

export default (speed, duration) => makeEvent({
  id: ids.rotate,
  name: '流転',
  wait: 400,
  duration,
  inputEffect: (state) => (state),
  afterEffect,
  props: { speed },
});
