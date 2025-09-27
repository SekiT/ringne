import dependencies from 'dependencies';

import view from '@/lib/view';
import modes from '@/stage/modes';
import fps from '@/subject/fps';

const { trunc } = dependencies.globals;

const initialState = {
  mode: modes.normal,
  fpsText: '60.00',
  appearance: 0,
};

export const modeToText = new Map([
  [modes.easy, 'EASY'],
  [modes.normal, 'NORMAL'],
  [modes.hard, 'HARD'],
]);

const canvasWidth = 'min(70vw, 70vh)';
const positionStyle = {
  position: 'absolute',
  left: `calc(50vw - ${canvasWidth} * 0.525)`,
  top: `calc(50vh + ${canvasWidth} * 0.325)`,
  width: `calc(${canvasWidth} * 0.2)`,
  height: `calc(${canvasWidth} * 0.2)`,
};

const modeView = view(initialState, (render) => ({
  mode, fpsText, appearance,
}) => {
  const ap = appearance * 100;
  const ap2 = ap / 2;
  const backgroundStyle = {
    ...positionStyle,
    backgroundColor: '#696',
    clipPath: `polygon(0 0, 0 50%, ${ap2}% ${50 + ap2}%, ${ap}% ${ap}%)`,
  };
  const textStyle = {
    position: 'absolute',
    bottom: `calc(${canvasWidth} * 0.02)`,
    left: `calc(${canvasWidth} * 0.02)`,
    color: 'white',
    fontSize: `calc(${canvasWidth} * 0.04)`,
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

fps.subscribe((f) => modeView.update(() => {
  const fpsInt = trunc(f * 100);
  const fpsText = `${trunc(fpsInt / 100)}.${(fpsInt % 100).toString().padStart(2, '0')}`;
  return { fpsText };
}));
