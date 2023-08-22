import { describe, expect, it } from "vitest";
import Gameboard from "../src/Gameboard";
import Ship from "../src/Ship";

describe("Gameboard Class", () => {
  describe("placeShip", () => {
    it("places a horizontal ship on the board", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(2);

      gameboard.placeShip(ship, 0, 0, "horizontal");

      expect(gameboard.board[0][0]).toBe(true);
      expect(gameboard.board[0][1]).toBe(true);
    });

    it("places a vertical ship on the board", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(2);

      gameboard.placeShip(ship, 0, 0, "vertical");

      expect(gameboard.board[0][0]).toBe(true);
      expect(gameboard.board[1][0]).toBe(true);
    });

    it("throws an error if a horizontal ship is placed outside the board", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(2);

      expect(() => gameboard.placeShip(ship, 0, 9, "horizontal")).toThrow();
    });

    it("throws an error if a vertical ship is placed outside the board", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(2);

      expect(() => gameboard.placeShip(ship, 9, 0, "vertical")).toThrow();
    });
  });
});
