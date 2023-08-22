import { beforeEach, describe, expect, it } from "vitest";
import Gameboard from "../src/Gameboard";
import Ship from "../src/Ship";

describe("Gameboard Class", () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    gameboard = new Gameboard(); // Create a new gameboard before each test
  });
  describe("constructor", () => {
    it("creates a 10x10 board", () => {
      expect(gameboard.board.length).toBe(10);
      expect(gameboard.board[0].length).toBe(10);
    });

    it("creates a board with all cells empty", () => {
      const board = gameboard.board;
      for (let row of board) {
        for (let cell of row) {
          expect(cell.hasShip).toBe(false);
          expect(cell.state).toBe("no attempt");
        }
      }
    });
  });
  describe("placeShip", () => {
    describe("valid placement", () => {
      it("places a horizontal ship on the board", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "horizontal");
        gameboard.board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (rowIndex === 0 && (colIndex === 0 || colIndex === 1)) {
              expect(cell.hasShip).toBe(true);
            } else {
              expect(cell.hasShip).toBe(false);
            }
          });
        });
      });

      it("places a vertical ship on the board", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "vertical");
        gameboard.board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (colIndex === 0 && (rowIndex === 0 || rowIndex === 1)) {
              expect(cell.hasShip).toBe(true);
            } else {
              expect(cell.hasShip).toBe(false);
            }
          });
        });
      });

      it("allows placing multiple ships without overlap", () => {
        const ship1 = new Ship(4);
        const ship2 = new Ship(3);

        gameboard.placeShip(ship1, 0, 0, "horizontal");
        gameboard.placeShip(ship2, 1, 0, "vertical");

        const expectedPositions = [
          [0, 0],
          [0, 1],
          [0, 2],
          [0, 3],
          [1, 0],
          [2, 0],
          [3, 0],
        ];

        gameboard.board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (
              expectedPositions.some(
                (pos) => pos[0] === rowIndex && pos[1] === colIndex
              )
            ) {
              expect(cell.hasShip).toBe(true);
            } else {
              expect(cell.hasShip).toBe(false);
            }
          });
        });
      });
    });
    describe("out of bounds", () => {
      it("throws an error if a horizontal ship is placed outside the board", () => {
        const ship = new Ship(2);

        expect(() => gameboard.placeShip(ship, 0, 9, "horizontal")).toThrow();
      });

      it("throws an error if a vertical ship is placed outside the board", () => {
        const ship = new Ship(2);

        expect(() => gameboard.placeShip(ship, 9, 0, "vertical")).toThrow();
      });
    });
    describe("ship overlap", () => {
      it("throws an error if a horizontal ship is placed on top of another ship", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "horizontal");

        const newShip = new Ship(5);
        expect(() =>
          gameboard.placeShip(newShip, 0, 0, "horizontal")
        ).toThrow();
      });

      it("throws an error if a vertical ship is placed on top of another ship", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "vertical");

        const newShip = new Ship(5);
        expect(() => gameboard.placeShip(newShip, 0, 0, "vertical")).toThrow();
      });
    });
  });
});
