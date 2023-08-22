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

export { OutOfBoundsError, OverlapError };
