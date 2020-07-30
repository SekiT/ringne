import { boardRadius } from '@/view/canvas';
import mode from '@/stage/modes';
import stage1 from '@/stage/1';
import none from '@/event/none';

export default () => ({
  level: 1,
  mode: mode.normal,
  practice: false,
  stage: stage1(),
  evt: none(),
  playerAngle: 0,
  playerRadius: boardRadius / 2,
  playerInvincible: 0,
  deaths: 0,
  frames: 0,
  enemies: [],
});
