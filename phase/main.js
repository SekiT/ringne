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

const runInputEffect = ({
  evt, inner, outer, quick, brake, pa, pr, enemies,
}) => (evt.waitTime >= evt.wait
  ? {
    state: evt.inputEffect({
      inner, outer, quick, brake, pa, pr, enemies,
    }, evt),
  }
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

const handleLevelUp = ({ practice, pa, level }) => {
  const levelUp = pa >= pi2;
  const nextLevel = level + (levelUp ? 1 : 0);
  return practice && levelUp && nextLevel % 10 === 1 ? {
    returns: {
      nextId: ids.title,
      nextArgs: [],
      stateUpdate: {},
    },
  } : {
    state: {
      pa: pa - (levelUp ? pi2 : 0),
      level: nextLevel,
      levelUp,
    },
  };
};

const drawBoard = ({ pa }) => {
  clearCanvas();
  drawBackground();
  drawTape();
  drawGuide(pa);
  drawCenterDot();
  drawOutline();
  return {};
};

const playerPosition = ({ pa, pr }) => ({
  state: {
    px: center + pr * cos(-pa),
    py: center + pr * sin(-pa),
  },
});

const drawPlayerIfNeeded = ({ playerInvincible, px, py }) => {
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
      nextEnemies: [...acc.nextEnemies, ...nextEnemies],
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
  drawEventGauge(eventActive ? (1 - eventTime / duration) : waitTime / wait);
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
  return {};
};

const renameShortVariables = ({ pa, pr }) => ({
  state: {
    playerAngle: pa,
    playerRadius: pr,
  },
});

const handleDeath = (state) => {
  const { hit, playerInvincible, deaths } = state;
  if (hit && playerInvincible === 0) {
    deathsView.update(() => ({ deaths: deaths + 1 }));
    return {
      returns: {
        nextId: ids.death,
        nextArgs: [],
        stateUpdate: {
          ...state,
          deaths: deaths + 1,
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
  deaths, enemies,
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
      enemies,
    },
  },
});

export default (pauseTime = 0) => (previousState) => [
  getInputsIntoState,
  handleEscape,
  handlePause,
  runInputEffect,
  movePlayer,
  handleLevelUp,
  drawBoard,
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
    : { ...acc, ...state };
}, {
  ...previousState,
  pauseTime,
  pa: previousState.playerAngle,
  pr: previousState.playerRadius,
});
