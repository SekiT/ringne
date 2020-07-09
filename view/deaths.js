import { view, toCssText } from '@/lib/view';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const { min } = dependencies.globals;

const initialState = {
  deaths: 0,
  x: 0,
  y: 0,
  w: 0,
};

const deathsView = view(initialState, (render) => ({
  deaths, x, y, w,
}) => {
  const positionStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: `${w}px`,
    height: `${w}px`,
  };
  const backgroundStyle = toCssText({
    ...positionStyle,
    backgroundColor: '#669',
    clipPath: 'polygon(50% 100%, 100% 50%, 100% 0, 0 100%)',
  });
  const textStyle = toCssText({
    position: 'absolute',
    bottom: `${w / 10}px`,
    right: `${w / 10}px`,
    textAlign: 'right',
    fontSize: `${w / 5}px`,
    color: 'white',
  });
  return render`
    <div style="${backgroundStyle}"></div>
    <div style="${toCssText(positionStyle)}">
      <div style="position:relative;width:100%;height:100%">
        <div style="${textStyle}">${deaths}<br>death${deaths > 1 ? 's' : ''}</div>
      </div>
    </div>
  `;
});

export default deathsView;

windowSize.subscribe(({ width, height }) => {
  const canvasWidth = min(width, height) * 0.7;
  deathsView.update(() => ({
    x: (width + canvasWidth * 0.65) / 2,
    y: (height + canvasWidth * 0.65) / 2,
    w: canvasWidth * 0.2,
  }));
});
