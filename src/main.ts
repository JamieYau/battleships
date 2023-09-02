import "./assets/style.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { showStartScreen } from "./components/StartScreen";
import { showShipPlacementScreen } from "./components/ShipPlacementScreen";
import Gameboard from "./modules/Gameboard";
import Game from "./modules/Game";
import {
  handleShipDragStart,
  handleDragOver,
  handleShipDragEnd,
  handleDrop,
  handleDragLeave,
  handleRotate,
  handleClearBoard,
} from "./handlers/shipPlacementHandlers";

showStartScreen();

const form = document.getElementById("start-form") as HTMLFormElement;
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const playerNameInput = document.getElementById(
    "player-name"
  ) as HTMLInputElement;
  let playerName = playerNameInput.value.trim();

  // If the player name is empty, set it to "Player"
  if (!playerName) {
    playerName = "Player";
  }

  const game = new Game(playerName, new Gameboard());
  const player = game.player;
  // Show the ship placement screen UI
  showShipPlacementScreen(playerName, player.ships);

  let shipInfo: { shipId: string; segmentIndex: number | null } | null = null;

  const shipItems = document.querySelectorAll(
    ".ship-item"
  ) as NodeListOf<HTMLDivElement>;
  const gridCells = document.querySelectorAll(
    ".grid-cell"
  ) as NodeListOf<HTMLDivElement>;

  // Clear board btn
  const clearShipsBtn = document.getElementById("clear-btn");
  clearShipsBtn?.addEventListener("click", () => {
    handleClearBoard(player, gridCells)
  });

  // Attach event listeners for ship items
  shipItems.forEach((shipItem) => {
    shipItem.addEventListener("click", () => {
      shipInfo = { shipId: shipItem.dataset.id!, segmentIndex: null };
    });
    const segments = shipItem.querySelectorAll(
      ".ship-segment"
    ) as NodeListOf<HTMLDivElement>;
    segments.forEach((segment) => {
      segment.addEventListener("mousedown", () => {
        shipItem.addEventListener("dragstart", () => {
          shipInfo = handleShipDragStart(shipItem, segment);
        });
        shipItem.addEventListener("dragend", () => {
          handleShipDragEnd(segment, shipItem);
        });
      });
    });
  });

  // Attach event listeners for grid cells
  gridCells.forEach((cell) => {
    cell.addEventListener("dragover", (e: DragEvent) => {
      if (!shipInfo) return;
      handleDragOver(e, shipInfo);
    });
    cell.addEventListener("dragleave", () => {
      handleDragLeave();
    });
    cell.addEventListener("drop", (e: DragEvent) => {
      if (!shipInfo) return;
      handleDrop(e, shipInfo, player);
    });
  });

  // Rotate btn
  const rotateBtn = document.getElementById("rotate-btn") as HTMLButtonElement;
  rotateBtn.addEventListener("click", () => {
    if (shipInfo?.shipId != undefined) {
      handleRotate(shipInfo?.shipId, player);
    }
  });
});
