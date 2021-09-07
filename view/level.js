import dependencies from 'dependencies';
import view from '@/lib/view';

const { pi2, trunc } = dependencies.globals;

const initialState = {
  level: 1,
  playerAngle: 0,
  appearance: 0,
};

const canvasWidth = 'min(70vw, 70vh)';
const positionStyle = {
  position: 'absolute',
  left: `calc(50vw - ${canvasWidth} * 0.525)`,
  top: `calc(50vh - ${canvasWidth} * 0.525)`,
  width: `calc(${canvasWidth} * 0.2)`,
  height: `calc(${canvasWidth} * 0.2)`,
};

const levelView = view(initialState, (render) => ({
  level, playerAngle, appearance,
}) => {
  const ap = appearance * 100;
  const ap2 = ap / 2;
  const backgroundStyle = {
    ...positionStyle,
    backgroundColor: '#966',
    clipPath: `polygon(100% 0, 50% 0, ${50 - ap2}% ${ap2}%, ${100 - ap}% ${ap}%)`,
  };
  const foregroundStyle = {
    ...positionStyle,
    color: 'white',
    fontSize: `calc(${canvasWidth} * 0.04)`,
    margin: `calc(${canvasWidth} * 0.02)`,
    opacity: appearance,
  };
  const progress = trunc((playerAngle / pi2) * 100);
  return render`
    <div style="${backgroundStyle}"></div>
    <div style="${foregroundStyle}">Lv.${level}<br>${progress}%</div>
  `;
});

export default levelView;
