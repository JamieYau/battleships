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

  const segmentIndex = parseInt(segment.dataset.index || "");
  const shipDirection = shipItem.classList.contains("horizontal")
    ? "horizontal"
    : "vertical";
  const shipLength = shipItem.dataset.shipLength || "";

  return {shipDirection, shipLength, segmentIndex };
}

// Helper function to get cells to highlight
function getCellsToHighlight(
  shipDirection: string,
  shipLength: number,
  row: number,
  col: number
): HTMLElement[] {
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

  return cellsToHighlight;
}

export function handleDragOver(
  event: DragEvent,
  shipInfo: {shipDirection: string; shipLength: string; segmentIndex: number }
) {
  event.preventDefault();
  const targetCell = event.target as HTMLElement;
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

  const cellsToHighlight = getCellsToHighlight(
    shipDirection,
    shipLength,
    row,
    col
  );

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

export function handleDrop(
  event: DragEvent,
  shipInfo: {shipDirection: any; shipLength: string; segmentIndex: number },
  game: Game
) {
  event.preventDefault();
  const targetCell = event.target as HTMLElement;
  targetCell.classList.remove("drag-over");
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
  if (
    game.player.gameboard.isValidPlacement(shipLength, row, col, shipDirection)
  ) {
    // Handle ship placement here
    console.log(`row: ${row}, col: ${col}`);
    console.log(`shipLength: ${shipLength}`);
    const cellsToHighlight = getCellsToHighlight(
      shipDirection,
      shipLength,
      row,
      col
    );

    cellsToHighlight.forEach((cell) => {
      if (cell) {
        cell.classList.add("ship");
      }
    });
  } else {
    console.log("Invalid placement");
  }
}
