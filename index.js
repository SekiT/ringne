import dependencies from './dependencies';
import { runPhase, idealTimeout } from './lib/runPhase';
import indexPhase, { initialState } from './phase/index';
import mainPhase from './phase/main';
import { canvasView } from './view/canvas';
import levelView from './view/level';
import modeView from './view/mode';

const { render, html } = dependencies.uhtml;

render(document.body, html`${
  [
    canvasView,
    levelView,
    modeView,
  ].map((view) => view.render())
}`);

runPhase(indexPhase(mainPhase(), initialState()), idealTimeout);
