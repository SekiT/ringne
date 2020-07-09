import dependencies from './dependencies';
import { runPhase, idealTimeout } from './lib/runPhase';
import indexPhase, { initialState } from './phase/index';
import mainPhase from './phase/main';
import { canvasView } from './view/canvas';
import levelView from './view/level';
import modeView from './view/mode';
import deathsView from './view/deaths';
import eventView from './view/event';

const { render, html } = dependencies.lighterhtml;

render(document.body, html`
  ${canvasView.render()}
  ${levelView.render()}
  ${modeView.render()}
  ${deathsView.render()}
  ${eventView.render()}
`);

runPhase(indexPhase(mainPhase(), initialState()), idealTimeout);
