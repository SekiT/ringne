import { view, toCssText } from '@/lib/view';
import windowSize from '@/subject/windowSize';
import fps from '@/subject/fps';
import modes from '@/stage/modes';
import dependencies from 'dependencies';

const { min, trunc } = dependencies.globals;

const initialState = {
  mode: modes.normal,
  fps: 60,
};

const modeToText = new Map([
  [modes.easy, 'EASY'],
  [modes.normal, 'NORMAL'],
  [modes.hard, 'HARD'],
]);

const modeView = view(initialState, (render) => ({
  mode, fpsText, x, y, w,
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
    backgroundColor: '#996',
    clipPath: 'polygon(0 50%, 50% 100%, 100% 100%, 0 0)',
  });
  const textStyle = toCssText({
    position: 'absolute',
    bottom: `${w / 10}px`,
    left: `${w / 10}px`,
    color: 'white',
    fontSize: `${w / 5}px`,
  });
  return render`
    <div style="${backgroundStyle}"></div>
    <div style="${toCssText(positionStyle)}">
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
