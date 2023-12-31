import Gameboard from "./Gameboard";
import Ship from "./Ship";

export default class Player {
  #name: string;

  #gameboard: Gameboard;

  #ships: Ship[];

  constructor(name: string, gameboard: Gameboard) {
    // If name is blank, set it to "Player"
    this.#name = name.trim() === "" ? "Player" : name;
    this.#gameboard = gameboard;
    this.#ships = [];
  }

  get name() {
    return this.#name;
  }

  get gameboard() {
    return this.#gameboard;
  }

  get ships() {
    return this.#ships;
  }

  randomizeGameboard() {
    for (const ship of this.ships) {
      let isValidPlacement = false;
      while (!isValidPlacement) {
        const randomRow = Math.floor(Math.random() * Gameboard.BOARDSIZE);
        const randomCol = Math.floor(Math.random() * Gameboard.BOARDSIZE);
        const randomDirection = Math.random() < 0.5 ? "horizontal" : "vertical";

        isValidPlacement = this.gameboard.placeShip(
          ship,
          randomRow,
          randomCol,
          randomDirection
        );
      }
    }
  }

  takeTurn(enemyGameboard: Gameboard, row: number, col: number): boolean {
    if (enemyGameboard.allSunk()) {
      return false;
    }

    try {
      enemyGameboard.receiveAttack(row, col);
      return true;
    } catch (error) {
      return false;
    }
  }

  resetGameboard() {
    this.gameboard.reset();
  }

  set ships(ships: Ship[]) {
    this.#ships = ships;
  }
}
