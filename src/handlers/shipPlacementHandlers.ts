import Game from "../modules/Game";
import Ship from "../modules/Ship";
import { Direction } from "../types";

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

function getAdjacentCells(cells: HTMLElement[]) {
  const adjacentCells: HTMLElement[] = [];
  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row || "");
    const col = parseInt(cell.dataset.col || "");
    const adjacentOffsets = [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0], // Up, left, right, down
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1], // Diagonals
    ];
    adjacentOffsets.forEach((offset) => {
      const newRow = row + offset[0];
      const newCol = col + offset[1];
      const adjacentCell = document.querySelector(
        `[data-row="${newRow}"][data-col="${newCol}"]`
      ) as HTMLElement;
      if (adjacentCell && !cells.includes(adjacentCell)) {
        adjacentCells.push(adjacentCell);
      }
    });
  });
  return adjacentCells;
}

// Helper function to get cells to highlight
function getCellsToHighlight(
  shipDirection: string,
  shipLength: number,
  row: number,
  col: number
): { shipCells: HTMLElement[]; adjacentCells: HTMLElement[] } {
  const shipCells: HTMLElement[] = [];

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
      shipCells.push(cell);
    }
  }

  const adjacentCells = getAdjacentCells(shipCells);

  return { shipCells, adjacentCells };
}

// Define a helper function to calculate placement values
function calculatePlacement(
  shipInfo: { shipId: string; segmentIndex: number | null },
  targetCell: HTMLElement
) {
  const shipItem = document.querySelector(
    `[data-id="${shipInfo.shipId}"]`
  ) as HTMLElement;
  const shipDirection: Direction = shipItem!.dataset.shipDirection as Direction;
  const shipLength = parseInt(shipItem!.dataset.shipLength || "");
  const segmentIndex = shipInfo.segmentIndex!;

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
  shipInfo: { shipId: string; segmentIndex: number | null }
) {
  event.preventDefault();
  const targetCell = event.target as HTMLElement;
  const { shipDirection, shipLength, row, col } = calculatePlacement(
    shipInfo,
    targetCell
  );

  const { shipCells, adjacentCells } = getCellsToHighlight(
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
  shipCells.forEach((cell) => {
    cell.classList.add("drag-over");
  });

  // Add the 'adjacent' class to the cells to highlight
  adjacentCells.forEach((cell) => {
    cell.classList.add("adjacent");
  });
}

export function handleDragLeave() {
  const gridCells = document.querySelectorAll(".grid-cell");
  gridCells.forEach((cell) => {
    cell.classList.remove("drag-over");
    cell.classList.remove("adjacent");
  });
}

export function handleShipDragEnd(segment: HTMLElement, shipItem: HTMLElement) {
  segment.classList.remove("dragging");
  shipItem.classList.remove("dragging");
}

export function handleDrop(
  event: DragEvent,
  shipInfo: { shipId: string; segmentIndex: number | null },
  game: Game
) {
  event.preventDefault();
  // Remove the 'drag-over' class from all cells
  const gridCells = document.querySelectorAll(".grid-cell");
  gridCells.forEach((cell) => {
    cell.classList.remove("drag-over");
    cell.classList.remove("adjacent");
  });

  const targetCell = (event.target as Element)!.closest(
    ".grid-cell"
  ) as HTMLElement;

  const { shipDirection, row, col } = calculatePlacement(shipInfo, targetCell);

  const ship = game.player.ships.find((s) => s.id === shipInfo.shipId)!;
  let result: boolean = false;
  if (game.player.gameboard.ships.includes(ship)) {
    result = game.player.gameboard.moveShip(ship.id, row, col, shipDirection);
  } else if (game.player.gameboard.placeShip(ship, row, col, shipDirection)) {
    result = true;
  }
  if (!result) {
    return;
  }
  // Remove the ship-item from its original container
  const shipItem = document.querySelector(
    `[data-id="${shipInfo.shipId}"]`
  ) as HTMLElement;
  shipItem?.remove();

  // Append the ship-item to the new cell's container
  const firstCell = document.querySelector(
    `[data-row="${row}"][data-col="${col}"]`
  ) as HTMLElement;
  firstCell.appendChild(shipItem);
}

export function handleRotate(shipId: string, game: Game): void {
  //change the direction on html element
  const shipItem = document.querySelector(
    `[data-id="${shipId}"]`
  ) as HTMLDivElement;
  const ship = game.player.ships.find((s) => s.id === shipId) as Ship;
  const shipDirection = shipItem.dataset.shipDirection as Direction;
  if (shipDirection === "horizontal") {
    shipItem.dataset.shipDirection = "vertical";
    ship.direction = "vertical";
  } else {
    shipItem.dataset.shipDirection = "horizontal";
    ship.direction = "horizontal";
  }
}
