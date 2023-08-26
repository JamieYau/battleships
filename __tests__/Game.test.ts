import Game from "../src/modules/Game";
import Gameboard from "../src/modules/Gameboard";
import Player from "../src/modules/Player";
import { describe, it, expect } from "vitest";
import AI from "../src/modules/AI";

describe("Game", () => {
  describe("constructor", () => {
    it("should create a new instance of the Game class", () => {
      const gameboard = new Gameboard();
      const game = new Game("", gameboard);
      expect(game).toBeInstanceOf(Game);
    });

    it("should initialize with the correct player name and human player as the current player", () => {
      const playerName = "John";
      const gameboard = new Gameboard();
      const game = new Game(playerName, gameboard);

      expect(game.player).toBeInstanceOf(Player);
      expect(game.player.name).toBe(playerName);
      expect(game.currentPlayer).toBe(game.player);
    });
  });

  describe("switchTurn", () => {
    it("should switch the current player to the other player", () => {
      const playerName = "John";
      const gameboard = new Gameboard();
      const game = new Game(playerName, gameboard);

      expect(game.currentPlayer).toBe(game.player);
      game.switchTurn();
      expect(game.currentPlayer).not.toBe(game.player);
      expect(game.currentPlayer).toBe(game.ai);
    });

    it("should switch turns between human player and AI player", () => {
      const playerName = "John";
      const gameboard = new Gameboard();
      const game = new Game(playerName, gameboard);

      expect(game.currentPlayer).toBe(game.player);

      // Switch to AI player's turn
      game.switchTurn();
      expect(game.currentPlayer).toBeInstanceOf(AI);

      // Switch back to human player's turn
      game.switchTurn();
      expect(game.currentPlayer).toBe(game.player);

      // Switch to AI player's turn
      game.switchTurn();
    });
  });

  describe("takeTurn", () => {
    it("should return true if the current player is the human player and the human player's attack is successful", () => {
      const playerName = "John";
      const gameboard = new Gameboard();
      const game = new Game(playerName, gameboard);

      const [row, col] = [0, 0];
      const turnResult = game.takeTurn(row, col);

      expect(turnResult).toBe(true);
    });
  });
});
