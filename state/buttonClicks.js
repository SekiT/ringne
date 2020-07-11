let buttonClicks = [];

export const buttonIds = {
  mode: {},
  start: {},
  practice: {},
  stage: {},
};

export const pushClick = (id, param) => buttonClicks.push({ id, param });
export const getClicks = () => buttonClicks.map(({ id, param }) => ({ id, param }));
export const resetClicks = () => { buttonClicks = []; };
