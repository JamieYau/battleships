interface Ship {
  length: number;
  hits: number;
  sunk: boolean;
  hit: () => void;
  isSunk: () => boolean;
}

export default function createShip(length: number): Ship {
  return {
    length,
    hits: 0,
    sunk: false,
    hit: function () {
      if (this.hits >= this.length) return;
      this.hits++;
    },
    isSunk: function () {
      return this.hits >= this.length;
    },
  };
}
