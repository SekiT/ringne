import dependencies from 'dependencies';

const { window } = dependencies.globals;

const keys = {};

window.addEventListener('keydown', ({ key }) => {
  keys[key] = true;
});

window.addEventListener('keyup', ({ key }) => {
  keys[key] = false;
});

export default () => ({
  inner: keys.a || keys.ArrowLeft || false,
  outer: keys.d || keys.ArrowRight || false,
  quick: keys.w || keys.ArrowUp || false,
  brake: keys.s || keys.ArrowDown || false,
  pause: keys.p || false,
});
