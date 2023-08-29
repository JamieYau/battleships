import Game from "../modules/Game";

export function handleSegmentMouseDown(event: MouseEvent) {
  return event.target as HTMLElement;
}

export function handleShipDragStart(
  shipItem: HTMLElement,
  segment: HTMLElement
) {
  segment.classList.add("dragging");
  shipItem.classList.add("dragging");

  const segmentIndex = parseInt(segment.dataset.index || "");
  const shipId = shipItem.dataset.id || "";

  return { shipId, segmentIndex };
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

// Define a helper function to calculate placement values
function calculatePlacement(
  shipInfo: { shipId: string; segmentIndex: any },
  targetCell: HTMLElement
) {
  const shipItem = document.querySelector(
    `[data-id="${shipInfo.shipId}"]`
  ) as HTMLElement;
  const shipDirection: "horizontal" | "vertical" = shipItem!.classList.contains(
    "horizontal"
  )
    ? "horizontal"
    : "vertical";
  const shipLength = parseInt(shipItem!.dataset.shipLength || "");
  const segmentIndex = shipInfo.segmentIndex;

  const row = parseInt(targetCell.dataset.row || "");
  const col = parseInt(targetCell.dataset.col || "");

  if (shipDirection === "horizontal") {
    return { shipDirection, shipLength, row, col: col - segmentIndex };
  } else {
    return { shipDirection, shipLength, row: row - segmentIndex, col };
  }
}

export function handleDragOver(
  event: DragEvent,
  shipInfo: { shipId: string; segmentIndex: number }
) {
  event.preventDefault();
  const targetCell = event.target as HTMLElement;
  const { shipDirection, shipLength, row, col } = calculatePlacement(
    shipInfo,
    targetCell
  );

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

export function handleDragLeave() {
  const gridCells = document.querySelectorAll(".grid-cell");
  gridCells.forEach((cell) => {
    cell.classList.remove("drag-over");
  });
}

export function handleShipDragEnd(segment: HTMLElement, shipItem: HTMLElement) {
  segment.classList.remove("dragging");
  shipItem.classList.remove("dragging");
}

export function handleDrop(
  event: DragEvent,
  shipInfo: { shipId: string; segmentIndex: number },
  game: Game
) {
  event.preventDefault();
  // Remove the 'drag-over' class from all cells
  const gridCells = document.querySelectorAll(".grid-cell");
  gridCells.forEach((cell) => {
    cell.classList.remove("drag-over");
  });

  const targetCell = event.target as HTMLElement;

  const { shipDirection, shipLength, row, col } = calculatePlacement(
    shipInfo,
    targetCell
  );

  if (
    game.player.gameboard.isValidPlacement(shipLength, row, col, shipDirection)
  ) {
    // Remove the ship-item from its original container
    const shipItem = document.querySelector(
      `[data-id="${shipInfo.shipId}"]`
    ) as HTMLElement;
    shipItem?.remove();

    // Append the ship-item to the new cell's container
    const firstCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
    firstCell.appendChild(shipItem);

    // Position the ship-item within the cell container
    shipItem.style.position = "absolute";
    const styles = window.getComputedStyle(document.querySelector("#placement-grid")!);

    shipItem.style.top = `-${parseInt(styles.getPropertyValue("grid-gap"))! / 2}px`;
    shipItem.style.left = `-${parseInt(styles.getPropertyValue("grid-gap"))!}px`;
    // Handle ship placement here
    console.log(`row: ${row}, col: ${col}`);
    console.log(`shipLength: ${shipLength}`);

    // const cellsToHighlight = getCellsToHighlight(
    //   shipDirection,
    //   shipLength,
    //   row,
    //   col
    // );
    // cellsToHighlight.forEach((cell) => {
    //   if (cell) {
    //     cell.classList.add("ship");
    //   }
    // });
  } else {
    console.log("Invalid placement");
  }
}
