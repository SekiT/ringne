import { view } from '@/lib/view';
import windowSize from '@/subject/windowSize';
import dependencies from 'dependencies';

const { createElement } = dependencies.globals;

const element = createElement('canvas');
element.width = 400;
element.height = 400;

export const context = element.getContext('2d');

export const canvasView = view({ width: 0 }, (render) => ({ width }) => {
  Object.assign(element.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `${width}px`,
    height: `${width}px`,
  });
  return render`${element}`;
});

windowSize.subscribe(({ width: w, height: h }) => {
  const width = Math.min(w * 0.7, h * 0.7);
  canvasView.update(() => ({ width }));
});
