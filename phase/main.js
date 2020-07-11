import dependencies from 'dependencies';
import {
  center, boardRadius,
  canvasContext, clearCanvas,
  drawBackground, drawTape, drawGuide, drawPlayer, drawCenterDot, drawOutline, drawEventGauge,
} from '@/view/canvas';
import getInputs from '@/state/input';
import levelView from '@/view/level';
import modeView from '@/view/mode';
import deathsView from '@/view/deaths';
import eventView from '@/view/event';
import { enemyIdToMotion, enemyIdToRenderer } from '@/enemy/index';
import ids from './ids';
import initialState from './initialState';

const {
  pi2, cos, sin, min, max, random,
} = dependencies.globals;

const moveEnemies = (enemies, px, py) => (
  enemies.reduce((acc, enemy) => {
    const { id } = enemy;
    const { nextEnemies, hit } = enemyIdToMotion.get(id)(enemy, px, py);
    enemyIdToRenderer.get(id)(canvasContext, enemy);
    return {
      nextEnemies: [...acc.nextEnemies, ...nextEnemies],
      hit: acc.hit || hit,
    };
  }, { nextEnemies: [], hit: false })
);

export default (pauseTime = 0) => ({
  mode,
  level: previousLevel,
  stage,
  evt: previousEvt,
  playerAngle: previousPA,
  playerRadius: previousPR,
  playerInvincible,
  enemies: previousEnemies,
  deaths,
}) => {
  const {
    inner, outer, quick, brake, pause, escape,
  } = getInputs();
  if (escape) {
    canvasContext.resetTransform();
    clearCanvas();
    return {
      nextId: ids.title,
      nextArgs: [],
      stateUpdate: {
        ...initialState(),
        mode,
      },
    };
  }
  if (pause && pauseTime > 10) {
    return {
      nextId: ids.pause,
      nextArgs: [0],
      stateUpdate: {},
    };
  }
  const levelUp = previousPA >= pi2;
  const level = previousLevel + (levelUp ? 1 : 0);
  const paBeforeEffect = previousPA + 0.007 + (quick - brake) * 0.005 + (levelUp ? -pi2 : 0);
  const prBeforeEffect = min(max(previousPR + (outer - inner) * 2, 10), boardRadius - 10);
  const eventActive = previousEvt.waitTime >= previousEvt.wait;
  const { pa, pr } = eventActive
    ? previousEvt.inputEffect({
      pa: paBeforeEffect, pr: prBeforeEffect, inner, outer, quick, brake,
    }, previousEvt)
    : { pa: paBeforeEffect, pr: prBeforeEffect };
  levelView.update(() => ({ level, playerAngle: pa }));
  modeView.update(() => ({ mode }));
  eventView.update(() => ({ name: previousEvt.name }));
  clearCanvas();
  drawBackground();
  drawTape();
  drawGuide(pa);
  const px = center + pr * cos(-pa);
  const py = center + pr * sin(-pa);
  if (playerInvincible === 0 || random() < 0.5) {
    drawPlayer(px, py);
  }
  const { nextStage, enemies, evt } = stage(mode, level, levelUp, {
    px, py, pa, pr, playerInvincible, enemies: previousEnemies, evt: previousEvt,
  });
  const { nextEnemies, hit } = moveEnemies(enemies, px, py);
  const dead = hit && playerInvincible === 0;
  drawCenterDot();
  drawOutline();
  drawEventGauge(eventActive ? (1 - evt.eventTime / evt.duration) : evt.waitTime / evt.wait);
  const nextProps = eventActive
    ? evt.afterEffect(evt.props, evt.eventTime, canvasContext)
    : evt.props;
  const nextEvt = {
    ...evt,
    waitTime: evt.waitTime + 1,
    eventTime: eventActive ? evt.eventTime + 1 : 0,
    props: nextProps,
  };
  if (dead) {
    deathsView.update(() => ({ deaths: deaths + 1 }));
  }
  return dead ? {
    nextId: ids.death,
    nextArgs: [],
    stateUpdate: {
      level,
      stage: nextStage,
      deaths: deaths + 1,
      enemies: nextEnemies,
      evt: nextEvt,
    },
  } : {
    nextId: ids.main,
    nextArgs: [pauseTime + 1],
    stateUpdate: {
      level,
      stage: nextStage,
      playerAngle: pa,
      playerRadius: pr,
      playerInvincible: max(playerInvincible - 1, 0),
      enemies: nextEnemies,
      evt: nextEvt,
    },
  };
};
