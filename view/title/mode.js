import { view, toCssText } from '@/lib/view';
import modes from '@/stage/modes';
import { buttonIds, pushClick } from '@/state/buttonClicks';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const { min } = dependencies.globals;

const initialState = {
  opacity: 0,
  mode: modes.normal,
  fontSize: 0,
};

const onClick = (mode) => () => pushClick(buttonIds.mode, mode);

const containerStyle = (opacity) => toCssText({
  position: 'absolute',
  left: '50%',
  top: '70%',
  transform: 'translate(-50%, -50%)',
  opacity,
});

const buttonStyle = (selected, fontSize) => toCssText({
  margin: '0 5px',
  outline: 'none',
  border: `2px solid ${selected ? 'white' : 'transparent'}`,
  fontSize: `${fontSize}px`,
  fontFamily: 'serif',
  color: 'white',
  backgroundColor: 'transparent',
});

const modeButtonsView = view(initialState, (render) => ({ opacity, mode, fontSize }) => render`
  <div style=${containerStyle(opacity)}>
    <button
      style=${buttonStyle(mode === modes.easy, fontSize)}
      onClick=${onClick(modes.easy)}>EASY</button>
    <button
      style=${buttonStyle(mode === modes.normal, fontSize)}
      onClick=${onClick(modes.normal)}>NORMAL</button>
    <button
      style=${buttonStyle(mode === modes.hard, fontSize)}
      onClick=${onClick(modes.hard)}>HARD</button>
  </div>
`);

export default modeButtonsView;

windowSize.subscribe(({ width, height }) => {
  const fontSize = min(width, height) * 0.03;
  modeButtonsView.update(() => ({ fontSize }));
});
