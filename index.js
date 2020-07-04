import dependencies from './dependencies';
import { runPhase, idealTimeout } from './lib/runPhase';
import indexPhase, { initialState } from './phase/index';
import titlePhase from './phase/title';

const { render, html } = dependencies.uhtml;

render(document.getElementById('root'), html`${
  [
  ].map((view) => view.render())
}`);

runPhase(indexPhase(titlePhase(), initialState()), idealTimeout);
