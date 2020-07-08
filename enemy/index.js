import ids from './ids';
import { moveSwimOrb, moveLinearOrb } from './orb';

export default new Map([
  [ids.swimOrb, moveSwimOrb],
  [ids.linearOrb, moveLinearOrb],
]);
