import { boardRadius } from '@/view/canvas';
import mode from '@/stage/modes';
import { pushTime } from '@/subject/fps';
import dependencies from 'dependencies';
import ids from './ids';
import title from './title';
import main from './main';
import pause from './pause';

const { now } = dependencies.globals;

const idToPhaseGenerator = new Map([
  [ids.title, title],
  [ids.main, main],
  [ids.pause, pause],
]);

export const initialState = () => ({
  level: 1,
  mode: mode.hard,
  playerAngle: 0,
  playerRadius: boardRadius / 2,
  playerInvisible: 0,
  deaths: 0,
  enemies: [],
});

const indexPhase = (phase, state) => () => {
  pushTime(now());
  const { nextId, nextArgs, stateUpdate } = phase(state);
  return indexPhase(idToPhaseGenerator.get(nextId)(...nextArgs), { ...state, ...stateUpdate });
};

export default indexPhase;
