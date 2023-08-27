import { Game } from "../modules/Game";
export function showShipPlacementScreen(playerName: string): void {
  const container = document.getElementById("app");
  if (!container) return;

  const template = `
    <div id="placement-container">
        <h1>Place Your Ships ${playerName}</h1>
        <div id="placement-grid" class="grid-container">
            ${generateGridCells()}
        </div>
        <div id="ship-list">${generateShipList()}</div>
    </div>
  `;
  container.innerHTML = template;
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

function generateShipList(): string {
  const shipList = Game.shipList;
  let shipListHTML = "";
  shipList.forEach((ship) => {
    shipListHTML += `
            <div class="ship-list-item">
                <span>${ship}</span>
                <span>${ship.length}</span>
            </div>
        `;
  });
  return shipListHTML;
}
