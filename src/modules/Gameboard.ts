import Ship from "./Ship";
import {
  AdjacentError,
  OutOfBoundsError,
  OverlapError,
  RepeatAttemptError,
} from "../errors/Error";
import { Direction } from "../types";

interface Cell {
  hasShip: boolean;
  state: "hit" | "miss" | "no attempt";
}

export default class Gameboard {
  #board: Cell[][];

  static #BOARDSIZE: number = 10;

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

  public static get BOARDSIZE(): number {
    return Gameboard.#BOARDSIZE;
  }

  get board() {
    return this.#board;
  }

  get ships() {
    return this.#ships;
  }

  isValidPlacement(
    shipLength: number,
    row: number,
    col: number,
    direction: Direction
  ) {
    // Check for out-of-bounds placement
    if (
      row < 0 ||
      col < 0 ||
      row >= Gameboard.#BOARDSIZE ||
      col >= Gameboard.#BOARDSIZE ||
      (direction === "vertical" && row + shipLength > Gameboard.#BOARDSIZE) ||
      (direction === "horizontal" && col + shipLength > Gameboard.#BOARDSIZE)
    ) {
      throw new OutOfBoundsError();
    }

    // Check for ship overlap
    if (
      direction === "horizontal" &&
      this.#board[row].slice(col, col + shipLength).some((cell) => cell.hasShip)
    ) {
      throw new OverlapError();
    } else if (direction === "vertical") {
      for (let i = 0; i < shipLength; i++) {
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
    for (let i = 0; i < shipLength; i++) {
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

  placeShip(ship: Ship, row: number, col: number, direction: Direction) {
    try {
      this.isValidPlacement(ship.length, row, col, direction);
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
      return true;
    } catch (error) {
      return false;
    }
  }

  removeShip(ship: Ship) {
    ship.coords.forEach(([row, col]) => {
      this.#board[row][col].hasShip = false;
    });
    this.#ships = this.#ships.filter((s) => s.id !== ship.id);
    ship.coords = [];
  }

  moveShip(
    shipId: string,
    newRow: number,
    newCol: number,
    direction: Direction
  ) {
    const shipToMove = this.#ships.find((ship) => ship.id === shipId);

    if (!shipToMove) {
      throw new Error("Ship not found");
    }

    const prevRow = shipToMove.coords[0][0]; // Store the previous row
    const prevCol = shipToMove.coords[0][1]; // Store the previous column
    const prevDirection = shipToMove.direction; // Store the previous direction

    // Remove ship from its current position
    this.removeShip(shipToMove);

    // Attempt to place ship in the new position
    const success = this.placeShip(shipToMove, newRow, newCol, direction);

    if (!success) {
      // If placement is invalid, place ship back in its original position
      this.placeShip(shipToMove, prevRow, prevCol, prevDirection);
      return false;
    }
    return true;
  }

  setCoords(
    ship: Ship,
    startRow: number,
    startCol: number,
    direction: Direction
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
      const shipToFind = this.#ships.find((ship) =>
        ship.coords.some((coord) => coord[0] === row && coord[1] === col)
      );
      shipToFind?.hit();
    } else {
      cell.state = "miss";
    }
  }

  allSunk(): boolean {
    return this.#ships.every((ship) => ship.isSunk);
  }

  reset() {
    this.#ships.forEach((ship) => {
      ship.direction = "horizontal";
      this.removeShip(ship);
    });
    this.#board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        hasShip: false,
        state: "no attempt",
      }))
    );
  }
}
