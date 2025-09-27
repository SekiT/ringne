import subject from '@/lib/subject';

let times = [];

const fps = subject(0);

export default fps;

export const pushTime = (time) => {
  times.push(time);
  if (times.length === 6) {
    fps.next(() => 5000 / (time - times[0]));
    times = [];
  }
};
