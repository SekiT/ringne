const shadeToHandlers = new WeakMap();

export const shadow = (originalObject) => {
  const handlers = {};
  const shade = new Proxy(originalObject, handlers);
  shadeToHandlers.set(shade, handlers);
  return shade;
};

const trapNames = ['get', 'set', 'apply', 'construct'];

export const resetMock = (shade) => {
  const handler = shadeToHandlers.get(shade);
  trapNames.forEach((trapName) => {
    // The ESLint rule 'no-param-reassign' doesn't complain this!
    Reflect.deleteProperty(handler, trapName);
  });
};

export const mockFunction = (shade, mock) => {
  shadeToHandlers.get(shade).apply = (target, thisArg, args) => (
    Reflect.apply(mock(target), thisArg, args)
  );
};

export const mockFunctionSequence = (shade, mocks) => {
  let count = 0;
  shadeToHandlers.get(shade).apply = (target, thisArg, args) => {
    count += 1;
    if (mocks.length < count) {
      throw new Error(`RangeError: Function is called more times than expected: ${mocks.length}`);
    }
    return Reflect.apply(mocks[count - 1](target), thisArg, args);
  };
};

export const mockConstructor = (shade, mock) => {
  shadeToHandlers.get(shade).construct = (target, args) => (
    Reflect.construct(mock(target), args)
  );
};

export const mockPropertyGetter = (shade, mock) => {
  shadeToHandlers.get(shade).get = (target, key) => (
    mock(target, key)
  );
};
