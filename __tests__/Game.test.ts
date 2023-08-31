import Game from "../src/modules/Game";
import Gameboard from "../src/modules/Gameboard";
import Player from "../src/modules/Player";
import { describe, it, expect } from "vitest";
import AI from "../src/modules/AI";
import Ship from "../src/modules/Ship";

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

    it("should initialize an AI player", () => {
      const playerName = "John";
      const gameboard = new Gameboard();
      const game = new Game(playerName, gameboard);

      expect(game.ai).toBeInstanceOf(AI);
    });

    it("should initialize the winner as null", () => {
      const playerName = "John";
      const gameboard = new Gameboard();
      const game = new Game(playerName, gameboard);

      expect(game.winner).toBe(null);
    });

    it("should have the correct default ships", () => {
      const playerName = "John";
      const gameboard = new Gameboard();
      const game = new Game(playerName, gameboard);

      expect(game.ai.gameboard.ships.length).toBe(6);
      expect(game.ai.gameboard.ships[0].length).toBe(5);
      expect(game.ai.gameboard.ships[1].length).toBe(4);
      expect(game.ai.gameboard.ships[2].length).toBe(3);
      expect(game.ai.gameboard.ships[3].length).toBe(2);
      expect(game.ai.gameboard.ships[4].length).toBe(2);
      expect(game.ai.gameboard.ships[5].length).toBe(1);

      const allHorizontal = Game.shipList.every(
        (ship) => ship.direction === "horizontal"
      );

      expect(allHorizontal).toBe(true);
    });

    it("should give the player a list of ships", () => {
      const playerName = "John";
      const gameboard = new Gameboard();
      const game = new Game(playerName, gameboard);

      expect(game.player.ships.length).toBe(6);
      expect(game.player.ships[0].length).toBe(5);
      expect(game.player.ships[1].length).toBe(4);
      expect(game.player.ships[2].length).toBe(3);
      expect(game.player.ships[3].length).toBe(2);
      expect(game.player.ships[4].length).toBe(2);
      expect(game.player.ships[5].length).toBe(1);

      const allHorizontal = Game.shipList.every(
        (ship) => ship.direction === "horizontal"
      );

      expect(allHorizontal).toBe(true);
    })
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

  describe("checkForWinner", () => {
    it("should set the winner to the AI player if the human player's gameboard is all sunk", () => {
      const playerName = "John";
      const gameboard = new Gameboard();
      gameboard.placeShip(new Ship(2), 0, 0, "horizontal");
      const game = new Game(playerName, gameboard);

      game.checkForWinner();
      expect(game.winner).toBe(null);

      // Sink all of the human player's ships
      game.player.gameboard.ships.forEach((ship) => {
        ship.coords.forEach((coord) => {
          const [row, col] = coord;
          game.player.gameboard.receiveAttack(row, col);
        });
      });

      game.checkForWinner();
      expect(game.winner).toBe(game.ai);
    });
  });

  describe("resetGame", () => {
    it("should reset the game", () => {
      const playerName = "John";
      const gameboard = new Gameboard();
      gameboard.placeShip(new Ship(2), 0, 0, "horizontal");
      const game = new Game(playerName, gameboard);

      // Sink all of the human player's ships
      game.player.gameboard.ships.forEach((ship) => {
        ship.coords.forEach((coord) => {
          const [row, col] = coord;
          game.player.gameboard.receiveAttack(row, col);
        });
      });

      game.resetGame();
      expect(game.player.gameboard.ships.length).toBe(0);
      expect(game.ai.gameboard.ships.length).toBe(0);
      expect(game.winner).toBe(null);
      expect(game.currentPlayer).toBe(game.player);
    });
  });
});
