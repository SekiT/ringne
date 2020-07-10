import none from '@/event/none';

const three = (time = 0) => () => ({ enemies: [], nextStage: three(time + 1), evt: none() });

export default three;
