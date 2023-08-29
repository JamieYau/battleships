import "./assets/style.css";
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
} from "./handlers/shipPlacementHandlers";

showStartScreen();

const form = document.getElementById("start-form") as HTMLFormElement;
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const playerNameInput = document.getElementById(
    "player-name"
  ) as HTMLInputElement;
  let playerName = playerNameInput.value.trim(); // Remove leading/trailing whitespace

  // If the player name is empty, set it to "Player"
  if (!playerName) {
    playerName = "Player";
  }

  const game = new Game(playerName, new Gameboard());
  // Show the ship placement screen UI
  showShipPlacementScreen(playerName);

  let shipInfo: { shipId: string; segmentIndex: number; } | null = null; // Declare shipInfo outside of the event listeners

  // Attach event listeners for ship items
  const shipItems = document.querySelectorAll(
    ".ship-item"
  ) as NodeListOf<HTMLDivElement>;
  shipItems.forEach((shipItem) => {
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
  const gridCells = document.querySelectorAll(
    ".grid-cell"
  ) as NodeListOf<HTMLDivElement>;
  gridCells.forEach((cell) => {
    cell.addEventListener("dragover", (event) => {
      if (!shipInfo) return;
      handleDragOver(event, shipInfo);
    });
    cell.addEventListener("dragleave", () => {
      handleDragLeave();
    });
    cell.addEventListener("drop", (event) => {
      if (!shipInfo) return;
      handleDrop(event, shipInfo, game);
      shipInfo = null;
    });
  });
});
