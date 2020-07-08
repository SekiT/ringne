import { view, toCssText } from '@/lib/view';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const { pi, min, trunc } = dependencies.globals;
const pi2 = pi * 2;

const initialState = {
  level: 1,
  playerAngle: 0,
  x: 0,
  y: 0,
  w: 0,
};

const levelView = view(initialState, (render) => ({
  level, playerAngle, x, y, w,
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
    backgroundColor: '#966',
    clipPath: 'polygon(50% 0, 0 50%, 0 100%, 100% 0)',
  });
  const foregroundStyle = toCssText({
    ...positionStyle,
    color: 'white',
    fontSize: `${w / 5}px`,
    margin: `${w / 10}px`,
  });
  const progress = trunc((playerAngle / pi2) * 100);
  return render`
    <div style="${backgroundStyle}"></div>
    <div style="${foregroundStyle}">Lv.${level}<br>${progress}%
  `;
});

export default levelView;

windowSize.subscribe(({ width, height }) => {
  const canvasWidth = min(width, height) * 0.7;
  levelView.update(() => ({
    x: (width - canvasWidth * 1.05) / 2,
    y: (height - canvasWidth * 1.05) / 2,
    w: canvasWidth * 0.2,
  }));
});
