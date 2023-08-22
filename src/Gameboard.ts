import Ship from "./Ship";

export default class Gameboard {
  #board: boolean[][];
  #boardSize = 10;

  constructor() {
    this.#board = [];
    for (let i = 0; i < this.#boardSize; i++) {
      this.#board[i] = [];
      for (let j = 0; j < this.#boardSize; j++) {
        this.#board[i][j] = false;
      }
    }
  }

  get board() {
    return this.#board;
  }

  placeShip(
    ship: Ship,
    row: number,
    col: number,
    direction: "horizontal" | "vertical"
  ) {
    if (direction === "horizontal") {
      if (col + ship.length > this.#boardSize) {
        throw new Error("Ship placement is out of bounds.");
      }

      for (let i = 0; i < ship.length; i++) {
        this.#board[row][col + i] = true;
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        this.#board[row + i][col] = true;
      }
    }
  }
}
