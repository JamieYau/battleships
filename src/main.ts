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
});
