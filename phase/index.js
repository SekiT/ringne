import { boardRadius } from '@/view/canvas';
import mode from '@/stage/modes';
import one from '@/stage/1';
import none from '@/event/none';
import { pushTime } from '@/subject/fps';
import dependencies from 'dependencies';
import ids from './ids';
import title from './title';
import main from './main';
import pause from './pause';
import death from './death';

const { now } = dependencies.globals;

const idToPhaseGenerator = new Map([
  [ids.title, title],
  [ids.main, main],
  [ids.pause, pause],
  [ids.death, death],
]);

export const initialState = () => ({
  level: 1,
  mode: mode.hard,
  stage: one(),
  evt: none(),
  playerAngle: 6,
  playerRadius: boardRadius / 2,
  playerInvincible: 0,
  deaths: 0,
  enemies: [],
});

const indexPhase = (phase, state) => () => {
  pushTime(now());
  const { nextId, nextArgs, stateUpdate } = phase(state);
  return indexPhase(idToPhaseGenerator.get(nextId)(...nextArgs), { ...state, ...stateUpdate });
};

export default indexPhase;
