import view from '@/lib/view';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const { min } = dependencies.globals;

const initialState = {
  name: '-',
  appearance: 0,
  x: 0,
  y: 0,
  w: 0,
};

const eventView = view(initialState, (render) => ({
  name, appearance, x, y, w,
}) => {
  const positionStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: `${w}px`,
    height: `${w}px`,
  };
  const ap = appearance * 100;
  const ap2 = ap / 2;
  const backgroundStyle = {
    ...positionStyle,
    backgroundColor: '#969',
    clipPath: `polygon(100% 50%, ${100 - ap2}% ${50 - ap2}%, ${100 - ap}% ${100 - ap}%, 100% 100%)`,
  };
  const textStyle = {
    position: 'absolute',
    top: `${w / 10}px`,
    right: `${w / 10}px`,
    textAlign: 'right',
    fontSize: `${w / 5}px`,
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

windowSize.subscribe(({ width, height }) => {
  const canvasWidth = min(width, height) * 0.7;
  eventView.update(() => ({
    x: (width + canvasWidth * 0.65) / 2,
    y: (height - canvasWidth * 1.05) / 2,
    w: canvasWidth * 0.2,
  }));
});
