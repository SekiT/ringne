import { view } from '@/lib/view';
import modes from '@/stage/modes';
import { buttonIds, pushClick } from '@/state/buttonClicks';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const { min } = dependencies.globals;

const initialState = {
  opacity: 0,
  mode: modes.normal,
  top: 0,
  fontSize: 0,
};

const onClick = (mode) => () => pushClick(buttonIds.mode, mode);

const containerStyle = (opacity, top) => ({
  display: opacity > 0 ? 'block' : 'none',
  position: 'absolute',
  left: '50%',
  top: `${top}px`,
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  fontFamily: 'serif',
  opacity,
});

const buttonStyle = (selected, fontSize) => ({
  margin: `0 ${fontSize / 4}px`,
  outline: 'none',
  border: `2px solid ${selected ? 'white' : 'transparent'}`,
  fontSize: `${fontSize}px`,
  color: 'white',
  backgroundColor: 'transparent',
});

const modeButtonsView = view(initialState, (render) => ({
  opacity, mode, top, fontSize,
}) => render`
  <div style=${containerStyle(opacity, top)}>
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
  const minWidth = min(width, height);
  const top = height / 2 + minWidth * 0.25;
  const fontSize = minWidth * 0.026;
  modeButtonsView.update(() => ({ top, fontSize }));
});
