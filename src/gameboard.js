import Ship from "../src/ship.js";

export default class Gameboard {
  constructor() {
    this.tiles = [];
    this.ships = [];
    for (let w = 0; w < 10; w++) {
      this.tiles[w] = [];
      for (let h = 0; h < 10; h++) {
        this.tiles[w][h] = this.#createTile();
      }
    }
  }

  removeShip(ship) {
    const index = this.ships.indexOf(ship);
    if (index === -1) {
      return false;
    }
    this.tiles.forEach((col) => {
      col.forEach((tile) => {
        if (tile.ship === ship) {
          tile.ship = null;
        }
      });
    });

    this.ships[index] = this.ships[this.ships.length];
    this.ships.pop();
  }

  /**
   *
   * @param {Ship} ship Ship to place
   * @param {Array[Number]} coord Starting coordinate for ship
   * @param {Number} direction 0 for right, 1 for up
   * @returns
   */
  placeShip(ship, coord, direction) {
    //check the coordinate bounds
    if (this.ships.indexOf(ship) !== -1) {
      return false;
    }
    if (
      0 > Math.min(...coord) ||
      Math.max(...coord, coord[direction] + ship.length - 1) >= 10
    ) {
      return false;
    }

    const selectTile = (origin, direction, distance) => {
      return this.tiles[origin[0] + (direction ? 0 : distance)][
        origin[1] + (direction ? distance : 0)
      ];
    };
    let tiles = [];
    //check if there is collision and add tile to array
    for (let i = 0; i < ship.length; i++) {
      const tile = selectTile(coord, direction, i);
      if (tile.ship != null) {
        return false;
      }
      tiles.push(tile);
    }
    tiles.forEach((tile) => (tile.ship = ship));
    this.ships.push(ship);
    return true;
  }

  recieveAttack(coords) {
    const tile = this.tiles[coords[0]][coords[1]];
    if (tile.ship) {
      tile.hit = true;
      tile.ship.hit();
      return true;
    } else {
      tile.hit = true;
      return false;
    }
  }

  allShipsSunk() {
    let sunk = true;
    this.ships.forEach((ship) => {
      if (!ship.isSunk()) {
        sunk = false;
        return false;
      }
    });
    return sunk;
  }

  #createTile() {
    return {
      hit: false,
      ship: null,
    };
  }
}
