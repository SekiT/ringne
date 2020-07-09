import { view, toCssText } from '@/lib/view';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const { min } = dependencies.globals;

const initialState = {
  name: undefined,
  x: 0,
  y: 0,
  w: 0,
};

const eventView = view(initialState, (render) => ({
  name, x, y, w,
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
    backgroundColor: '#969',
    clipPath: 'polygon(50% 0, 100% 50%, 100% 100%, 0 0)',
  });
  const textStyle = toCssText({
    position: 'absolute',
    top: `${w / 10}px`,
    right: `${w / 10}px`,
    textAlign: 'right',
    fontSize: `${w / 5}px`,
    color: 'white',
  });
  return render`
    <div style="${backgroundStyle}"></div>
    <div style="${toCssText(positionStyle)}">
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
