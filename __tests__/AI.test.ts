import { describe, it, expect, beforeEach } from "vitest";
import AI from "../src/modules/AI";

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
});
