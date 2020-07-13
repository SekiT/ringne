import { view, toCssText } from '@/lib/view';
import { buttonIds, pushClick } from '@/state/buttonClicks';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const { min } = dependencies.globals;

const initialState = {
  opacity: 0,
  top: 0,
  fontSize: 0,
  selected: null,
};

const onClick = (number) => () => pushClick(buttonIds.stage, number);

const titleStyle = (opacity, fontSize) => toCssText({
  position: 'absolute',
  left: '50%',
  top: '20%',
  transform: 'translate(-50%, 0)',
  textAlign: 'center',
  fontSize: `${fontSize * 1.7}px`,
  fontFamily: 'serif',
  color: 'white',
  opacity,
});

const containerStyle = (opacity) => toCssText({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  fontFamily: 'serif',
  opacity,
});

const buttonStyle = (selected, fontSize) => toCssText({
  outline: 'none',
  border: `2px solid ${selected ? 'white' : 'transparent'}`,
  margin: `${fontSize / 4}px 0 ${fontSize / 2}px`,
  width: `${fontSize * 7}px`,
  fontSize: `${fontSize}px`,
  color: 'white',
  backgroundColor: 'transparent',
});

const modeButtonsView = view(initialState, (render) => ({
  opacity, fontSize, selected,
}) => render`
  <div style=${titleStyle(opacity, fontSize)}>Select Level</div>
  <div style=${containerStyle(opacity)}>
    <button style=${buttonStyle(selected === 1, fontSize)} onClick=${onClick(1)}>Lv.1~10</button>
    <button style=${buttonStyle(selected === 2, fontSize)} onClick=${onClick(2)}>Lv.11~20</button><br>
    <button style=${buttonStyle(selected === 3, fontSize)} onClick=${onClick(3)}>Lv.21~30</button>
    <button style=${buttonStyle(selected === 4, fontSize)} onClick=${onClick(4)}>Lv.31~40</button><br>
    <button style=${buttonStyle(selected === 5, fontSize)} onClick=${onClick(5)}>Lv.41~50</button>
    <button style=${buttonStyle(selected === 6, fontSize)} onClick=${onClick(6)}>Lv.51~60</button><br>
    <button style=${buttonStyle(selected === 7, fontSize)} onClick=${onClick(7)}>Lv.61~70</button>
    <button style=${buttonStyle(selected === 8, fontSize)} onClick=${onClick(8)}>Lv.71~80</button><br>
    <button style=${buttonStyle(selected === 9, fontSize)} onClick=${onClick(9)}>Lv.81~90</button>
    <button style=${buttonStyle(selected === 10, fontSize)} onClick=${onClick(10)}>Lv.91~100</button>
  </div>
`);

export default modeButtonsView;

windowSize.subscribe(({ width, height }) => {
  const minWidth = min(width, height);
  const fontSize = minWidth * 0.03;
  modeButtonsView.update(() => ({ fontSize }));
});
