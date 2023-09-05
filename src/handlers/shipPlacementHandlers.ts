import Player from "../modules/Player";
import Ship from "../modules/Ship";
import { Direction } from "../types";

export function handleClearBoard(player: Player) {
  const shipList = document.getElementById("ship-list") as HTMLDivElement;
  player.gameboard.reset();

  // Select all ship items
  const shipItems = document.querySelectorAll(
    ".ship-item"
  ) as NodeListOf<HTMLDivElement>;

  // Remove all ship items from their parent elements
  shipItems.forEach((shipItem) => {
    shipItem.classList.remove("active");
    document.getElementById("rotate-btn")?.classList.remove("active");
    shipItem.dataset.shipDirection = "horizontal";
    shipItem.parentElement?.removeChild(shipItem);
  });

  // Sort the ship items based on their length (largest to smallest)
  const sortedShipItems = Array.from(shipItems).sort((a, b) => {
    const lengthA = parseInt(a.dataset.shipLength || "0");
    const lengthB = parseInt(b.dataset.shipLength || "0");
    return lengthB - lengthA;
  });

  // Append the sorted ship items back to the shipList container
  sortedShipItems.forEach((shipItem) => {
    shipList.appendChild(shipItem);
  });

  // Hide the start button
  const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
  startBtn.classList.add("hidden");
}

export function randomGameboard(player: Player) {
  handleClearBoard(player);
  player.randomizeGameboard();
  const ships = player.gameboard.ships;
  ships.forEach((ship) => {
    // place in DOM
    const shipItem = document.querySelector(
      `[data-id="${ship.id}"]`
    ) as HTMLDivElement;
    shipItem.dataset.shipDirection = ship.direction;
    const firstCell = document.querySelector(
      `[data-row="${ship.coords[0][0]}"][data-col="${ship.coords[0][1]}"]`
    ) as HTMLDivElement;
    firstCell.appendChild(shipItem);
  });

  const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
  startBtn.classList.remove("hidden");
}

export function addActiveClass(shipItem: HTMLElement) {
  const shipItems = document.querySelectorAll(
    ".ship-item"
  ) as NodeListOf<HTMLDivElement>;
  shipItems.forEach((item) => {
    item.classList.remove("active");
  });
  shipItem.classList.add("active");
  document.getElementById("rotate-btn")?.classList.add("active");
}

export function handleSegmentMouseDown(event: MouseEvent) {
  return event.target as HTMLElement;
}

export function handleShipDragStart(
  shipItem: HTMLElement,
  segment: HTMLElement
) {
  segment.classList.add("dragging");
  shipItem.classList.add("dragging");
  addActiveClass(shipItem);

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
  player: Player
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

  const ship = player.ships.find((s) => s.id === shipInfo.shipId)!;
  let result: boolean = false;
  if (player.gameboard.ships.includes(ship)) {
    result = player.gameboard.moveShip(ship.id, row, col, shipDirection);
  } else if (player.gameboard.placeShip(ship, row, col, shipDirection)) {
    result = true;
  }
  if (!result) {
    return;
  }
  if (player.ships.length === player.gameboard.ships.length) {
    const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
    startBtn.classList.remove("hidden");
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

export function handleRotate(shipId: string, player: Player): void {
  //change the direction on html element
  const shipItem = document.querySelector(
    `[data-id="${shipId}"]`
  ) as HTMLDivElement;
  const ship = player.ships.find((s) => s.id === shipId) as Ship;
  const shipDirection = shipItem.dataset.shipDirection as Direction;
  const newDirection =
    shipDirection === "horizontal" ? "vertical" : "horizontal";
  if (player.gameboard.ships.includes(ship)) {
    if (
      player.gameboard.moveShip(
        ship.id,
        ship.coords[0][0],
        ship.coords[0][1],
        newDirection
      )
    ) {
      shipItem.dataset.shipDirection = newDirection;
    }
    return;
  }

  shipItem.dataset.shipDirection = newDirection;
}
