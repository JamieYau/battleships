import { describe, expect, it } from "vitest";
import Ship from "../src/Ship";
import { ShipSizeError } from "../src/Error";

describe("Ship Factory Function", () => {
  it("should return a ship object with initial properties", () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
    expect(typeof ship.isSunk).toBe("boolean");
    expect(typeof ship.hit).toBe("function");
  });

  it("isSunk should return true when ship is sunk", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk).toBe(true);
  });

  it("isSunk should return false when ship is not sunk", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk).toBe(false);
  });

  it("hit should increase the hits count", () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  it("hit should not increase the hits count beyond the ship length", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit(); // This hit should not increase hits beyond 3
    expect(ship.hits).toBe(3);
  });

  it("should return nothing when calling hit on a sunk ship", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.hit()).toBeUndefined();
  });

  it("should create a ship of length 1", () => {
    const ship = new Ship(1);
    expect(ship.length).toBe(1);
    expect(ship.hits).toBe(0);
    expect(ship.isSunk).toBe(false);
  });

  it("should throw an error creating a ship of length 0", () => {
    expect(() => {
      new Ship(0);
    }).toThrowError(ShipSizeError);
  });

  it("should throw an error creating a ship of length > 5", () => {
    expect(() => {
      new Ship(6);
    }).toThrowError(ShipSizeError);
  });

  it("should throw an error creating a ship of length < 0", () => {
    expect(() => {
      new Ship(-1);
    }).toThrowError(ShipSizeError);
  });

  it("should set the ship coordinates", () => {
    const ship = new Ship(2);
    ship.coords = [
      [0, 0],
      [0, 1],
    ];
    expect(ship.coords).toEqual([
      [0, 0],
      [0, 1],
    ]);
  });
});
