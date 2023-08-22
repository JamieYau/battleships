import Ship from "./Ship";

interface Cell {
  hasShip: boolean;
  state: "hit" | "miss" | "no attempt";
}

export default class Gameboard {
  #board: Cell[][];
  #boardSize = 10;

  constructor() {
    this.#board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        hasShip: false,
        state: "no attempt",
      }))
    );
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
    if (
      row < 0 ||
      col < 0 ||
      row >= this.#boardSize ||
      col >= this.#boardSize ||
      (direction === "vertical" && row + ship.length > this.#boardSize) ||
      (direction === "horizontal" && col + ship.length > this.#boardSize)
    ) {
      throw new Error("Ship placement is out of bounds.");
    }
    // Check if ship overlaps with another ship
    if (
      direction === "horizontal" &&
      this.#board[row]
        .slice(col, col + ship.length)
        .some((cell) => cell.hasShip)
    ) {
      throw new Error("Ship placement overlaps with another ship.");
    } else {
      for (let i = 0; i < ship.length; i++) {
        if (this.#board[row + i][col].hasShip) {
          throw new Error("Ship placement overlaps with another ship.");
        }
      }
    }

    if (direction === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        this.#board[row][col + i].hasShip = true;
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        this.#board[row + i][col].hasShip = true;
      }
    }
  }
}
