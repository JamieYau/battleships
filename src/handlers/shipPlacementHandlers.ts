import Game from "../modules/Game";
import Ship from "../modules/Ship";

export function handleDragStart(event: DragEvent) {
  const target = event.target as HTMLElement;
  target.classList.add("dragging");
  const ship = target.parentElement;
  ship?.classList.add("dragging");
  const shipLength = ship?.dataset.shipLength;
  if (!shipLength) return;
  console.log(shipLength);
  const dragEvent = event; // No need to cast here
  dragEvent.dataTransfer?.setData("text/plain", shipLength);
}

export function handleDragEnd(event: DragEvent) {
  const target = event.target as HTMLElement;
  target.classList.remove("dragging");
  const ship = target.parentElement;
  ship?.classList.remove("dragging");
}

export function handleDrop(event: DragEvent, game: Game) {
  event.preventDefault();
  const targetCell = event.target as HTMLElement;
  const shipLength = event.dataTransfer?.getData("text/plain");
  if (!shipLength) return;
  const row = parseInt(targetCell.dataset.row || "");
  const col = parseInt(targetCell.dataset.col || "");

  // Get the selected ship from the game
  const selectedShip = Game.shipList.find(
    (ship) => ship.length === parseInt(shipLength)
  );
  console.log(selectedShip);
  if (!selectedShip) return;
  // Check if the ship placement is valid using isValidPlacement
  if (
    game.player.gameboard.isValidPlacement(selectedShip, row, col, "horizontal")
  ) {
    // Handle ship placement here
    // Update ship positions on the grid
    console.log(`row: ${row}, col: ${col}`);
    console.log(`shipLength: ${shipLength}`);
  } else {
    console.log("Invalid placement"); // Handle invalid placement
  }
}
