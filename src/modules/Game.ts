// Game.ts
import Player from "./Player";
import AI from "./AI";
import Gameboard from "./Gameboard";

export default class Game {
  #player: Player;
  #ai: AI;
  #currentPlayer: Player | AI;

  constructor(playerName: string, gameboard: Gameboard) {
    this.#player = new Player(playerName, gameboard);
    this.#ai = new AI();
    this.#currentPlayer = this.#player;
  }

  get currentPlayer() {
    return this.#currentPlayer;
  }
}

export { Game };
