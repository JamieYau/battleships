import "./assets/style.css";
import { showStartScreen } from "./components/StartScreen";
import { showShipPlacementScreen } from "./components/ShipPlacementScreen";

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

  // Show the ship placement screen UI
  showShipPlacementScreen(playerName);

  // Add event listener to the placement grid cells
  const gridCells = document.querySelectorAll(".grid-cell");
  gridCells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

  function handleCellClick(event: Event) {
    const cell = event.target as HTMLElement;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    console.log(`Clicked on row ${row}, col ${col}`);
  }
});
