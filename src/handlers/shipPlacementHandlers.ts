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

  const shipDirection = shipItem.classList.contains("horizontal")
    ? "horizontal"
    : "vertical";
  const shipLength = shipItem.dataset.shipLength || "";

  const data = {
    shipId: shipItemId,
    segmentIndex: segmentIndex,
  };

  event.dataTransfer?.setData("application/json", JSON.stringify(data));

  return { shipDirection, shipLength, segmentIndex };
}

export function handleDragOver(
  event: DragEvent,
  shipInfo: { shipDirection: string; shipLength: string; segmentIndex: number }
) {
  event.preventDefault();
  const targetCell = event.target as HTMLElement;
  if (!shipInfo) return;

  const shipDirection = shipInfo.shipDirection;
  const shipLength = parseInt(shipInfo.shipLength || "");
  const segmentIndex = shipInfo.segmentIndex;

  let row = parseInt(targetCell.dataset.row || "");
  let col = parseInt(targetCell.dataset.col || "");

  if (shipDirection === "horizontal") {
    col -= segmentIndex;
  } else {
    row -= segmentIndex;
  }

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

  // Remove the 'drag-over' class from all cells
  const gridCells = document.querySelectorAll(".grid-cell");
  gridCells.forEach((cell) => {
    cell.classList.remove("drag-over");
  });

  // Add the 'drag-over' class to the cells to highlight
  cellsToHighlight.forEach((cell) => {
    cell.classList.add("drag-over");
  });
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
