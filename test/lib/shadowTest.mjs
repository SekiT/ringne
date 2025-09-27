import { test } from 'tape';

import {
  mockConstructor,
  mockFunction, mockFunctionSequence, mockPropertyGetter,
  resetMock,
  shadow,
} from '@/lib/shadow';

const originalObjects = (originalArgument, originalReturned) => ({
  fun1: (x) => x === originalArgument && originalReturned,
  fun2: (x) => x === originalArgument && originalReturned,
  Con: function (x) {
    this.value = x === originalArgument && originalReturned;
  },
  obj: {
    child: originalReturned,
    fun: (x) => x === originalArgument && originalReturned,
  },
});

test('shadow initially proxies functions', (t) => {
  const [originalArgument, originalReturned] = [{}, {}];
  const {
    fun1, fun2, Con, obj,
  } = originalObjects(originalArgument, originalReturned);
  t.equal(shadow(fun1)(originalArgument), originalReturned);
  t.equal(shadow(fun2)(originalArgument), originalReturned);
  t.equal(new (shadow(Con))(originalArgument).value, originalReturned);
  t.equal(shadow(obj).child, originalReturned);
  t.equal(shadow(obj).fun(originalArgument), originalReturned);
  t.end();
});

test('mockFunction replaces implementation', (t) => {
  const [originalArgument, originalReturned, mockedArgument, mockedReturned] = [{}, {}, {}, {}];
  const fun = shadow((x) => x === originalArgument && originalReturned);
  mockFunction(fun, (originalFun) => (x) => (
    x === mockedArgument && originalFun(originalArgument) === originalReturned && mockedReturned
  ));
  t.equal(fun(mockedArgument), mockedReturned);
  t.equal(fun(mockedArgument), mockedReturned);
  t.end();
});

test('mockFunctionSequence replaces implementation n times', (t) => {
  const [
    originalArgument, originalReturned,
    mockedArgument1, mockedReturned1, mockedArgument2, mockedReturned2,
  ] = [{}, {}, {}, {}, {}, {}];
  const fun = shadow((x) => x === originalArgument && originalReturned);
  mockFunctionSequence(fun, [
    (originalFun) => (x) => (
      x === mockedArgument1 && originalFun(originalArgument) === originalReturned && mockedReturned1
    ),
    (originalFun) => (x) => (
      x === mockedArgument2 && originalFun(originalArgument) === originalReturned && mockedReturned2
    ),
  ]);
  t.equal(fun(mockedArgument1), mockedReturned1);
  t.equal(fun(mockedArgument2), mockedReturned2);
  t.throws(() => fun(mockedArgument2), /RangeError.+2/);
  t.end();
});

test('mockConstructor replaces constructor', (t) => {
  const [originalArgument, originalReturned, mockedArgument, mockedReturned] = [{}, {}, {}, {}];
  const Con = shadow(originalObjects(originalArgument, originalReturned).Con);
  mockConstructor(Con, (OriginalConstructor) => function MockedConstructor(x) {
    const { value } = new OriginalConstructor(originalArgument);
    this.value = x === mockedArgument && value === originalReturned && mockedReturned;
  });
  t.equal(new Con(mockedArgument).value, mockedReturned);
  t.equal(new Con(mockedArgument).value, mockedReturned);
  t.end();
});

test('mockPropertyGetter replaces getter of the object', (t) => {
  const [originalArgument, originalReturned, mockedArgument, mockedReturned] = [{}, {}, {}, {}];
  const obj = shadow(originalObjects(originalArgument, originalReturned).obj);
  mockPropertyGetter(obj, (originalObj, key) => {
    if (key === 'child') {
      t.equal(originalObj[key], originalReturned);
      return mockedReturned;
    }
    if (key === 'fun') {
      t.equal(originalObj[key](originalArgument), originalReturned);
      return (x) => x === mockedArgument && mockedReturned;
    }
    return t.fail(`Unknown property accessed: ${key}`);
  });
  t.equal(obj.child, mockedReturned);
  t.equal(obj.fun(mockedArgument), mockedReturned);
  t.end();
});

test('resetMock clears single mock', (t) => {
  const [originalArgument, originalReturned] = [{}, {}];
  const {
    fun1, fun2, Con, obj,
  } = originalObjects(originalArgument, originalReturned);
  const shade = {
    fun1: shadow(fun1),
    fun2: shadow(fun2),
    Con: shadow(Con),
    obj: shadow(obj),
  };
  const [mockedArgument, mockedReturned] = [{}, {}];
  const mockFun = (originalFun) => (x) => (
    x === mockedArgument && originalFun(originalArgument) === originalReturned && mockedReturned
  );
  const mockCon = (OriginalConstructor) => function MockedConstructor(x) {
    const { value } = new OriginalConstructor(originalArgument);
    this.value = x === mockedArgument && value === originalReturned && mockedReturned;
  };
  const mockObjGetter = (originalObj, key) => {
    if (key === 'child') {
      return originalObj[key] === originalReturned && mockedReturned;
    }
    if (key === 'fun') {
      return originalObj[key](originalArgument) === originalReturned
        && ((x) => x === mockedArgument && mockedReturned);
    }
    return t.fail(`Unknown property access: ${key}`);
  };
  mockFunction(shade.fun1, mockFun);
  mockFunction(shade.fun2, mockFun);
  mockConstructor(shade.Con, mockCon);
  mockPropertyGetter(shade.obj, mockObjGetter);
  t.equal(shade.fun1(mockedArgument), mockedReturned);
  t.equal(shade.fun2(mockedArgument), mockedReturned);
  t.equal(new shade.Con(mockedArgument).value, mockedReturned);
  t.equal(shade.obj.child, mockedReturned);
  t.equal(shade.obj.fun(mockedArgument), mockedReturned);
  resetMock(shade.fun1);
  t.equal(shade.fun1(originalArgument), originalReturned);
  t.equal(shade.fun2(mockedArgument), mockedReturned);
  t.equal(new shade.Con(mockedArgument).value, mockedReturned);
  t.equal(shade.obj.child, mockedReturned);
  t.equal(shade.obj.fun(mockedArgument), mockedReturned);
  resetMock(shade.Con);
  t.equal(shade.fun1(originalArgument), originalReturned);
  t.equal(shade.fun2(mockedArgument), mockedReturned);
  t.equal(new shade.Con(originalArgument).value, originalReturned);
  t.equal(shade.obj.child, mockedReturned);
  t.equal(shade.obj.fun(mockedArgument), mockedReturned);
  resetMock(shade.obj);
  t.equal(shade.fun1(originalArgument), originalReturned);
  t.equal(shade.fun2(mockedArgument), mockedReturned);
  t.equal(new shade.Con(originalArgument).value, originalReturned);
  t.equal(shade.obj.child, originalReturned);
  t.equal(shade.obj.fun(originalArgument), originalReturned);
  t.end();
});
