import { center } from '@/view/canvas';
import makeEvent from './makeEvent';
import ids from './ids';

const afterEffect = (props, eventTime, context) => {
  context.save();
  context.resetTransform();
  context.translate(center, center);
  context.rotate(eventTime * props.speed);
  context.translate(-center, -center);
  context.beginPath();
  context.drawImage(context.canvas, 0, 0);
  context.closePath();
  context.restore();
  return props;
};

export default (speed, duration) => makeEvent({
  id: ids.rotate,
  name: '流転',
  wait: 300,
  duration,
  afterEffect,
  props: { speed },
});
