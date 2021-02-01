import view from '@/lib/view';
import modes from '@/stage/modes';
import { buttonIds, pushClick } from '@/state/buttonClicks';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const { min, max } = dependencies.globals;

const initialState = {
  startOpacity: 0,
  practiceOpacity: 0,
  mode: modes.normal,
  fontSize: 0,
};

const onClick = (id) => () => pushClick(id);

const containerStyle = (top, fontSize, opacity) => ({
  display: opacity > 0 ? 'block' : 'none',
  position: 'absolute',
  left: '50%',
  top: `${top}px`,
  transform: 'translate(-50%, 0)',
  textAlign: 'center',
  lineHeight: `${fontSize * 1.5}px`,
  fontFamily: 'serif',
});

const startButtonStyle = (fontSize, opacity) => ({
  outline: 'none',
  border: 'none',
  margin: `${fontSize / 4}px 0 ${fontSize / 2}px`,
  fontSize: `${fontSize}px`,
  color: 'white',
  backgroundColor: 'transparent',
  opacity,
});

const startButtonsView = view(initialState, (render) => ({
  startOpacity, practiceOpacity, top, fontSize,
}) => render`
  <div style=${containerStyle(top, fontSize, max(startOpacity, practiceOpacity))}>
    <button
      style=${startButtonStyle(fontSize, startOpacity)}
      onClick=${onClick(buttonIds.start)}>Start Game</button><br>
    <button
      style=${startButtonStyle(fontSize, practiceOpacity)}
      onClick=${onClick(buttonIds.practice)}>Practice</button><br>
  </div>
`);

export default startButtonsView;

windowSize.subscribe(({ width, height }) => {
  const minWidth = min(width, height);
  const top = height / 2 + minWidth * 0.1;
  const fontSize = minWidth * 0.03;
  startButtonsView.update(() => ({ top, fontSize }));
});
