import Gameboard from "./Gameboard";
import Player from "./Player";

export default class AI extends Player {
  static #AI_NAME = "AI";

  constructor() {
    super(AI.#AI_NAME, new Gameboard());
  }

  generateRandomMove(): [number, number] {
    const row = Math.floor(Math.random() * Gameboard.BOARDSIZE);
    const col = Math.floor(Math.random() * Gameboard.BOARDSIZE);

    return [row, col];
  }

  takeTurn(enemyGameboard: Gameboard): boolean {
    if (enemyGameboard.allSunk()) {
      return false;
    }

    const [row, col] = this.generateRandomMove();
    try {
      enemyGameboard.receiveAttack(row, col);
      return true;
    } catch (error) {
      return false;
    }
  }
}
