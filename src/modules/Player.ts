import Gameboard from "./Gameboard";

export default class Player {
  #name: string;
  #gameboard: Gameboard;

  constructor(name: string, gameboard: Gameboard) {
    this.#name = name;
    this.#gameboard = gameboard;
  }

  get name() {
    return this.#name;
  }

  get gameboard() {
    return this.#gameboard;
  }

  takeTurn(enemyGameboard: Gameboard, row: number, col: number): boolean {
    try {
      enemyGameboard.receiveAttack(row, col);
      return true;
    } catch (error) {
      return false;
    }
  }
}
