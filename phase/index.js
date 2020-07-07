import { boardRadius } from '@/view/canvas';
import ids from './ids';
import title from './title';
import main from './main';

const idToPhaseGenerator = new Map([
  [ids.title, title],
  [ids.main, main],
]);

export const initialState = () => ({
  level: 1,
  difficulty: 0,
  playerAngle: 0,
  playerRadius: boardRadius / 2,
  playerInvisible: 0,
  deaths: 0,
  enemies: [],
});

const indexPhase = (phase, state) => () => {
  const { nextId, nextArgs, stateUpdate } = phase(state);
  return indexPhase(idToPhaseGenerator.get(nextId)(...nextArgs), { ...state, ...stateUpdate });
};

export default indexPhase;
