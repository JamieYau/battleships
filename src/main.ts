import "./assets/style.css";
import { showStartScreen } from "./components/StartScreen";
import { showShipPlacementScreen } from "./components/ShipPlacementScreen";
import Gameboard from "./modules/Gameboard";
import Game from "./modules/Game";

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

  // Add event listener to the placement grid cells
  function handleCellClick(event: Event) {
    const cell = event.target as HTMLElement;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    if (!row || !col) return;
    // use the game module's ship list
    console.log(`row: ${row}, col: ${col}`);
  }

  const gridCells = document.querySelectorAll(".grid-cell");
  gridCells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

  // Attach event listeners for ship segments
  const shipSegments = document.querySelectorAll(".ship-segment") as NodeListOf <HTMLDivElement>;
  shipSegments.forEach((segment) => {
    segment.addEventListener("dragstart", (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      event.target.classList.add("dragging");
      const shipLength = event.target.parentElement?.dataset.shipLength;
      if (!shipLength) return;
      console.log(shipLength);
      event.dataTransfer?.setData("text/plain", shipLength);
    });

    segment.addEventListener("dragend", (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      event.target.classList.remove("dragging");
    });
  });
});
