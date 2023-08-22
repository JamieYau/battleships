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

        expect(gameboard.board[0][0].hasShip).toBe(true);
        expect(gameboard.board[0][1].hasShip).toBe(true);
      });

      it("places a vertical ship on the board", () => {
        const ship = new Ship(2);

        gameboard.placeShip(ship, 0, 0, "vertical");

        expect(gameboard.board[0][0].hasShip).toBe(true);
        expect(gameboard.board[1][0].hasShip).toBe(true);
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
      it("throws an error if a ship is placed on top of another ship", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "horizontal");

        const newShip = new Ship(5);
        expect(() =>
          gameboard.placeShip(newShip, 0, 0, "horizontal")
        ).toThrow();
      });
    });
  });
});
