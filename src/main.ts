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

  const gridCells = document.querySelectorAll(".grid-cell");
  gridCells.forEach((cell) => {
    cell.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    cell.addEventListener("drop", (event: Event) => {
      event.preventDefault();
      const targetCell = event.target as HTMLElement; // Cast to HTMLElement
      const shipLength = (event as DragEvent).dataTransfer?.getData(
        "text/plain"
      );
      if (!shipLength) return;

      // Handle ship placement here
      const row = parseInt(targetCell.dataset.row || "");
      const col = parseInt(targetCell.dataset.col || "");
      // Update ship positions on the grid
      console.log(`row: ${row}, col: ${col}`);
      console.log(`shipLength: ${shipLength}`);
    });
  });

  // Attach event listeners for ship segments
  const shipSegments = document.querySelectorAll(
    ".ship-segment"
  ) as NodeListOf<HTMLDivElement>;
  shipSegments.forEach((segment) => {
    segment.addEventListener("dragstart", (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      event.target.classList.add("dragging");
      const ship = event.target.parentElement;
      ship?.classList.add("dragging");
      const shipLength = ship?.dataset.shipLength;
      if (!shipLength) return;
      console.log(shipLength);
      const dragEvent = event as DragEvent; // Cast to DragEvent
      dragEvent.dataTransfer?.setData("text/plain", shipLength);
    });

    segment.addEventListener("dragend", (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      event.target.classList.remove("dragging");
      const ship = event.target.parentElement;
      ship?.classList.remove("dragging");
    });
  });
});
