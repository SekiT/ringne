import { test } from 'tape';
import dependencies from 'dependencies';
import { mockFunctionSequence, resetMock } from '@/lib/shadow';
import { runPhase, idealTimeout } from '@/lib/runPhase';

const { globals } = dependencies;

const timeoutSup = Math.ceil(idealTimeout);

test('runPhase runs phase with balancing timeout', (t) => {
  const cases = [
    { timeTaken: timeoutSup - 1, timeoutBefore: 16, timeoutAfter: 17 },
    { timeTaken: timeoutSup + 0, timeoutBefore: 17, timeoutAfter: 16 },
    { timeTaken: timeoutSup + 1, timeoutBefore: 17, timeoutAfter: 16 },
    { timeTaken: timeoutSup - 1, timeoutBefore: 1, timeoutAfter: 2 },
    { timeTaken: timeoutSup + 0, timeoutBefore: 1, timeoutAfter: 1 },
    { timeTaken: timeoutSup + 1, timeoutBefore: 1, timeoutAfter: 1 },
  ];
  t.plan(cases.length * 3);
  cases.forEach(({ timeTaken, timeoutBefore, timeoutAfter }) => {
    mockFunctionSequence(globals.now, [0, timeTaken, timeTaken].map((mockedNow) => () => () => (
      mockedNow
    )));
    const phase3 = () => t.fail('phase3 should not be called');
    const phase2 = () => { t.pass('phase2 called'); return phase3; };
    const phase1 = () => phase2;
    mockFunctionSequence(globals.setTimeout, [
      () => (fun, timeout) => {
        t.equal(timeout, timeoutBefore);
        fun();
      },
      () => (_, timeout) => t.equal(timeout, timeoutAfter),
    ]);
    runPhase(phase1, timeoutBefore);
  });
  resetMock(globals.now);
  resetMock(globals.setTimeout);
});
