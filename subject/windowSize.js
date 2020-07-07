import dependencies from 'dependencies';
import subject from '@/lib/subject';

const { window } = dependencies.globals;

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const windowSize = subject(getSize());

window.addEventListener('resize', () => windowSize.next(getSize));

export default windowSize;
