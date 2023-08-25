import Game from "../src/modules/Game";
import Gameboard from "../src/modules/Gameboard";
import { describe, it, expect } from "vitest";

describe("Game", () => {
  describe("constructor", () => {
    it("should create a new instance of the Game class", () => {
      const gameboard = new Gameboard();
      const game = new Game("", gameboard);
      expect(game).toBeInstanceOf(Game);
    });
  });

  describe("currentPlayer", () => {
    it("should return the current player", () => {
      const gameboard = new Gameboard();
      const game = new Game("", gameboard);
      expect(game.currentPlayer).toBe(game.player);
    });
  });
});
