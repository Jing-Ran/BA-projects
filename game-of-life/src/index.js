// import css
import './scss/main.scss';
import initBoard, { endGame, resetBoard } from './scripts/game';

const gameControl = document.querySelector('.game-control');
const startBtn = document.querySelector('.button--start');
const stopBtn = document.querySelector('.button--stop');
const resetBtn = document.querySelector('.button--reset');

startBtn.addEventListener('click', () => {
  gameControl.classList.remove('scale-in');
  setTimeout(() => {
    gameControl.classList.add('scale-out');
  }, 100);

  setTimeout(() => {
    gameControl.classList.add('hidden');
    initBoard();
    stopBtn.classList.remove('hidden');
  }, 350);
});

stopBtn.addEventListener('click', () => {
  endGame();
  stopBtn.classList.add('hidden');
  resetBtn.classList.remove('hidden');
});

resetBtn.addEventListener('click', () => {
  resetBoard();
  resetBtn.classList.add('hidden');
  gameControl.classList.remove('hidden', 'scale-out');
  gameControl.classList.add('scale-in');
});