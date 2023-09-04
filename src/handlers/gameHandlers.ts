import Game from "../modules/Game";

export function handleAttack(game: Game, aiCell: HTMLDivElement) {
  const row = Number(aiCell.dataset.row);
  const col = Number(aiCell.dataset.col);
  let playerTurn = false;
  while (!playerTurn) {
    playerTurn = game.takeTurn(row, col);
  }
  // mark attack on the grid
  const result = game.ai.gameboard.board[row][col].state;
  aiCell.classList.add(result);
  if (game.checkForWinner()) {
    const winner = game.winner;
    alert(`${winner} wins!`);
  }

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
  playerCell.classList.add(aiResult);

  if (game.checkForWinner()) {
    const winner = game.winner;
    alert(`${winner?.name} wins!`);
  }
}
