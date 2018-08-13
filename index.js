// U+29BB	⦻	e2 a6 bb	CIRCLE WITH SUPERIMPOSED X

const choose = require('choose');

const maxIsotope = choose(26, 13);

// adapted from https://math.stackexchange.com/a/1304748/185075
function isotopeToBoard(isotope) {
  if (isotope < 1 || isotope > maxIsotope)
    throw new Error(`Isotope out of range: ${isotope}`);

  let board = '';

  let leftX = 13;

  for (let i = 26; i > 0; --i) {
    const branch = choose(i - 1, leftX);
    if (isotope > branch) {
      board += 'x';
      isotope -= branch;
      --leftX;
    } else {
      board += 'o';
    }
  }

  return board;
}

function boardToIsotope(board) {
  board = board.toLowerCase();

  let isotope = 0;

  let leftX = 13;

  for (let i = 0; i < 26; ++i) {
    if (board[i] == 'x') {
      isotope += choose(25 - i, leftX);
      --leftX;
    } else if (board[i] == 'o') {
      // do nothing
    } else throw new Error(`Invalid board: ${
      JSON.stringify(board[i])} at position ${i}`);
  }

  return isotope + 1;
}

function boardToScore(board) {
  board = board.toLowerCase();
  let invalid = board.search(/[^xo]/);
  if (invalid > -1) {
    throw new Error(`Invalid board: ${
      JSON.stringify(board[invalid])} at position ${invalid}`);
  }

  // insert center space for consistent numbering
  board = board.slice(0, 13) + ' ' + board.slice(13);

  const scores = {x:0, o: 0};

  // add three-in-a-row not going through nucleus
  function tallyFaceLine(start, run) {
    switch (board[start] + board[start + run] + board[start + run + run]) {
      case 'xxx':
      case 'ooo':
        ++scores[board[start]];
    }
  }

  // add three-in-a-row going through nucleus
  function tallyNuclearLine(start, run) {
    switch (board[start] + board[start + run + run]) {
      case 'xx':
      case 'oo':
        ++scores[board[start]];
    }
  }

  for (let side = 0; side < 2; ++side) {
    for (let i = 0; i < 4; ++i) {
      // rows
      tallyFaceLine(i*3 + side*15, 1);
      // cross-slice columns
      tallyFaceLine(i + side*5, 9);
    }
    for (let col = 0; col < 3; ++col) {
      // same-slice columns
      tallyFaceLine(col + side*18, 3);
    }
    // middle slice side column
    tallyFaceLine(9 + side*2, 3);
    // same-slice upright diagonal
    tallyFaceLine(2 + side*18, 2);
    // same-slice downright diagonal
    tallyFaceLine(0 + side*18, 4);
    // cross-slice side upward diagonal
    tallyFaceLine(6 + side*2, 6);
    // cross-slice side downward diagonal
    tallyFaceLine(0 + side*2, 12);
  }

  // cross-slice center column
  tallyNuclearLine(4, 9);
  // middle slice center column
  tallyNuclearLine(10, 3);
  // middle slice center row
  tallyNuclearLine(12, 1);
  // diagonals
  tallyNuclearLine(0, 13);
  tallyNuclearLine(2, 11);
  tallyNuclearLine(6, 7);
  tallyNuclearLine(8, 5);

  return scores;
}

function isotopeToScore(isotope) {
  return boardToScore(isotopeToBoard(isotope));
}

module.exports = {
  maxIsotope,
  isotopeToBoard,
  boardToIsotope,
  boardToScore,
  isotopeToScore
};
