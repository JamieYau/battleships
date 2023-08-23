import Ship from "./Ship";
import {
  AdjacentError,
  OutOfBoundsError,
  OverlapError,
  RepeatAttemptError,
} from "./Error";

interface Cell {
  hasShip: boolean;
  state: "hit" | "miss" | "no attempt";
}

export default class Gameboard {
  #board: Cell[][];
  static #BOARDSIZE = 10;
  #ships: Ship[] = [];

  constructor() {
    this.#board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        hasShip: false,
        state: "no attempt",
      }))
    );
    this.#ships = [];
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
      row >= Gameboard.#BOARDSIZE ||
      col >= Gameboard.#BOARDSIZE ||
      (direction === "vertical" && row + ship.length > Gameboard.#BOARDSIZE) ||
      (direction === "horizontal" && col + ship.length > Gameboard.#BOARDSIZE)
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

    // Check for adjacent ships
    const adjacentOffsets = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1], // Up, down, left, right
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1], // Diagonals
    ];
    for (let i = 0; i < ship.length; i++) {
      for (const offset of adjacentOffsets) {
        const newRow = row + offset[0];
        const newCol = col + offset[1];
        if (
          newRow >= 0 &&
          newRow < Gameboard.#BOARDSIZE &&
          newCol >= 0 &&
          newCol < Gameboard.#BOARDSIZE &&
          this.#board[newRow][newCol].hasShip
        ) {
          throw new AdjacentError();
        }
      }
      if (direction === "horizontal") {
        col++;
      } else {
        row++;
      }
    }

    return true; // If no errors were thrown, placement is valid
  }

  placeShip(
    ship: Ship,
    row: number,
    col: number,
    direction: "horizontal" | "vertical"
  ) {
    if (this.isValidPlacement(ship, row, col, direction)) {
      if (direction === "horizontal") {
        for (let i = 0; i < ship.length; i++) {
          this.#board[row][col + i].hasShip = true;
        }
      } else {
        for (let i = 0; i < ship.length; i++) {
          this.#board[row + i][col].hasShip = true;
        }
      }
      this.setCoords(ship, row, col, direction);
      this.#ships.push(ship);
    }
  }

  setCoords(
    ship: Ship,
    startRow: number,
    startCol: number,
    direction: "horizontal" | "vertical"
  ) {
    for (let i = 0; i < ship.length; i++) {
      const row = direction === "vertical" ? startRow + i : startRow;
      const col = direction === "horizontal" ? startCol + i : startCol;
      ship.coords.push([row, col]);
    }
  }

  receiveAttack(row: number, col: number) {
    if (
      // Check for out-of-bounds attack
      row < 0 ||
      col < 0 ||
      row >= Gameboard.#BOARDSIZE ||
      col >= Gameboard.#BOARDSIZE
    ) {
      throw new OutOfBoundsError();
    }
    const cell = this.#board[row][col];
    if (cell.state !== "no attempt") {
      // Check for repeat attack
      throw new RepeatAttemptError(row, col);
    }
    if (cell.hasShip) {
      cell.state = "hit";
      const ship = this.#ships.find((ship) =>
        ship.coords.some((coord) => coord[0] === row && coord[1] === col)
      );
      ship?.hit();
    } else {
      cell.state = "miss";
    }
  }

  allSunk(): boolean {
    return this.#ships.every((ship) => ship.isSunk);
  }
}
