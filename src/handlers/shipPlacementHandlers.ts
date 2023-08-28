import Game from "../modules/Game";


let currentDraggingShip: HTMLElement | null = null;
let currentDraggingSegment: HTMLElement | null = null;

export function handleSegmentMouseDown(
  event: MouseEvent,
  shipItem: HTMLElement,
  segment: HTMLElement
) {

  // Store the segment and ship-item for later use
  currentDraggingShip = shipItem;
  currentDraggingSegment = segment;
}

export function handleShipDragStart(
  event: DragEvent,
  shipItem: HTMLElement
) {
  if (!currentDraggingSegment) return;

  currentDraggingSegment.classList.add("dragging");
  shipItem.classList.add("dragging");

  const shipItemId = shipItem.dataset.id;
  const segmentIndex = parseInt(currentDraggingSegment.dataset.index || "");

  const data = {
    shipId: shipItemId,
    segmentIndex: segmentIndex,
  };

  event.dataTransfer?.setData("application/json", JSON.stringify(data));
}

export function handleShipDragEnd(event: DragEvent) {
  if (!currentDraggingShip || !currentDraggingSegment) return;

  currentDraggingSegment.classList.remove("dragging");
  currentDraggingShip.classList.remove("dragging");

  currentDraggingShip = null;
  currentDraggingSegment = null;
}

export function handleDrop(event: DragEvent, game: Game) {
  event.preventDefault();
  const targetCell = event.target as HTMLElement;
  const dataString = event.dataTransfer?.getData("application/json");

  if (!dataString || !currentDraggingShip) return;

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

  currentDraggingShip = null;
}
