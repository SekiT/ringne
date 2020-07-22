import ids from './ids';
import {
  renderSwimOrb, moveSwimOrb,
  renderLinearOrb, moveLinearOrb,
  moveOrbToCenter,
} from './orb';
import { renderLazer, moveLazer } from './lazer';
import { moveLandolt, renderLandolt } from './landolt';

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
