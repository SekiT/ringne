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

const onClick = (id, param) => () => pushClick(id, param);

const containerStyle = (opacity) => toCssText({
  position: 'absolute',
  left: '50%',
  top: '70%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  fontFamily: 'serif',
  opacity,
});

const startButtonStyle = (fontSize) => toCssText({
  outline: 'none',
  border: 'none',
  margin: '5px 0 10px',
  fontSize: `${fontSize}px`,
  color: 'white',
  backgroundColor: 'transparent',
});

const modeButtonStyle = (selected, fontSize) => toCssText({
  margin: '0 5px',
  outline: 'none',
  border: `2px solid ${selected ? 'white' : 'transparent'}`,
  fontSize: `${fontSize}px`,
  color: 'white',
  backgroundColor: 'transparent',
});

const buttonsView = view(initialState, (render) => ({ opacity, mode, fontSize }) => render`
  <div style=${containerStyle(opacity)}>
    <button
      style=${startButtonStyle(fontSize)}
      onClick=${onClick(buttonIds.start)}>Start Game</button><br>
    <button style=${startButtonStyle(fontSize)}
      onClick=${onClick(buttonIds.practice)}>Practice</button><br>
    <button
      style=${modeButtonStyle(mode === modes.easy, fontSize)}
      onClick=${onClick(buttonIds.mode, modes.easy)}>EASY</button>
    <button
      style=${modeButtonStyle(mode === modes.normal, fontSize)}
      onClick=${onClick(buttonIds.mode, modes.normal)}>NORMAL</button>
    <button
      style=${modeButtonStyle(mode === modes.hard, fontSize)}
      onClick=${onClick(buttonIds.mode, modes.hard)}>HARD</button>
  </div>
`);

export default buttonsView;

windowSize.subscribe(({ width, height }) => {
  const fontSize = min(width, height) * 0.03;
  buttonsView.update(() => ({ fontSize }));
});
