import Player from "./Player";
import AI from "./AI";
import Gameboard from "./Gameboard";
import Ship from "./Ship";

export default class Game {
  #player: Player;

  #ai: AI;

  #currentPlayer: Player | AI;

  #winner: Player | AI | null;

  static #DEFAULT_SHIP_CONFIG = [5, 4, 3, 2, 2, 1];

  constructor(playerName: string, gameboard: Gameboard) {
    const playerShips = Game.#DEFAULT_SHIP_CONFIG.map(
      (length) => new Ship(length)
    );
    const aiShips = Game.#DEFAULT_SHIP_CONFIG.map((length) => new Ship(length));

    this.#player = new Player(playerName, gameboard);
    this.#player.ships = playerShips;
    this.#ai = new AI();
    this.#ai.ships = aiShips;
    this.#ai.randomizeGameboard();
    this.#currentPlayer = this.#player;
    this.#winner = null;
  }

  get currentPlayer() {
    return this.#currentPlayer;
  }

  get player() {
    return this.#player;
  }

  get ai() {
    return this.#ai;
  }

  get winner() {
    return this.#winner;
  }

  switchTurn() {
    this.#currentPlayer =
      this.#currentPlayer === this.#player ? this.#ai : this.#player;
  }

  takeTurn(row: number, col: number): boolean {
    let turnResult = false;
    if (this.#currentPlayer === this.#player) {
      turnResult = this.#player.takeTurn(this.#ai.gameboard, row, col);
    } else {
      turnResult = this.#ai.takeTurn(this.#player.gameboard);
    }
    if (turnResult) {
      this.switchTurn();
    }
    return turnResult;
  }

  checkForWinner(): boolean {
    if (this.#player.gameboard.allSunk()) {
      this.#winner = this.#ai;
      return true;
    } else if (this.#ai.gameboard.allSunk()) {
      this.#winner = this.#player;
      return true;
    }
    return false;
  }

  resetGame() {
    this.#player.resetGameboard();
    this.#ai.resetGameboard();
    this.#winner = null;
    this.#currentPlayer = this.#player;
  }
}

export { Game };
