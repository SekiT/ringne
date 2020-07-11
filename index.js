import dependencies from './dependencies';
import { runPhase, idealTimeout } from './lib/runPhase';
import indexPhase from './phase/index';
import initialState from './phase/initialState';
import titlePhase from './phase/title';
import { canvasView } from './view/canvas';
import levelView from './view/level';
import modeView from './view/mode';
import deathsView from './view/deaths';
import eventView from './view/event';
import titleButtonsView from './view/title/buttons';

const { bind } = dependencies.hyperhtml;

bind(document.body)`
  ${canvasView.render()}
  ${levelView.render()}
  ${modeView.render()}
  ${deathsView.render()}
  ${eventView.render()}
  ${titleButtonsView.render()}
`;

runPhase(indexPhase(titlePhase(), initialState()), idealTimeout);
