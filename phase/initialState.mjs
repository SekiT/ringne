import none from '@/event/none';
import stage1 from '@/stage/1';
import mode from '@/stage/modes';
import { boardRadius } from '@/view/canvas';

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
