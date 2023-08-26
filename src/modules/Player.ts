import Gameboard from "./Gameboard";

export default class Player {
  #name: string;
  #gameboard: Gameboard;

  constructor(name: string = "Player", gameboard: Gameboard) {
    // If name is blank, set it to "Player"
    this.#name = name.trim() === "" ? "Player" : name;
    this.#gameboard = gameboard;
  }

  get name() {
    return this.#name;
  }

  get gameboard() {
    return this.#gameboard;
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
}
