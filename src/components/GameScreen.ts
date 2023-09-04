import Game from "../modules/Game";

export function renderGameScreen(game: Game) {
  const container = document.getElementById("app");
  const playerBoard = document.getElementById("player-board");
  if (!container) return;

  const template = `
        <div id="game-container">
            ${playerBoard?.outerHTML}
            <div id="ai-board" class="grid-container">
                ${generateGridCells()}
            </div>
        </div>
    `;

  container.innerHTML = template;
}

function generateGridCells(): string {
  let gridCells = "";
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      gridCells += `<div class="grid-cell" data-row="${row}" data-col="${col}"></div>`;
    }
  }
  return gridCells;
}
