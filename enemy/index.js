import ids from './ids';
import {
  renderSwimOrb, moveSwimOrb, renderLinearOrb, moveLinearOrb,
} from './orb';

export const enemyIdToMotion = new Map([
  [ids.swimOrb, moveSwimOrb],
  [ids.linearOrb, moveLinearOrb],
]);

export const enemyIdToRenderer = new Map([
  [ids.swimOrb, renderSwimOrb],
  [ids.linearOrb, renderLinearOrb],
]);
