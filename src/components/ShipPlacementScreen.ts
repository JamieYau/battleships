import Ship from "../modules/Ship";

function generateGridCells(): string {
  let gridCells = "";
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      gridCells += `<div class="grid-cell" data-row="${row}" data-col="${col}"></div>`;
    }
  }
  return gridCells;
}

function generateShip(ship: Ship): HTMLDivElement {
  // create a div ship-item with ship.length number of divs

  const shipItem = document.createElement("div");
  shipItem.classList.add("ship-item");
  shipItem.dataset.id = ship.id.toString();
  shipItem.dataset.shipLength = ship.length.toString();
  shipItem.dataset.shipDirection = ship.direction;
  shipItem.draggable = true;
  for (let i = 0; i < ship.length; i++) {
    const shipSegment = document.createElement("div");
    shipSegment.classList.add("ship-segment");
    shipSegment.dataset.index = i.toString();
    shipSegment.draggable = false;
    shipItem.appendChild(shipSegment);
  }
  return shipItem;
}

function generateShipList(playerShips: Ship[]): void {
  const shipListContainer = document.getElementById("ship-list")!;
  playerShips.forEach((ship) => {
    const shipItem = generateShip(ship);
    shipListContainer.appendChild(shipItem);
  });
}

export function showShipPlacementScreen(playerName: string, playerShips: Ship[]): void {
  const container = document.getElementById("app");
  if (!container) return;

  const template = `
    <div id="placement-container">
        <h1>Place Your Ships ${playerName}</h1>
        <div id="placement-actions" class="btn-container">
        <button id="rotate-btn">
            <i class="fa-solid fa-rotate-right"></i>
        </button>
        <button id="clear-btn">
            <i class="fa-solid fa-trash-alt"></i>
        </button>
        </div>
        <div id="placement-grid" class="grid-container">
            ${generateGridCells()}
        </div>
        <div id="ship-list"></div>
        <button id="start-btn" class="hidden">Start Game</button>
    </div>
  `;
  container.innerHTML = template;
  generateShipList(playerShips);
}
