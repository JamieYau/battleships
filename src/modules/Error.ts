class ShipSizeError extends Error {
  constructor(minSize: number, maxSize: number) {
    super(`Ship size must be between ${minSize} and ${maxSize}.`);
    this.name = "ShipSizeError";
  }
}

class OutOfBoundsError extends Error {
  constructor() {
    super("Cell is out of bounds.");
    this.name = "OutOfBoundsError";
  }
}

class OverlapError extends Error {
  constructor() {
    super("Ship placement overlaps with another ship.");
    this.name = "OverlapError";
  }
}

class AdjacentError extends Error {
  constructor() {
    super("Ships cannot be placed adjacent to each other.");
    this.name = "AdjacentError";
  }
}

class RepeatAttemptError extends Error {
  constructor(row: number, col: number) {
    super(`This cell: [${row}, ${col}] has already been attacked.`);
    this.name = "RepeatAttemptError";
  }
}

export { ShipSizeError, OutOfBoundsError, OverlapError, AdjacentError, RepeatAttemptError };
