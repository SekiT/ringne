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

const onClick = (id) => () => pushClick(id);

const containerStyle = (opacity, top, fontSize) => toCssText({
  position: 'absolute',
  left: '50%',
  top: `${top}px`,
  transform: 'translate(-50%, 0)',
  textAlign: 'center',
  lineHeight: `${fontSize * 1.5}px`,
  fontFamily: 'serif',
  opacity,
});

const startButtonStyle = (fontSize) => toCssText({
  outline: 'none',
  border: 'none',
  margin: `${fontSize / 4}px 0 ${fontSize / 2}px`,
  fontSize: `${fontSize}px`,
  color: 'white',
  backgroundColor: 'transparent',
});

const startButtonsView = view(initialState, (render) => ({ opacity, top, fontSize }) => render`
  <div style=${containerStyle(opacity, top, fontSize)}>
    <button
      style=${startButtonStyle(fontSize)}
      onClick=${onClick(buttonIds.start)}>Start Game</button><br>
    <button
      style=${startButtonStyle(fontSize)}><s>Practice</s></button><br>
  </div>
`);

export default startButtonsView;

windowSize.subscribe(({ width, height }) => {
  const minWidth = min(width, height);
  const top = height / 2 + minWidth * 0.1;
  const fontSize = minWidth * 0.03;
  startButtonsView.update(() => ({ top, fontSize }));
});
