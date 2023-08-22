import Ship from "./Ship";

export default class Gameboard {
  #board: boolean[][];

  constructor() {
    this.#board = [];
    for (let i = 0; i < 10; i++) {
      this.#board.push([]);
      for (let j = 0; j < 10; j++) {
        this.#board[i].push(false);
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
