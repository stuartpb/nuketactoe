const ntt = require('./index.js');
const test = require('tape-catch');

const {maxIsotope} = ntt;

const fixtures = [
  [         1, 'oooooooooooooxxxxxxxxxxxxx', {x: 9, o: 9}],
  [maxIsotope, 'xxxxxxxxxxxxxooooooooooooo', {x: 9, o: 9}],
];

const monteCarloFactor = 25;

test('board to isotope', t => {
  t.plan(fixtures.length);
  for (let [isotope, board] of fixtures)
    t.equal(ntt.boardToIsotope(board), isotope,
      `boardToIsotope for isotope ${isotope}`);
});

test('isotope to board', t => {
  t.plan(fixtures.length);
  for (let [isotope, board] of fixtures)
    t.equal(ntt.isotopeToBoard(isotope), board,
      `isotopeToBoard for isotope ${isotope}`);
});

test('scoring', t => {
  t.plan(fixtures.length);
  for (let [isotope, board, score] of fixtures)
    t.deepEqual(ntt.boardToScore(board), score,
      `score for isotope ${isotope}`);
});

test('round trip', t => {
  t.plan(monteCarloFactor);
  for (let i = 0; i < monteCarloFactor; ++i) {
    let isotope = Math.trunc(Math.random() * maxIsotope) + 1;
    t.equal(ntt.boardToIsotope(ntt.isotopeToBoard(isotope)),
      isotope, `round trip for isotope ${isotope}`);
  }
});
