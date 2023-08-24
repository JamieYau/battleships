import { describe, it, expect, beforeEach, vi } from "vitest";
import Player from "../src/modules/Player";
import Gameboard from "../src/modules/Gameboard";

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

      player.takeTurn(enemyGameboard, 2, 3);
      expect(attackSpy).toHaveBeenCalledWith(2, 3);
    });
  });
});
