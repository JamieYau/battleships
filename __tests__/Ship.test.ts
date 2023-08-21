import { describe, expect, it } from "vitest";
import createShip from "../src/Ship";

describe("Ship Factory Function", () => {
  it("should return a ship object with initial properties", () => {
    const ship = createShip(3);
    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
    expect(typeof ship.isSunk).toBe("function");
    expect(typeof ship.hit).toBe("function");
  });

  it("isSunk should return true when ship is sunk", () => {
    const ship = createShip(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  it("isSunk should return false when ship is not sunk", () => {
    const ship = createShip(3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  it("hit should increase the hits count", () => {
    const ship = createShip(3);
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  it("hit should not increase the hits count beyond the ship length", () => {
    const ship = createShip(3);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit(); // This hit should not increase hits beyond 3
    expect(ship.hits).toBe(3);
  });
});
