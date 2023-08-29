import { ShipSizeError } from "../errors/Error";
import { v4 as uuidv4 } from "uuid";

export default class Ship {
  static #MIN_LENGTH = 1;

  static #MAX_LENGTH = 5;

  #id: string;

  #length: number;

  #hits: number;

  #isSunk: boolean;

  #coords: number[][];

  constructor(length: number) {
    if (length < Ship.#MIN_LENGTH || length > Ship.#MAX_LENGTH) {
      throw new ShipSizeError(Ship.#MIN_LENGTH, Ship.#MAX_LENGTH);
    }
    this.#id = uuidv4();
    this.#length = length;
    this.#hits = 0;
    this.#isSunk = false;
    this.#coords = [];
  }

  get id() {
    return this.#id;
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

  set coords(coords: number[][]) {
    this.#coords = coords;
  }

  get coords() {
    return this.#coords;
  }
}
