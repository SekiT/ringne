import dependencies from 'dependencies';
import view from '@/lib/view';
import modes from '@/stage/modes';
import { buttonIds, pushClick } from '@/state/buttonClicks';

const { max } = dependencies.globals;

const initialState = {
  startOpacity: 0,
  practiceOpacity: 0,
  mode: modes.normal,
  fontSize: 0,
};

const onClick = (id) => () => pushClick(id);

const fontSize = 'min(3vw, 3vh)';

const containerStyle = (opacity) => ({
  display: opacity > 0 ? 'block' : 'none',
  position: 'absolute',
  left: '50%',
  top: 'calc(50vh + min(10vw, 10vh))',
  transform: 'translate(-50%, 0)',
  textAlign: 'center',
  lineHeight: `calc(${fontSize} * 1.5)`,
  fontFamily: 'serif',
});

const startButtonStyle = (opacity) => ({
  outline: 'none',
  border: 'none',
  margin: `calc(${fontSize} / 4) 0 calc(${fontSize} / 2)`,
  fontSize,
  color: 'white',
  backgroundColor: 'transparent',
  opacity,
});

const startButtonsView = view(initialState, (render) => ({
  startOpacity, practiceOpacity,
}) => render`
  <div style=${containerStyle(max(startOpacity, practiceOpacity))}>
    <button
      style=${startButtonStyle(startOpacity)}
      onClick=${onClick(buttonIds.start)}>Start Game</button><br>
    <button
      style=${startButtonStyle(practiceOpacity)}
      onClick=${onClick(buttonIds.practice)}>Practice</button><br>
  </div>
`);

export default startButtonsView;
