import { beforeEach, describe, expect, it } from "vitest";
import Gameboard from "../src/modules/Gameboard";
import Ship from "../src/modules/Ship";
import { OutOfBoundsError, RepeatAttemptError } from "../src/errors/Error";

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
        expect(() => {
          gameboard.placeShip(ship, 0, 0, "horizontal");
        }).not.toThrow(); // No errors should be thrown
        gameboard.board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (rowIndex === 0 && (colIndex === 0 || colIndex === 1)) {
              expect(cell.hasShip).toBe(true);
            } else {
              expect(cell.hasShip).toBe(false);
            }
          });
        });
      });

      it("places a vertical ship on the board", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "vertical");
        gameboard.board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (colIndex === 0 && (rowIndex === 0 || rowIndex === 1)) {
              expect(cell.hasShip).toBe(true);
            } else {
              expect(cell.hasShip).toBe(false);
            }
          });
        });
      });

      it("allows placing multiple ships without overlap", () => {
        const ship1 = new Ship(4);
        const ship2 = new Ship(1);

        gameboard.placeShip(ship1, 0, 0, "horizontal");
        gameboard.placeShip(ship2, 2, 0, "vertical");

        const expectedPositions = [
          [0, 0],
          [0, 1],
          [0, 2],
          [0, 3],
          [2, 0],
        ];

        gameboard.board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (
              expectedPositions.some(
                (pos) => pos[0] === rowIndex && pos[1] === colIndex
              )
            ) {
              expect(cell.hasShip).toBe(true);
            } else {
              expect(cell.hasShip).toBe(false);
            }
          });
        });
      });

      it("sets the ship's coordinates", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "horizontal");
        expect(ship.coords).toEqual([
          [0, 0],
          [0, 1],
        ]);
      });
    });
    describe("out of bounds", () => {
      it("returns false if a horizontal ship is placed outside the board", () => {
        const ship = new Ship(2);
        const result = gameboard.placeShip(ship, 0, 9, "horizontal");
        expect(result).toBe(false);
      });

      it("returns false if a vertical ship is placed outside the board", () => {
        const ship = new Ship(2);

        const result = gameboard.placeShip(ship, 9, 0, "vertical");
        expect(result).toBe(false);
      });
    });
    describe("ship overlap", () => {
      it("returns false if a horizontal ship is placed on top of another ship", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "horizontal");

        const newShip = new Ship(5);
        const result = gameboard.placeShip(newShip, 0, 0, "horizontal");
        expect(result).toBe(false);
      });

      it("returns false if a vertical ship is placed on top of another ship", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "vertical");

        const newShip = new Ship(5);
        const result = gameboard.placeShip(newShip, 0, 0, "vertical");
        expect(result).toBe(false);
      });
    });
    describe("adjacent ships", () => {
      it("returns false if a horizontal ship is placed adjacent to another ship", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "horizontal");

        const newShip = new Ship(5);
        const result = gameboard.placeShip(newShip, 1, 0, "horizontal");
        expect(result).toBe(false);
      });

      it("returns false if a vertical ship is placed adjacent to another ship", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "vertical");

        const newShip = new Ship(5);
        const result = gameboard.placeShip(newShip, 0, 1, "vertical");
        expect(result).toBe(false);
      });

      it("returns false if a horizontal ship is placed diagonally adjacent to another ship", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "horizontal");

        const newShip = new Ship(5);
        const result = gameboard.placeShip(newShip, 1, 1, "horizontal");
        expect(result).toBe(false);
      });

      it("returns false if a vertical ship is placed diagonally adjacent to another ship", () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, "vertical");

        const newShip = new Ship(5);
        const result = gameboard.placeShip(newShip, 1, 1, "vertical");
        expect(result).toBe(false);
      });
    });
  });
  describe("receiveAttack", () => {
    it("marks a cell as miss", () => {
      gameboard.receiveAttack(0, 0);
      expect(gameboard.board[0][0].state).toBe("miss");
    });

    it("marks a cell as hit on a ship", () => {
      const ship = new Ship(2);
      gameboard.placeShip(ship, 0, 0, "horizontal");
      gameboard.receiveAttack(0, 0);
      expect(gameboard.board[0][0].state).toBe("hit");
      expect(ship.hits).toBe(1);
    });

    it("doesn't change the state of a cell that has already been attacked", () => {
      gameboard.receiveAttack(0, 0);
      expect(gameboard.board[0][0].state).toBe("miss");
      expect(() => gameboard.receiveAttack(0, 0)).toThrowError(
        RepeatAttemptError
      );
    });

    it("doesn't allow out of bounds attacks", () => {
      expect(() => gameboard.receiveAttack(10, 0)).toThrowError(
        OutOfBoundsError
      );
    });
  });
  describe("allSunk", () => {
    it("returns false if not all ships are sunk", () => {
      const ship1 = new Ship(2);
      const ship2 = new Ship(3);
      gameboard.placeShip(ship1, 0, 0, "horizontal");
      gameboard.placeShip(ship2, 2, 0, "vertical");
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(1, 0);
      expect(gameboard.allSunk()).toBe(false);
    });

    it("returns true if all ships are sunk", () => {
      const ship1 = new Ship(2);
      const ship2 = new Ship(3);
      gameboard.placeShip(ship1, 0, 0, "horizontal");
      gameboard.placeShip(ship2, 2, 0, "vertical");
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(2, 0);
      gameboard.receiveAttack(3, 0);
      gameboard.receiveAttack(4, 0);
      expect(gameboard.allSunk()).toBe(true);
    });

    it("returns true if there are no ships", () => {
      expect(gameboard.allSunk()).toBe(true);
    });
  });
  describe("moveShip", () => {
    it("moves a ship to a new position", () => {
      const ship = new Ship(2);
      gameboard.placeShip(ship, 0, 0, "horizontal");
      gameboard.moveShip(ship.id, 3, 3, "vertical");
      expect(ship.coords).toEqual([
        [3, 3],
        [4, 3],
      ]);
    });

    it("doesn't allow moving a ship out of bounds", () => {
      const ship = new Ship(2);
      gameboard.placeShip(ship, 0, 0, "horizontal");

      const result = gameboard.moveShip(ship.id, 0, 9, "horizontal");
      expect(result).toBe(false);
    });

    it("doesn't allow moving a ship on top of another ship", () => {
      const ship1 = new Ship(2);
      const ship2 = new Ship(2);
      gameboard.placeShip(ship1, 0, 0, "horizontal");
      gameboard.placeShip(ship2, 2, 2, "vertical");

      const result = gameboard.moveShip(ship2.id, 0, 0, "horizontal");
      expect(result).toBe(false);
    });

    it("doesn't allow moving a ship adjacent to another ship", () => {
      const ship1 = new Ship(2);
      const ship2 = new Ship(2);
      gameboard.placeShip(ship1, 0, 0, "horizontal");
      gameboard.placeShip(ship2, 2, 2, "vertical");

      const result = gameboard.moveShip(ship2.id, 1, 0, "horizontal");
      expect(result).toBe(false);
    });

    it("should move the ship back to it's original position if invalid move", () => {
      const ship = new Ship(4);
      gameboard.placeShip(ship, 0, 0, "horizontal");

      gameboard.moveShip(ship.id, 0, 9, "horizontal");

      expect(ship.coords).toEqual([
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ]);
      expect(gameboard.board[0][0].hasShip).toBe(true);
      expect(gameboard.board[0][1].hasShip).toBe(true);
      expect(gameboard.board[0][2].hasShip).toBe(true);
      expect(gameboard.board[0][3].hasShip).toBe(true);
    });

    it("can rotate ship", () => {
      const ship = new Ship(2);
      gameboard.placeShip(ship, 0, 0, "horizontal");
      gameboard.moveShip(ship.id, 0, 0, "vertical");
      expect(ship.coords).toEqual([
        [0, 0],
        [1, 0],
      ]);
      expect(ship.coords.length).toBe(2);
    })
  });
});
