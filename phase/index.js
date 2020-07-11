import { pushTime } from '@/subject/fps';
import dependencies from 'dependencies';
import ids from './ids';
import title from './title';
import start from './start';
import main from './main';
import pause from './pause';
import death from './death';

const { now } = dependencies.globals;

const idToPhaseGenerator = new Map([
  [ids.title, title],
  [ids.start, start],
  [ids.main, main],
  [ids.pause, pause],
  [ids.death, death],
]);

const indexPhase = (phase, state) => () => {
  pushTime(now());
  const { nextId, nextArgs, stateUpdate } = phase(state);
  return indexPhase(idToPhaseGenerator.get(nextId)(...nextArgs), { ...state, ...stateUpdate });
};

export default indexPhase;
