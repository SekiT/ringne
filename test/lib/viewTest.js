import { test } from 'tape';
import dependencies from 'dependencies';
import {
  mockConstructor, mockFunction, mockFunctionSequence, resetMock,
} from '@/lib/shadow';
import { view, toCssText } from '@/lib/view';

const { uhtml, globals: { DocumentFragment } } = dependencies;

test('view.render renders template', (t) => {
  t.plan(4);
  const fragment = {};
  const stringProp = 'hello';
  const booleanProp = false;
  const numberProp = 3;
  const renderedHtml = '<div id="hello" .disabled="false">3</div>';
  mockConstructor(DocumentFragment, () => function C() { return fragment; });
  mockFunction(uhtml.html, () => (fixedParts, ...variableParts) => {
    t.deepEqual(fixedParts, ['<div id=', ' .disabled=', '>', '</div>']);
    t.deepEqual(variableParts, [stringProp, booleanProp, numberProp]);
    return renderedHtml;
  });
  mockFunction(uhtml.render, () => (where, what) => {
    t.equal(where, fragment);
    t.equal(what, renderedHtml);
  });
  view(
    { foo: stringProp, bar: booleanProp, baz: numberProp },
    (render) => ({ foo, bar, baz }) => render`<div id=${foo} .disabled=${bar}>${baz}</div>`,
  ).render();
  resetMock(DocumentFragment);
  resetMock(uhtml.html);
  resetMock(uhtml.render);
});

test('view.update updates partial or whole props and calls render', (t) => {
  t.plan(12);
  const fragment = {};
  const foo1 = 'display:none';
  const foo2 = 'display:block';
  const bar1 = 'bar1';
  const bar2 = 'bar2';
  const html1 = '<div style="display:none">bar1</div>';
  const html2 = '<div style="display:block">bar2</div>';
  mockConstructor(DocumentFragment, () => function C() { return fragment; });
  mockFunctionSequence(uhtml.html, [
    () => (fixedParts, ...variableParts) => {
      t.deepEqual(fixedParts, ['<div style=', '>', '</div>']);
      t.deepEqual(variableParts, [foo2, bar1]);
      return html1;
    },
    () => (fixedParts, ...variableParts) => {
      t.deepEqual(fixedParts, ['<div style=', '>', '</div>']);
      t.deepEqual(variableParts, [foo1, bar2]);
      return html2;
    },
  ]);
  mockFunctionSequence(uhtml.render, [
    () => (where, what) => {
      t.equal(where, fragment);
      t.equal(what, html1);
    },
    () => (where, what) => {
      t.equal(where, fragment);
      t.equal(what, html2);
    },
  ]);
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
  resetMock(DocumentFragment);
  resetMock(uhtml.html);
  resetMock(uhtml.render);
});

test('toCssText converts object into cssText', (t) => {
  const styleObject = {
    fontSize: '10px',
    color: 'white',
    fontFamily: 'serif',
    border: '2px solid black',
  };
  const cssText = 'font-size:10px;color:white;font-family:serif;border:2px solid black;';
  t.equal(toCssText(styleObject), cssText);
  t.end();
});
