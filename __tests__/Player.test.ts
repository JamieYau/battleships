import { describe, it, expect, beforeEach, vi } from "vitest";
import Player from "../src/modules/Player";
import Gameboard from "../src/modules/Gameboard";
import Ship from "../src/modules/Ship";

describe("Player", () => {
  let player: Player;
  let gameboard: Gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
    player = new Player("Player", gameboard);
  });

  describe("constructor", () => {
    it("Should have a name", () => {
      expect(player.name).toBe("Player");
    });

    it("Should have a gameboard", () => {
      expect(player.gameboard).toBe(gameboard);
    });
  });
  describe("takeTurn", () => {
    it("Should take turns and attack enemy gameboard", () => {
      const enemyGameboard = new Gameboard();
      const attackSpy = vi.spyOn(enemyGameboard, "receiveAttack");
      const enemyShip = new Ship(3);
      enemyGameboard.placeShip(enemyShip, 2, 0, "horizontal");

      expect(player.takeTurn(enemyGameboard, 2, 3)).toBe(true);
      expect(attackSpy).toHaveBeenCalledWith(2, 3);
    });

    it("Should return false if attack is out of bounds", () => {
      const enemyGameboard = new Gameboard();

      expect(player.takeTurn(enemyGameboard, 11, 3)).toBe(false);
    });

    it("Should return false if attacking same coordinate", () => {
      const enemyGameboard = new Gameboard();

      player.takeTurn(enemyGameboard, 2, 3);
      expect(player.takeTurn(enemyGameboard, 2, 3)).toBe(false);
    });

    it("Should not attack if the game is over", () => {
      const enemyGameboard = new Gameboard();
      const attackSpy = vi.spyOn(enemyGameboard, "receiveAttack");
      const enemyShip = new Ship(2);
      enemyGameboard.placeShip(enemyShip, 2, 0, "horizontal");

      player.takeTurn(enemyGameboard, 2, 0);
      player.takeTurn(enemyGameboard, 2, 1);

      expect(player.takeTurn(enemyGameboard, 2, 2)).toBe(false);
      expect(attackSpy).toHaveBeenCalledTimes(2);
    })
  });
});
