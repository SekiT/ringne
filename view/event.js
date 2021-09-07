import view from '@/lib/view';

const initialState = {
  name: '-',
  appearance: 0,
};

const canvasWidth = 'min(70vw, 70vh)';
const positionStyle = {
  position: 'absolute',
  left: `calc(50vw + ${canvasWidth} * 0.325)`,
  top: `calc(50vh - ${canvasWidth} * 0.525)`,
  width: `calc(${canvasWidth} * 0.2)`,
  height: `calc(${canvasWidth} * 0.2)`,
};

const eventView = view(initialState, (render) => ({ name, appearance }) => {
  const ap = appearance * 100;
  const ap2 = ap / 2;
  const backgroundStyle = {
    ...positionStyle,
    backgroundColor: '#969',
    clipPath: `polygon(100% 50%, ${100 - ap2}% ${50 - ap2}%, ${100 - ap}% ${100 - ap}%, 100% 100%)`,
  };
  const textStyle = {
    position: 'absolute',
    top: `calc(${canvasWidth} * 0.02)`,
    right: `calc(${canvasWidth} * 0.02)`,
    textAlign: 'right',
    fontSize: `calc(${canvasWidth} * 0.04)`,
    color: 'white',
    opacity: appearance,
  };
  return render`
    <div style="${backgroundStyle}"></div>
    <div style="${positionStyle}">
      <div style="position:relative;width:100%;height:100%">
        <div style="${textStyle}">Event<br>${name || '-'}</div>
      </div>
    </div>
  `;
});

export default eventView;
