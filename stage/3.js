const three = (time = 0) => () => three(time + 1);

export default three;
