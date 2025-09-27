import view from '@/lib/view';
import { buttonIds, pushClick } from '@/state/buttonClicks';

const initialState = {
  opacity: 0,
  top: 0,
  fontSize: 0,
  selected: null,
};

const onClick = (number) => () => pushClick(buttonIds.stage, number);

const fontSize = 'min(3vw, 3vh)';

const titleStyle = (opacity) => ({
  display: opacity > 0 ? 'block' : 'none',
  position: 'absolute',
  left: '50%',
  top: '20%',
  transform: 'translate(-50%, 0)',
  textAlign: 'center',
  fontSize: `calc(${fontSize} * 1.7)`,
  fontFamily: 'serif',
  color: 'white',
  opacity,
});

const containerStyle = (opacity) => ({
  display: opacity > 0 ? 'block' : 'none',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  fontFamily: 'serif',
  opacity,
});

const buttonStyle = (selected) => ({
  outline: 'none',
  border: `2px solid ${selected ? 'white' : 'transparent'}`,
  margin: `calc(${fontSize} / 4) 0 calc(${fontSize} / 2)`,
  width: `calc(${fontSize} * 7)`,
  fontSize,
  color: 'white',
  backgroundColor: 'transparent',
});

const stageButtonsView = view(initialState, (render) => ({
  opacity, selected,
}) => render`
  <div style=${titleStyle(opacity, fontSize)}>Select Level</div>
  <div style=${containerStyle(opacity)}>
    <button style=${buttonStyle(selected === 1)} onClick=${onClick(1)}>Lv.1~10</button>
    <button style=${buttonStyle(selected === 2)} onClick=${onClick(2)}>Lv.11~20</button><br>
    <button style=${buttonStyle(selected === 3)} onClick=${onClick(3)}>Lv.21~30</button>
    <button style=${buttonStyle(selected === 4)} onClick=${onClick(4)}>Lv.31~40</button><br>
    <button style=${buttonStyle(selected === 5)} onClick=${onClick(5)}>Lv.41~50</button>
    <button style=${buttonStyle(selected === 6)} onClick=${onClick(6)}>Lv.51~60</button><br>
    <button style=${buttonStyle(selected === 7)} onClick=${onClick(7)}>Lv.61~70</button>
    <button style=${buttonStyle(selected === 8)} onClick=${onClick(8)}>Lv.71~80</button><br>
    <button style=${buttonStyle(selected === 9)} onClick=${onClick(9)}>Lv.81~90</button>
    <button style=${buttonStyle(selected === 10)} onClick=${onClick(10)}>Lv.91~100</button>
  </div>
`);

export default stageButtonsView;
