import Game from "../modules/Game";
import { generateGridCells } from "./ShipPlacementScreen";

export function renderGameScreen(game: Game) {
  const container = document.getElementById("app");
  const playerBoard = document.getElementById("player-board");
  if (!container) return;

  const template = `
        <div id="game-container">
          <div class="player-container">
            <h2>${game.player.name}</h2>
            ${playerBoard?.outerHTML}
          </div>
          <div class="player-container">
            <h2>AI</h2>
            <div id="ai-board" class="grid-container">
              ${generateGridCells()}
            </div>
          </div>
        </div>
        <div id="game-modal" class="modal hidden">
          <div class="modal-content">
            <h2></h2>
            <button id="play-again-btn">Play again</button>
          </div>
        </div>
    `;

  container.innerHTML = template;
}

export function renderModalContent(name: string) {
  const modal = document.getElementById("game-modal") as HTMLDivElement;
  const winnerText = modal.querySelector("h2") as HTMLHeadingElement;
  winnerText.textContent = `${name} wins!`;
  modal.classList.remove("hidden");
}
