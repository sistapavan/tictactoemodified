document.getElementById('start-game').addEventListener('click', startGame);

let board = [];
let currentPlayer = 'X';
let gameActive = true;

function startGame() {
  const rows = parseInt(document.getElementById('rows').value);
  const columns = parseInt(document.getElementById('columns').value);
  const player1 = document.getElementById('player1').value || 'Player 1';
  const player2 = document.getElementById('player2').value || 'Player 2';

  if (rows < 3 || columns < 3) {
    alert('Please choose at least 3x3 grid!');
    return;
  }

  createBoard(rows, columns);
  document.getElementById('message').textContent = `${player1}'s (X) turn`;
}

function createBoard(rows, columns) {
  board = Array(rows).fill().map(() => Array(columns).fill(''));
  const boardContainer = document.getElementById('board');
  boardContainer.innerHTML = '';
  boardContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  boardContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.dataset.row = i;
      square.dataset.col = j;
      square.addEventListener('click', handleSquareClick);
      boardContainer.appendChild(square);
    }
  }

  gameActive = true;
  currentPlayer = 'X';
}

function handleSquareClick(event) {
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;

  if (board[row][col] !== '' || !gameActive) return;

  board[row][col] = currentPlayer;
  event.target.textContent = currentPlayer;

  if (checkWinner(row, col)) {
    document.getElementById('message').textContent = `${currentPlayer} wins!`;
    gameActive = false;
  } else if (board.flat().every(cell => cell !== '')) {
    document.getElementById('message').textContent = 'It\'s a tie!';
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const nextPlayer = currentPlayer === 'X' ? document.getElementById('player1').value || 'Player 1' : document.getElementById('player2').value || 'Player 2';
    document.getElementById('message').textContent = `${nextPlayer}'s (${currentPlayer}) turn`;
  }
}

function checkWinner(row, col) {
  row = parseInt(row);
  col = parseInt(col);
  const winDirections = [
    { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: -1 }
  ];

  return winDirections.some(direction => {
    return countConsecutive(row, col, direction.r, direction.c) + countConsecutive(row, col, -direction.r, -direction.c) >= 2;
  });
}

function countConsecutive(row, col, rStep, cStep) {
  let count = 0;
  let i = row + rStep;
  let j = col + cStep;

  while (i >= 0 && i < board.length && j >= 0 && j < board[0].length && board[i][j] === currentPlayer) {
    count++;
    i += rStep;
    j += cStep;
  }

  return count;
}
