import { describe, it, expect, beforeEach, vi } from "vitest";
import AI from "../src/modules/AI";
import Gameboard from "../src/modules/Gameboard";
import Ship from "../src/modules/Ship";

describe("AI", () => {
  let ai: AI;

  beforeEach(() => {
    ai = new AI();
  });

  describe("constructor", () => {
    it("Should have a name", () => {
      expect(ai.name).toBe("AI");
    });

    it("Should have a gameboard", () => {
      expect(ai.gameboard).toBeDefined();
    });
  });

  describe("randomMove", () => {
    it("Should generate coords within range (0-9)", () => {
      for (let i = 0; i < Math.pow(Gameboard.BOARDSIZE, 2); i++) {
        const move = ai.generateRandomMove();
        expect(move[0]).toBeGreaterThanOrEqual(0);
        expect(move[0]).toBeLessThan(10);
        expect(move[1]).toBeGreaterThanOrEqual(0);
        expect(move[1]).toBeLessThan(10);
      }
    });
    it("Should generate unique coordinates", () => {
      const moves = new Set();
      for (let i = 0; i < Math.pow(Gameboard.BOARDSIZE, 2); i++) {
        const move = ai.generateRandomMove();
        moves.add(move.toString());
      }
      expect(moves.size).toBe(100);
    });
  });

  describe("takeTurn", () => {
    it("Should take turns and attack enemy gameboard", () => {
      const enemyGameboard = new Gameboard();
      const attackSpy = vi.spyOn(enemyGameboard, "receiveAttack");
      const enemyShip = new Ship(3);
      enemyGameboard.placeShip(enemyShip, 2, 0, "horizontal");

      expect(ai.takeTurn(enemyGameboard)).toBe(true);
      expect(attackSpy).toHaveBeenCalled();
    });
  });

  describe("setupShips", () => {
    it("Should place all ships on the gameboard", () => {
      const ships = [
        new Ship(5),
        new Ship(4),
        new Ship(3),
        new Ship(2),
        new Ship(2),
        new Ship(1),
      ];
      ai.ships = ships;
      ai.randomizeGameboard();
      // Calculate the total number of cells occupied by ships
      const totalOccupiedCells = ships.reduce(
        (total, ship) => total + ship.length,
        0
      );
      // Count the number of cells with ships on the gameboard
      const occupiedCellsCount = ai.gameboard.board
        .flat()
        .filter((cell) => cell.hasShip).length;

      // Compare the calculated count with the actual count
      expect(occupiedCellsCount).toBe(totalOccupiedCells);
    });
  });
});
