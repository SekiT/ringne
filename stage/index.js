import dependencies from 'dependencies';
import one from './1';
import two from './2';

const { min, trunc } = dependencies.globals;

const stages = [one, two];
const lastIndex = stages.length - 1;

export default (level) => stages[min(trunc((level - 1) / 10), lastIndex)];
