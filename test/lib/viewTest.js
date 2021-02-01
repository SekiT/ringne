import { test } from 'tape';
import dependencies from 'dependencies';
import { mockFunction, resetMock } from '@/lib/shadow';
import view from '@/lib/view';

const { hyperhtml } = dependencies;

test('view.render renders template', (t) => {
  t.plan(2);
  const objectProp = { display: 'block' };
  const primitiveProp = 3;
  mockFunction(hyperhtml.wire, () => () => (fixedParts, ...variableParts) => {
    t.deepEqual(fixedParts, ['<div style=', '>', '</div>']);
    t.deepEqual(variableParts, [objectProp, primitiveProp]);
  });
  view(
    { foo: objectProp, bar: primitiveProp },
    (render) => ({ foo, bar }) => render`<div style=${foo}>${bar}</div>`,
  ).render();
  resetMock(hyperhtml.wire);
});

test('view.update updates partial or whole props and calls render', (t) => {
  t.plan(8);
  const foo1 = { display: 'none' };
  const foo2 = { display: 'block' };
  const bar1 = 'bar1';
  const bar2 = 'bar2';
  let calledCount = 0;
  mockFunction(hyperhtml.wire, () => () => (fixedParts, ...variableParts) => {
    t.deepEqual(fixedParts, ['<div style=', '>', '</div>']);
    calledCount += 1;
    if (calledCount === 1) t.deepEqual(variableParts, [foo2, bar1]);
    if (calledCount === 2) t.deepEqual(variableParts, [foo1, bar2]);
  });
  const dummyView = view(
    { foo: foo1, bar: bar1 },
    (render) => ({ foo, bar }) => render`<div style=${foo}>${bar}</div>`,
  );
  dummyView.update(({ foo, bar }) => {
    t.equal(foo, foo1);
    t.equal(bar, bar1);
    return { foo: foo2 };
  });
  dummyView.update(({ foo, bar }) => {
    t.equal(foo, foo2);
    t.equal(bar, bar1);
    return { foo: foo1, bar: bar2 };
  });
  resetMock(hyperhtml.wire);
});
