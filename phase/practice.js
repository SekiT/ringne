import stageButtonsView from '@/view/title/stageButtons';
import modeButtonsView from '@/view/title/modeButtons';
import { buttonIds, getClicks, resetClicks } from '@/state/buttonClicks';
import getInputs from '@/state/input';
import stage1 from '@/stage/1';
import stage2 from '@/stage/2';
import stage3 from '@/stage/3';
import stage4 from '@/stage/4';
import stage5 from '@/stage/5';
import dependencies from 'dependencies';
import ids from './ids';

const { min } = dependencies.globals;

const stages = [stage1, stage2, stage3, stage4, stage5];

export default (time = 0, selected = null) => ({ mode }) => {
  stageButtonsView.update(() => ({ selected, opacity: min(time / 30, (60 - time) / 30) }));
  modeButtonsView.update(() => ({ mode, opacity: min((60 - time) / 30, 1) }));
  if (time === 30) {
    if (getInputs().escape) {
      stageButtonsView.update(() => ({ opacity: 0 }));
      modeButtonsView.update(() => ({ opacity: 0 }));
      return {
        nextId: ids.title,
        nextArgs: [],
        stateUpdate: {},
      };
    }
    const [nextMode, nextSelected] = getClicks().reduce(
      ([m, l], { id, param }) => (
        id === buttonIds.mode ? [param, l] : [m, param]
      ),
      [mode, null],
    );
    return {
      nextId: ids.practice,
      nextArgs: [nextSelected === null ? 30 : 31, nextSelected],
      stateUpdate: {
        mode: nextMode,
        level: nextSelected && (nextSelected - 1) * 10 + 1,
        stage: (stages[nextSelected - 1] || stage1)(),
      },
    };
  }
  resetClicks();
  return time < 60 ? {
    nextId: ids.practice,
    nextArgs: [time + 1, selected],
    stateUpdate: {},
  } : {
    nextId: ids.start,
    nextArgs: [],
    stateUpdate: {},
  };
};
