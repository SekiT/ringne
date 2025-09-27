import dependencies from 'dependencies';

import ids from './ids';
import initialState from './initialState';

import { enemyIdToMotion, enemyIdToRenderer } from '@/enemy/index';
import getInputs from '@/state/input';
import {
  boardRadius, canvasContext,
  center,
  drawBackground, drawCenterDot, drawEventGauge, drawGuide, drawOutline, drawPlayer, drawTape,
} from '@/view/canvas';
import deathsView from '@/view/deaths';
import eventView from '@/view/event';
import levelView from '@/view/level';
import modeView from '@/view/mode';

const {
  pi2, cos, sin, min, max, random,
} = dependencies.globals;

const getInputsIntoState = () => ({ state: getInputs() });

const handleEscape = ({ escape, mode }) => ({
  returns: escape ? {
    nextId: ids.title,
    nextArgs: [],
    stateUpdate: {
      ...initialState(),
      mode,
    },
  } : false,
});

const handlePause = ({ pause, pauseTime }) => ({
  returns: pause && pauseTime > 10 ? {
    nextId: ids.pause,
    nextArgs: [0],
    stateUpdate: {},
  } : false,
});

const runInputEffect = ({ evt, ...state }) => (
  evt.waitTime >= evt.wait
    ? { state: evt.inputEffect(state, evt) }
    : {}
);

const movePlayer = ({
  inner, outer, quick, brake, pa, pr,
}) => ({
  state: {
    pa: pa + 0.007 + (quick - brake) * 0.005,
    pr: min(
      max(pr + (outer - inner) * 2, 10),
      boardRadius - 10,
    ),
  },
});

const drawBoard = () => {
  drawBackground();
  drawTape();
  drawOutline();
  return {};
};

const playerPosition = ({ pa, pr }) => ({
  state: {
    px: center + pr * cos(-pa),
    py: center + pr * sin(-pa),
  },
});

const handleLevelUp = ({
  practice, pa, pr, level, deaths, frames,
}) => {
  const levelUp = pa >= pi2;
  const nextLevel = level + (levelUp ? 1 : 0);
  if (practice && levelUp && nextLevel % 10 === 1) {
    return {
      returns: {
        nextId: ids.title,
        nextArgs: [],
        stateUpdate: {},
      },
    };
  }
  if (level === 101) {
    if (deaths >= 100) {
      return {
        returns: {
          nextId: ids.title,
          nextArgs: [],
          stateUpdate: {},
        },
      };
    }
    drawGuide(pa);
    const { state: { px, py } } = playerPosition({ pa, pr });
    drawPlayer(px, py);
    drawCenterDot();
    return {
      returns: {
        nextId: ids.over,
        nextArgs: [],
        stateUpdate: { frames: frames + 1 },
      },
    };
  }
  return {
    state: {
      pa: levelUp ? pa % pi2 : pa,
      level: nextLevel,
      levelUp,
    },
  };
};

const drawPlayerIfNeeded = ({
  playerInvincible, pa, px, py,
}) => {
  drawGuide(pa);
  if (playerInvincible === 0 || random() < 0.5) {
    drawPlayer(px, py);
  }
  return {};
};

const runStage = ({
  mode, level, levelUp, stage, pa, pr, px, py, playerInvincible, enemies, evt,
}) => {
  const stageResult = stage(mode, level, levelUp, {
    px, py, pa, pr, playerInvincible, enemies, evt,
  });
  return {
    state: {
      stage: stageResult.nextStage,
      evt: stageResult.evt,
      enemies: stageResult.enemies,
    },
  };
};

const moveEnemies = ({ enemies, px, py }) => {
  const moveResult = enemies.reduce((acc, enemy) => {
    const { id } = enemy;
    const { nextEnemies, hit } = enemyIdToMotion.get(id)(enemy, px, py);
    enemyIdToRenderer.get(id)(canvasContext, enemy);
    return {
      nextEnemies: acc.nextEnemies.concat(nextEnemies),
      hit: acc.hit || hit,
    };
  }, { nextEnemies: [], hit: false });
  return {
    state: {
      enemies: moveResult.nextEnemies,
      hit: moveResult.hit,
    },
  };
};

const runAfterEffect = ({ evt }) => {
  const {
    eventTime, duration, waitTime, wait, afterEffect, props,
  } = evt;
  const eventActive = waitTime >= wait;
  drawEventGauge(eventActive ? 1 - eventTime / duration : waitTime / wait);
  return {
    state: {
      evt: {
        ...evt,
        waitTime: waitTime + 1,
        eventTime: eventActive ? eventTime + 1 : 0,
        props: eventActive ? afterEffect(props, eventTime, canvasContext) : props,
      },
    },
  };
};

const updateViews = ({
  mode, level, pa, evt,
}) => {
  levelView.update(() => ({ level, playerAngle: pa }));
  modeView.update(() => ({ mode }));
  eventView.update(() => ({ name: evt.name }));
  drawCenterDot();
  return {};
};

const renameShortVariables = ({ pa, pr }) => ({
  state: {
    playerAngle: pa,
    playerRadius: pr,
  },
});

const handleDeath = (state) => {
  const {
    level, mode, practice, stage, evt,
    playerAngle, playerRadius, playerInvincible,
    deaths, frames, enemies,
    hit,
  } = state;
  if (hit && playerInvincible === 0) {
    deathsView.update(() => ({ deaths: deaths + 1 }));
    return {
      returns: {
        nextId: ids.death,
        nextArgs: [],
        stateUpdate: {
          level,
          mode,
          practice,
          stage,
          evt,
          playerAngle,
          playerRadius,
          playerInvincible,
          deaths: deaths + 1,
          frames: frames + 1,
          enemies,
        },
      },
    };
  }
  return {};
};

const toNextFrame = ({
  pauseTime,
  level, mode, practice, stage, evt,
  playerAngle, playerRadius, playerInvincible,
  deaths, frames, enemies,
}) => ({
  returns: {
    nextId: ids.main,
    nextArgs: [pauseTime + 1],
    stateUpdate: {
      level,
      mode,
      practice,
      stage,
      evt,
      playerAngle,
      playerRadius,
      playerInvincible: max(playerInvincible - 1, 0),
      deaths,
      frames: frames + 1,
      enemies,
    },
  },
});

export default (pauseTime = 0) => (previousState) => [
  getInputsIntoState,
  handleEscape,
  handlePause,
  drawBoard,
  runInputEffect,
  movePlayer,
  handleLevelUp,
  playerPosition,
  drawPlayerIfNeeded,
  runStage,
  moveEnemies,
  runAfterEffect,
  updateViews,
  renameShortVariables,
  handleDeath,
  toNextFrame,
].reduce((acc, fun, index, arr) => {
  const { state, returns } = fun(acc);
  return returns
    ? (arr.splice(index), returns)
    : Object.assign(acc, state);
}, {
  ...previousState,
  pauseTime,
  pa: previousState.playerAngle,
  pr: previousState.playerRadius,
});
