import Game from "../modules/Game";

export function handleSegmentMouseDown(event: MouseEvent) {
  return event.target as HTMLElement;
}

export function handleShipDragStart(event: DragEvent, shipItem: HTMLElement, segment: HTMLElement) {
  segment.classList.add("dragging");
  shipItem.classList.add("dragging");

  const shipItemId = shipItem.dataset.id;
  const segmentIndex = parseInt(segment.dataset.index || "");

  const data = {
    shipId: shipItemId,
    segmentIndex: segmentIndex,
  };

  event.dataTransfer?.setData("application/json", JSON.stringify(data));
}

export function handleShipDragEnd(segment: HTMLElement, shipItem: HTMLElement) {
  segment.classList.remove("dragging");
  shipItem.classList.remove("dragging");
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

  if (!shipItem) return;

  const shipDirection = shipItem.classList.contains("horizontal")
    ? "horizontal"
    : "vertical";
  const shipLength = parseInt(shipItem.dataset.shipLength || "");

  let row = parseInt(targetCell.dataset.row || "");
  let col = parseInt(targetCell.dataset.col || "");

  if (shipDirection === "horizontal") {
    col -= segmentIndex;
  } else {
    row -= segmentIndex;
  }

  if (
    game.player.gameboard.isValidPlacement(shipLength, row, col, shipDirection)
  ) {
    // Handle ship placement here
    console.log(`row: ${row}, col: ${col}`);
    console.log(`shipLength: ${shipLength}`);
  } else {
    console.log("Invalid placement");
  }
}
