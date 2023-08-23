import { describe, it, expect, beforeEach } from "vitest";
import Player from "../src/modules/Player";
import Gameboard from "../src/modules/Gameboard";

describe("Player", () => {
  let player: Player;
  beforeEach(() => {
    player = new Player("Player", new Gameboard());
  });
  describe("constructor", () => {
    it("Should have a name", () => {
      expect(player.name).toBe("Player");
    });
    it("Should have a gameboard", () => {
      expect(player.gameboard).toBeDefined();
    });
  });
});
