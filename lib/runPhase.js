import dependencies from 'dependencies';

const { requestAnimationFrame } = dependencies.globals;

const runPhase = (phase) => () => requestAnimationFrame(runPhase(phase()));

export default (initialPhase) => runPhase(initialPhase)();
