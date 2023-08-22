import Ship from "./Ship";
import { OutOfBoundsError, OverlapError } from "./Error";

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

  isValidPlacement(
    ship: Ship,
    row: number,
    col: number,
    direction: "horizontal" | "vertical"
  ) {
    // Check for out-of-bounds placement
    if (
      row < 0 ||
      col < 0 ||
      row >= this.#boardSize ||
      col >= this.#boardSize ||
      (direction === "vertical" && row + ship.length > this.#boardSize) ||
      (direction === "horizontal" && col + ship.length > this.#boardSize)
    ) {
      throw new OutOfBoundsError();
    }

    // Check for ship overlap
    if (
      direction === "horizontal" &&
      this.#board[row]
        .slice(col, col + ship.length)
        .some((cell) => cell.hasShip)
    ) {
      throw new OverlapError();
    } else if (direction === "vertical") {
      for (let i = 0; i < ship.length; i++) {
        if (this.#board[row + i][col].hasShip) {
          throw new OverlapError();
        }
      }
    }

    return true;
  }

  placeShip(
    ship: Ship,
    row: number,
    col: number,
    direction: "horizontal" | "vertical"
  ) {
    if (!this.isValidPlacement(ship, row, col, direction)) return;

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
