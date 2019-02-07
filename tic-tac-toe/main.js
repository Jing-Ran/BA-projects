(function ($) {
  let rows;
  let cols;
  let diagonal;
  let antiDiagonal;
  let count;
  let boardSet;
  const n = 3; // Boardsize => Default set to 3
  // const $board = $('.board');
  const $cells = $('.cell');
  const $overlay = $('.overlay');
  const $restartBtn = $('.restart');

  function initData(boardSize = 3) {
    // Boardsize => Default set to 3
    rows = Array(n).fill(0);
    cols = Array(n).fill(0);
    diagonal = 0;
    antiDiagonal = 0;
    count = boardSize * boardSize;
    boardSet = new Set();
  }

  function move(row, col, player) {
    count--;
    const toAdd = player === 1 ? 1 : -1;
    const r = parseInt(row, 10);
    const c = parseInt(col, 10);
    console.log(r, c, player);

    rows[r] += toAdd;
    cols[c] += toAdd;
    if (r === c) diagonal += toAdd;
    if (r === n - 1 - c) antiDiagonal += toAdd;
    console.log(rows, cols, diagonal, antiDiagonal);

    // If r or c or diagonal or antiDiagonal is equal to n,
    // then there is a winner
    if (Math.abs(rows[r]) === n
      || Math.abs(cols[c]) === n
      || Math.abs(diagonal) === n
      || Math.abs(antiDiagonal) === n) {
      return player;
    }

    // If not, there is no winner (so far)
    return 0;
  }

  function addImg(container, player) {
    console.log('add img');
    if (player === 1) {
      console.log('if');
      container.html(`<img src="images/X.png">`);
    } else if (player === 0) {
      console.log('else if');
      container.html(`<img src="images/X.png">
      <img src="images/O.png">`);
    } else {
      console.log('else');
      container.html(`<img src="images/O.png">`);
    }
  }

  function randomNum() {
    return Math.floor(Math.random() * n);
  }

  // Add marked cell to boardSet
  function addMarkedCell(coord) {
    if (!boardSet.has(coord)) {
      boardSet.add(coord);
    }
  }

  function xMove(e) {
    const $currentCell = $(e.currentTarget);
    const [$r, $c] = [$currentCell.data('row'), $currentCell.data('col')];
    const coord = `${$r}${$c}`;
    const result = move($r, $c, 1);
    console.log('move result', result);
    // Once a cell is clicked, disable its click event
    $currentCell.addClass('marked');
    // cell.addClass('marked');
    addImg($currentCell, 1);
    addMarkedCell(coord);

    // if the game should continue
    if (result === 0 && count > 0) { // game continues
      console.log('continue');
      oMove();
    } else {
      console.log('end', result);
      // return result;
      endGame(result);
    }
  }

  function oMove() {
    let coord = `${randomNum()}${randomNum()}`;
    while (boardSet.has(coord)) {
      coord = `${randomNum()}${randomNum()}`;
    }
    const [r, c] = coord.split('');
    const $cell = $(`.cell[data-row=${r}][data-col=${c}]`);
    const result = move(r, c, -1);
    console.log('move result', result);
    // Once a cell is clicked, disable its click event
    $cell.addClass('marked');

    addImg($cell, -1);
    addMarkedCell(coord);

    // if the game should continue
    if (result === 0 && count > 0) { // game continues
      console.log('continue');
    } else {
      console.log('end', result);
      // return result;
      endGame(result);
    }
  }

  function endGame(gameResult) {
    console.log('end game');
    addImg($('.overlay__img'), gameResult);
    if (gameResult === 0) {
      $('.overlay__text').text('Draw!');
    } else {
      $('.overlay__text').text('Winner!');
    }

    $overlay.addClass('show-winner');
    $('h2').text('Game Over');
  }

  function resetGame() {
    console.log(boardSet);
    initData();
    console.log(rows, cols, diagonal, antiDiagonal);

    $overlay.removeClass('show-winner');
    $('.overlay__text').empty();
    $('.overlay__img').empty();
    $('h2').text('Play Against the Computer');

    $cells.removeClass('marked').empty();
  }

  $cells.on('click', xMove);
  $restartBtn.on('click', resetGame);

  // Init Game
  initData();
})(jQuery);