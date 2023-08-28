import Game from "../modules/Game";

export function handleDragStart(event: DragEvent) {
  const segment = event.target as HTMLElement;
  segment.classList.add("dragging");
  const shipItem = segment.parentElement;
  shipItem?.classList.add("dragging");
  const shipItemId = shipItem?.dataset.id;
  const segmentIndex = parseInt(segment.dataset.index || "");

  const data = {
    shipId: shipItemId,
    segmentIndex: segmentIndex,
  };

  event.dataTransfer?.setData("application/json", JSON.stringify(data));
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
  const dataString = event.dataTransfer?.getData("application/json");
  if (!dataString) return;
  const data = JSON.parse(dataString);
  const shipId = data.shipId;
  const segmentIndex = data.segmentIndex;

  const shipItem = document.querySelector(
    `[data-id="${shipId}"]`
  ) as HTMLElement;
  console.log(shipItem);
  // Get the selected ship from the game
  const selectedShip = Game.shipList.find(
    (ship) => ship.length === parseInt(shipItem?.dataset.shipLength || "")
  );
  if (!selectedShip) return;

  let row = parseInt(targetCell.dataset.row || "");
  let col = parseInt(targetCell.dataset.col || "");

  if (shipItem.classList.contains("horizontal")) {
    col -= segmentIndex;
  } else {
    row -= segmentIndex;
  }
  // Check if the ship placement is valid using isValidPlacement
  if (
    game.player.gameboard.isValidPlacement(selectedShip, row, col, "horizontal")
  ) {
    // Handle ship placement here
    // Update ship positions on the grid
    console.log(`row: ${row}, col: ${col}`);
    console.log(`shipLength: ${selectedShip.length}`);
  } else {
    console.log("Invalid placement"); // Handle invalid placement
  }
}
