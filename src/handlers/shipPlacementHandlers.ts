import Game from "../modules/Game";

export function handleSegmentMouseDown(event: MouseEvent) {
  return event.target as HTMLElement;
}

export function handleShipDragStart(
  event: DragEvent,
  shipItem: HTMLElement,
  segment: HTMLElement
) {
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
  targetCell.classList.remove("drag-over");
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
    const cellsToHighlight: HTMLElement[] = [];

    for (let i = 0; i < shipLength; i++) {
      let cell: HTMLElement | null = null;
      if (shipDirection === "horizontal") {
        cell = document.querySelector(
          `[data-row="${row}"][data-col="${col + i}"]`
        );
      } else {
        cell = document.querySelector(
          `[data-row="${row + i}"][data-col="${col}"]`
        );
      }
      if (cell) {
        cellsToHighlight.push(cell);
      }
    }

    cellsToHighlight.forEach((cell) => {
      if (cell) {
        cell.classList.add("ship");
      }
    });
  } else {
    console.log("Invalid placement");
  }
}
