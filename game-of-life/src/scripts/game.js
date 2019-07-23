const canvas = document.querySelector('.game-board');
const ctx = canvas.getContext('2d');
const cellSize = 5;
const canvasSize = 500;
const boardSize = canvasSize / cellSize;
let timeout;

function setCanvasSize() {
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
}

function createNewStateBoard(boardSize, random = false) {
  const arr = [];
  for (let i = 0; i < boardSize; i++) {
    if (random) {
      arr[i] = [];
      for (let j = 0; j < boardSize; j++) {
        arr[i][j] = randomState();
      }
    } else {
      arr[i] = new Array(boardSize);
    }
  }
  return arr;
}

function randomState() {
  return Math.round(Math.random());
}

function calcLiveNeighbors(i, j, stateBoard) {
  let count = 0;
  for (let x = Math.max(i - 1, 0); x <= Math.min(i + 1, stateBoard.length - 1); x++) {
    for (let y = Math.max(j - 1, 0); y <= Math.min(j + 1, stateBoard.length - 1); y++) {
      count += stateBoard[x][y];
    }
  }
  if (stateBoard[i][j] === 1) count--;
  return count;
}

function generateNextStateBoard(currentState) {
  const nextState = createNewStateBoard(boardSize);
  for (let i = 0; i < currentState.length; i++) {
    for (let j = 0; j < currentState.length; j++) {
      const liveNeighborNum = calcLiveNeighbors(i, j, currentState);
      const cell = currentState[i][j];
      // console.log(liveNeighborNum, i, j);
      if (cell === 0 && liveNeighborNum === 3) nextState[i][j] = 1;
      else if (cell === 1 && (liveNeighborNum < 2 || liveNeighborNum > 3))
        nextState[i][j] = 0;
      else nextState[i][j] = cell;
    }
  }
  return nextState;
}

function populateUi(nextState) {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  for (let i = 0; i < nextState.length; i++) {
    for (let j = 0; j < nextState.length; j++) {
      if (nextState[i][j] === 1) {
        ctx.fillStyle = 'black';
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
}

function updateBoard(currentState) {
  console.log('update');
  const nextState = generateNextStateBoard(currentState);
  populateUi(nextState);
  // updateBoard(nextState);
  timeout = window.setTimeout(() => {
    updateBoard(nextState);
  }, 100);
}

export function endGame() {
  window.clearTimeout(timeout);
}

export function resetBoard() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
}

export default function initBoard() {
  const initialState = createNewStateBoard(boardSize, true);
  setCanvasSize();


  updateBoard(initialState);
}

