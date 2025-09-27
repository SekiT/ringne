export default (initialValue) => {
  let value = initialValue;
  const subscribers = new Map();
  return {
    next: (updateFunction) => {
      value = updateFunction(value);
      subscribers.forEach((subscriber) => subscriber(value));
    },
    subscribe: (subscriber) => {
      subscriber(value);
      const key = {};
      subscribers.set(key, subscriber);
      return key;
    },
    unsubscribe: (key) => subscribers.delete(key),
  };
};
