import { view, toCssText } from '@/lib/view';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const { pi2, min, trunc } = dependencies.globals;

const initialState = {
  level: 1,
  playerAngle: 0,
  appearance: 0,
  x: 0,
  y: 0,
  w: 0,
};

const levelView = view(initialState, (render) => ({
  level, playerAngle, appearance, x, y, w,
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
  const backgroundStyle = toCssText({
    ...positionStyle,
    backgroundColor: '#966',
    clipPath: `polygon(100% 0, 50% 0, ${50 - ap2}% ${ap2}%, ${100 - ap}% ${ap}%)`,
  });
  const foregroundStyle = toCssText({
    ...positionStyle,
    color: 'white',
    fontSize: `${w / 5}px`,
    margin: `${w / 10}px`,
    opacity: appearance,
  });
  const progress = trunc((playerAngle / pi2) * 100);
  return render`
    <div style="${backgroundStyle}"></div>
    <div style="${foregroundStyle}">Lv.${level}<br>${progress}%</div>
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
