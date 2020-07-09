import dependencies from './dependencies';
import { runPhase, idealTimeout } from './lib/runPhase';
import indexPhase, { initialState } from './phase/index';
import mainPhase from './phase/main';
import { canvasView } from './view/canvas';
import levelView from './view/level';
import modeView from './view/mode';
import deathsView from './view/deaths';
import eventView from './view/event';

const { render, html } = dependencies.uhtml;

render(document.body, html`${
  [
    canvasView,
    levelView,
    modeView,
    deathsView,
    eventView,
  ].map((view) => view.render())
}`);

runPhase(indexPhase(mainPhase(), initialState()), idealTimeout);
