import dependencies from 'dependencies';

const { window } = dependencies.globals;

const keys = {};

window.addEventListener('keydown', ({ key }) => {
  keys[key] = true;
});

window.addEventListener('keyup', ({ key }) => {
  keys[key] = false;
});

let touches = [];

const handleTouch = (touchEvent) => {
  touches = [...touchEvent.touches];
};

window.addEventListener('touchstart', handleTouch);
window.addEventListener('touchmove', handleTouch);
window.addEventListener('touchend', handleTouch);
window.addEventListener('touchcancel', handleTouch);

const inputFromTouches = (ts, ww, wh) => {
  const aspectRatio = wh / ww;
  return ts.reduce((input, { clientX: x, clientY: y }) => {
    const leftDown = x * aspectRatio < y;
    const leftUp = y < wh - x * aspectRatio;
    return {
      left: input.left || (leftDown && leftUp),
      right: input.right || (!leftDown && !leftUp),
      up: input.up || (!leftDown && leftUp),
      down: input.down || (leftDown && !leftUp),
    };
  }, {});
};

export default () => {
  const touchInputs = inputFromTouches(touches, window.innerWidth, window.innerHeight);
  return {
    inner: keys.a || keys.ArrowLeft || touchInputs.left || false,
    outer: keys.d || keys.ArrowRight || touchInputs.right || false,
    quick: keys.w || keys.ArrowUp || touchInputs.up || false,
    brake: keys.s || keys.ArrowDown || touchInputs.down || false,
    pause: keys.p || false,
    escape: keys.Escape || false,
  };
};
