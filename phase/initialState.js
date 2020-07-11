import { boardRadius } from '@/view/canvas';
import mode from '@/stage/modes';
import one from '@/stage/1';
import none from '@/event/none';

export default () => ({
  level: 1,
  mode: mode.normal,
  stage: one(),
  evt: none(),
  playerAngle: 0,
  playerRadius: boardRadius / 2,
  playerInvincible: 0,
  deaths: 0,
  enemies: [],
});
