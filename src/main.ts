import "./assets/style.css";
import { showStartScreen } from "./components/StartScreen";
import { showShipPlacementScreen } from "./components/ShipPlacementScreen";
import Gameboard from "./modules/Gameboard";
import Game from "./modules/Game";
import {
  handleDragStart,
  handleDragEnd,
  handleDrop,
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

  // Attach event listeners for ship segments
  const shipSegments = document.querySelectorAll(
    ".ship-segment"
  ) as NodeListOf<HTMLDivElement>;
  shipSegments.forEach((segment) => {
    segment.addEventListener("dragstart", handleDragStart);
    segment.addEventListener("dragend", handleDragEnd);
  });

  // Attach event listeners for grid cells
  const gridCells = document.querySelectorAll(
    ".grid-cell"
  ) as NodeListOf<HTMLDivElement>;
  gridCells.forEach((cell) => {
    cell.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    cell.addEventListener("drop", handleDrop);
  });
});
