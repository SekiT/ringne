import dependencies from 'dependencies';

const { now, setTimeout } = dependencies.globals;

export const idealTimeout = 1000 / 60;

export const runPhase = (phase, timeout) => {
  const startedAt = now();
  const newPhase = phase();
  setTimeout(() => {
    const newTimeout = now() < startedAt + idealTimeout ? timeout + 1 : Math.max(timeout - 1, 1);
    runPhase(newPhase, newTimeout);
  }, timeout);
};
