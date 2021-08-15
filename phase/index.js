import dependencies from 'dependencies';
import { pushTime } from '@/subject/fps';
import ids from './ids';
import title from './title';
import start from './start';
import practice from './practice';
import main from './main';
import pause from './pause';
import death from './death';
import over from './over';

const { now } = dependencies.globals;

const idToPhaseGenerator = new Map([
  [ids.title, title],
  [ids.start, start],
  [ids.practice, practice],
  [ids.main, main],
  [ids.pause, pause],
  [ids.death, death],
  [ids.over, over],
]);

const indexPhase = (phase, state) => () => {
  pushTime(now());
  const { nextId, nextArgs, stateUpdate } = phase(state);
  return indexPhase(idToPhaseGenerator.get(nextId)(...nextArgs), Object.assign(state, stateUpdate));
};

export default indexPhase;
