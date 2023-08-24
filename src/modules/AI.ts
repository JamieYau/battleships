import Gameboard from "./Gameboard";
import Player from "./Player";

export default class AI extends Player {
  static #AI_NAME = "AI";
  #availableMoves: [number, number][]; // Set to store available moves

  constructor() {
    super(AI.#AI_NAME, new Gameboard());
    this.#availableMoves = [];
    for (let row = 0; row < Gameboard.BOARDSIZE; row++) {
      for (let col = 0; col < Gameboard.BOARDSIZE; col++) {
        this.#availableMoves.push([row, col]);
      }
    }
  }

  generateRandomMove(): [number, number] {
    const randomIndex = Math.floor(Math.random() * this.#availableMoves.length);
    const [row, col] = this.#availableMoves[randomIndex];

    // Remove the chosen move from the available moves array
    this.#availableMoves.splice(randomIndex, 1);

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
