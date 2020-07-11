import levelView from '@/view/level';
import modeView from '@/view/mode';
import deathsView from '@/view/deaths';
import eventView from '@/view/event';
import { clearCanvas, drawOutline } from '@/view/canvas';
import dependencies from 'dependencies';
import ids from './ids';

const { pi2, min } = dependencies.globals;

export default (time = 0) => ({
  level, mode,
}) => {
  if (time === 0) {
    levelView.update(() => ({ level }));
    modeView.update(() => ({ mode }));
  }
  const appearance = min(time / 30, 1);
  levelView.update(() => ({ appearance }));
  modeView.update(() => ({ appearance }));
  deathsView.update(() => ({ appearance }));
  eventView.update(() => ({ appearance }));
  clearCanvas();
  drawOutline(-(time / 180) * pi2);
  return time < 180 ? {
    nextId: ids.start,
    nextArgs: [time + 1],
    stateUpdate: {},
  } : {
    nextId: ids.main,
    nextArgs: [],
    stateUpdate: {},
  };
};
