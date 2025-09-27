import dependencies from 'dependencies';

import death from './death';
import ids from './ids';
import main from './main';
import over from './over';
import pause from './pause';
import practice from './practice';
import start from './start';
import title from './title';

import { pushTime } from '@/subject/fps';

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
