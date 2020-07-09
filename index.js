import dependencies from './dependencies';
import { runPhase, idealTimeout } from './lib/runPhase';
import indexPhase, { initialState } from './phase/index';
import mainPhase from './phase/main';
import { canvasView } from './view/canvas';
import levelView from './view/level';
import modeView from './view/mode';
import deathsView from './view/deaths';
import eventView from './view/event';

const { bind } = dependencies.hyperhtml;

bind(document.body)`
  ${canvasView.render()}
  ${levelView.render()}
  ${modeView.render()}
  ${deathsView.render()}
  ${eventView.render()}
`;

runPhase(indexPhase(mainPhase(), initialState()), idealTimeout);
