import Gameboard from "./Gameboard";
import Player from "./Player";

export default class AI extends Player {
  static #AI_NAME = "AI";

  constructor() {
    super(AI.#AI_NAME, new Gameboard());
  }


}
