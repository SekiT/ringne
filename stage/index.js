import dependencies from 'dependencies';
import one from './1';

const { min, trunc } = dependencies.globals;

const stages = [one];
const lastIndex = stages.length - 1;

export default (level) => stages[min(trunc(level / 10), lastIndex)];
