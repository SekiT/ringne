import ids from './ids';
import { moveLandolt, renderLandolt } from './landolt';
import { moveLazer, renderLazer } from './lazer';
import {
  moveLinearOrb,
  moveOrbToCenter,
  moveSwimOrb,
  renderLinearOrb,
  renderSwimOrb,
} from './orb';

export const enemyIdToMotion = new Map([
  [ids.swimOrb, moveSwimOrb],
  [ids.linearOrb, moveLinearOrb],
  [ids.orbToCenter, moveOrbToCenter],
  [ids.lazer, moveLazer],
  [ids.landolt, moveLandolt],
]);

export const enemyIdToRenderer = new Map([
  [ids.swimOrb, renderSwimOrb],
  [ids.linearOrb, renderLinearOrb],
  [ids.orbToCenter, renderLinearOrb],
  [ids.lazer, renderLazer],
  [ids.landolt, renderLandolt],
]);
