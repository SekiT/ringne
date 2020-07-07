import ids from './ids';
import title from './title';
import main from './main';

const idToPhaseGenerator = new Map([
  [ids.title, title],
  [ids.main, main],
]);

export const initialState = () => ({
});

const indexPhase = (phase, state) => () => {
  const { nextId, nextArgs, stateUpdate } = phase(state);
  return indexPhase(idToPhaseGenerator.get(nextId)(...nextArgs), { ...state, ...stateUpdate });
};

export default indexPhase;
