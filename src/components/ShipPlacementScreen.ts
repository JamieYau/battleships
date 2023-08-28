import { Game } from "../modules/Game";
import Ship from "../modules/Ship";
export function showShipPlacementScreen(playerName: string): void {
  const container = document.getElementById("app");
  if (!container) return;

  const template = `
    <div id="placement-container">
        <h1>Place Your Ships ${playerName}</h1>
        <div id="placement-grid" class="grid-container">
            ${generateGridCells()}
        </div>
        <div id="ship-list"></div>
    </div>
  `;
  container.innerHTML = template;
  generateShipList();
}

function generateGridCells(): string {
  let gridCells = "";
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      gridCells += `<div class="grid-cell" data-row="${row}" data-col="${col}"></div>`;
    }
  }
  return gridCells;
}

function generateShipList(): void {
  const shipList = Game.shipList;
  const shipListContainer = document.getElementById("ship-list");
  if (!shipListContainer) return;
  for (let i = 0; i < shipList.length; i++) {
    const shipItem = generateShip(shipList[i]);
    shipItem.dataset.id = i.toString();
    shipListContainer.appendChild(shipItem);
  }
}

function generateShip(ship: Ship): HTMLDivElement {
  // create a div ship-item with ship.length number of divs

  const shipItem = document.createElement("div");
  shipItem.classList.add("ship-item");
  shipItem.classList.add("horizontal");
  shipItem.dataset.shipLength = ship.length.toString();
  for (let i = 0; i < ship.length; i++) {
    const shipSegment = document.createElement("div");
    shipSegment.classList.add("ship-segment");
    shipSegment.dataset.index = i.toString();
    shipSegment.draggable = true;
    shipItem.appendChild(shipSegment);
  }
  return shipItem;
}
