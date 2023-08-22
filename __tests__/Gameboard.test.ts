import { describe, expect, it } from "vitest";
import Gameboard from "../src/Gameboard";
import Ship from "../src/Ship";

describe("Gameboard Class", () => {
  describe("placeShip", () => {
    it("places a ship on the board", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(2);

      gameboard.placeShip(ship, 0, 0, "horizontal");

      expect(gameboard.board[0][0]).toBe(true);
      expect(gameboard.board[0][1]).toBe(true);
    });
  });
});
