import view from '@/lib/view';
import modes from '@/stage/modes';
import { buttonIds, pushClick } from '@/state/buttonClicks';

const initialState = {
  opacity: 0,
  mode: modes.normal,
};

const onClick = (mode) => () => pushClick(buttonIds.mode, mode);

const containerStyle = (opacity) => ({
  display: opacity > 0 ? 'block' : 'none',
  position: 'absolute',
  left: '50%',
  top: 'calc(50vh + min(25vw, 25vh))',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  fontFamily: 'serif',
  opacity,
});

const fontSize = 'min(2.6vw, 2.6vh)';
const buttonStyle = (selected) => ({
  margin: `0 calc(${fontSize} / 4)`,
  outline: 'none',
  border: `2px solid ${selected ? 'white' : 'transparent'}`,
  fontSize,
  color: 'white',
  backgroundColor: 'transparent',
});

const modeButtonsView = view(initialState, (render) => ({
  opacity, mode, top,
}) => render`
  <div style=${containerStyle(opacity, top)}>
    <button
      style=${buttonStyle(mode === modes.easy)}
      onClick=${onClick(modes.easy)}>EASY</button>
    <button
      style=${buttonStyle(mode === modes.normal)}
      onClick=${onClick(modes.normal)}>NORMAL</button>
    <button
      style=${buttonStyle(mode === modes.hard)}
      onClick=${onClick(modes.hard)}>HARD</button>
  </div>
`);

export default modeButtonsView;
