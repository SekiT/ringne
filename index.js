import dependencies from './dependencies';
import { runPhase, idealTimeout } from './lib/runPhase';
import indexPhase, { initialState } from './phase/index';
import mainPhase from './phase/main';
import { canvasView } from './view/canvas';

const { render, html } = dependencies.uhtml;

render(document.body, html`${
  [
    canvasView,
  ].map((view) => view.render())
}`);

runPhase(indexPhase(mainPhase(), initialState()), idealTimeout);