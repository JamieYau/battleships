export default class Ship {
  static #MIN_LENGTH = 1;
  static #MAX_LENGTH = 5;
  #length: number;
  #hits: number;
  #isSunk: boolean;

  constructor(length: number) {
    if (length < Ship.#MIN_LENGTH || length > Ship.#MAX_LENGTH) {
      throw new Error("Ship has to have size of: 1-5");
    }
    this.#length = length;
    this.#hits = 0;
    this.#isSunk = false;
  }

  get length() {
    return this.#length;
  }

  get isSunk() {
    return this.#isSunk;
  }

  get hits() {
    return this.#hits;
  }

  hit() {
    if (this.isSunk) return;
    this.#hits++;
    if (this.#hits >= this.#length) this.#isSunk = true;
  }
}
