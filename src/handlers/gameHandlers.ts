import Game from "../modules/Game";

export function handleHover(target: HTMLElement) {
  if (target.hasChildNodes()) {
    target.classList.remove("hover");
    return;
  }
  target.classList.add("hover");
}

export function handleLeaveCell(target: HTMLElement) {
  target.classList.remove("hover");
  target.classList.remove("invalid");
}

export function handleAttack(game: Game, aiCell: HTMLDivElement) {
  const row = Number(aiCell.dataset.row);
  const col = Number(aiCell.dataset.col);
  let playerTurn = false;
  while (!playerTurn) {
    playerTurn = game.takeTurn(row, col);
  }
  // mark attack on the grid
  const result = game.ai.gameboard.board[row][col].state;
  const aicellState = document.createElement("div");
  aicellState.classList.add(result);
  aiCell.appendChild(aicellState);
  if (game.checkForWinner()) {
    const winner = game.winner;
    setTimeout(() => {
      alert(`${winner?.name} wins!`);
    }, 100);
  }
  handleHover(aiCell);

  // AI Turn
  let aiTurn = false;
  while (!aiTurn) {
    aiTurn = game.takeTurn(0, 0);
  }
  // mark attack on the grid
  const [aiRow, aiCol] = game.ai.move;
  const playerCell = document.querySelector(
    `.grid-cell[data-row="${aiRow}"][data-col="${aiCol}"]`
  ) as HTMLDivElement;
  const aiResult = game.player.gameboard.board[aiRow][aiCol].state;
  const playerCellState = document.createElement("div");
  playerCellState.classList.add(aiResult);
  playerCell.appendChild(playerCellState);

  if (game.checkForWinner()) {
    const winner = game.winner;
    alert(`${winner?.name} wins!`);
  }
}
