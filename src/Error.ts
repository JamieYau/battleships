class OutOfBoundsError extends Error {
  constructor() {
    super("Ship placement is out of bounds.");
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

export { OutOfBoundsError, OverlapError, AdjacentError };
