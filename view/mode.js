import dependencies from 'dependencies';
import view from '@/lib/view';
import windowSize from '@/subject/windowSize';
import fps from '@/subject/fps';
import modes from '@/stage/modes';

const { min, trunc } = dependencies.globals;

const initialState = {
  mode: modes.normal,
  fpsText: '60.00',
  appearance: 0,
  x: 0,
  y: 0,
  w: 0,
};

export const modeToText = new Map([
  [modes.easy, 'EASY'],
  [modes.normal, 'NORMAL'],
  [modes.hard, 'HARD'],
]);

const modeView = view(initialState, (render) => ({
  mode, fpsText, appearance, x, y, w,
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
    backgroundColor: '#696',
    clipPath: `polygon(0 0, 0 50%, ${ap2}% ${50 + ap2}%, ${ap}% ${ap}%)`,
  };
  const textStyle = {
    position: 'absolute',
    bottom: `${w / 10}px`,
    left: `${w / 10}px`,
    color: 'white',
    fontSize: `${w / 5}px`,
    opacity: appearance,
  };
  return render`
    <div style="${backgroundStyle}"></div>
    <div style="${positionStyle}">
      <div style="position:relative;width:100%;height:100%">
        <div style="${textStyle}">${modeToText.get(mode)}<br>${fpsText}FPS</div>
      </div>
    </div>
  `;
});

export default modeView;

windowSize.subscribe(({ width, height }) => {
  const canvasWidth = min(width, height) * 0.7;
  modeView.update(() => ({
    x: (width - canvasWidth * 1.05) / 2,
    y: (height + canvasWidth * 0.65) / 2,
    w: canvasWidth * 0.2,
  }));
});

fps.subscribe((f) => modeView.update(() => {
  const fpsInt = trunc(f * 100);
  const fpsText = `${trunc(fpsInt / 100)}.${(fpsInt % 100).toString().padStart(2, '0')}`;
  return { fpsText };
}));
