import {
  canvasView, canvasContext as context, canvasWidth, center, boardRadius, clearCanvas,
} from '@/view/canvas';
import levelView from '@/view/level';
import modeView, { modeToText } from '@/view/mode';
import deathsView from '@/view/deaths';
import eventView from '@/view/event';
import dependencies from 'dependencies';
import ids from './ids';

const { pi2, min, trunc } = dependencies.globals;

const drawBackground = (opacity) => {
  context.save();
  context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  context.arc(center, center, boardRadius, 0, pi2);
  context.restore();
};

const drawTitle = (opacity) => {
  context.save();
  context.beginPath();
  context.fillStyle = `rgba(0, 0, 0, ${opacity})`;
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 10;
  context.font = `${canvasWidth / 4}px serif`;
  context.textAlign = 'center';
  context.fillText('解脱', center, center - canvasWidth / 8);
  context.closePath();
  context.restore();
};

const drawSubtitle = (opacity) => {
  context.save();
  context.beginPath();
  context.fillStyle = `rgba(0, 0, 0, ${opacity})`;
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 10;
  context.font = `${canvasWidth / 10}px serif`;
  context.textAlign = 'center';
  context.fillText('GAME OVER', center, center);
  context.closePath();
  context.restore();
};

const framesToTimeText = (frames) => {
  const s = frames / 60;
  const minutes = trunc(s / 60).toString().padStart(2, '0');
  const seconds = (trunc(s) % 60).toString().padStart(2, '0');
  const milliseconds = trunc((s - trunc(s)) * 1000).toString().padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
};

const drawResult = (mode, deaths, timeText, opacity) => {
  context.save();
  context.beginPath();
  context.fillStyle = `rgba(0, 0, 0, ${opacity})`;
  context.font = `${canvasWidth / 20}px serif`;
  context.textAlign = 'center';
  context.fillText(`Mode: ${modeToText.get(mode)}`, center, center + canvasWidth * 0.1);
  context.fillText(`Death${deaths >= 2 ? 's' : ''}: ${deaths}`, center, center + canvasWidth * 0.2);
  context.fillText(`Time: ${timeText}`, center, center + canvasWidth * 0.3);
};

export default (time = 0, timeText = null) => ({ mode, deaths, frames }) => {
  if (time > 690) {
    return {
      nextId: ids.over,
      nextArgs: [time, timeText],
      stateUpdate: {},
    };
  }
  if (time <= 120) {
    const appearance = 1 - time / 120;
    levelView.update(() => ({ appearance, level: 100 }));
    modeView.update(() => ({ appearance }));
    deathsView.update(() => ({ appearance }));
    eventView.update(() => ({ appearance }));
    canvasView.update(() => ({ opacity: appearance }));
  }
  if (time >= 120 && time <= 420) {
    const c1 = trunc((time - 120) * (255 / 300));
    const c2 = trunc((c1 + 102) / 2);
    const color1 = `rgb(${c1}, ${c1}, ${c1})`;
    const color2 = `rgb(${c2}, ${c2}, ${c2})`;
    document.body.style.backgroundImage = `radial-gradient(circle closest-side, ${color1} 60%, ${color2} 100%, #666 200%)`;
  }
  if (time === 420) {
    canvasView.update(() => ({ opacity: 1 }));
  }
  if (time >= 420) {
    clearCanvas();
    drawBackground(min((time - 420) / 120, 1));
  }
  if (time >= 420) drawTitle(min((time - 420) / 120, 1));
  if (time >= 570) drawSubtitle(min((time - 570) / 60, 1));
  if (time >= 630) drawResult(mode, deaths, timeText, min((time - 630) / 60, 1));
  return {
    nextId: ids.over,
    nextArgs: [time + 1, timeText || framesToTimeText(frames)],
    stateUpdate: {},
  };
};
