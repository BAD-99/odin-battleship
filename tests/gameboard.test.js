import Gameboard from "../src/gameboard";
import Ship from "../src/ship";

let gameboard;
let ship;

beforeEach(() => {
  gameboard = new Gameboard();
  ship = new Ship(5);
});

test("Gameboard tiles are correct", () => {
  expect(gameboard.tiles.length).toBe(10);
  expect(gameboard.tiles[0].length).toBe(10);
  expect(gameboard.tiles[0][0]).toMatchObject({
    hit: false,
    ship: null,
  });
});

test("Place ship does not place out of bounds", () => {
  let canPlace = gameboard.placeShip(ship, [9, 0], 0);
  expect(canPlace).toBe(false);
  expect(gameboard.tiles[9][0].ship).toBe(null);
});

test("Place ship works correctly", () => {
  let canPlace = gameboard.placeShip(ship, [0, 0], 0);
  expect(canPlace).toBe(true);
  expect(gameboard.tiles[4][0].ship).toBe(ship);
  canPlace = gameboard.placeShip(new Ship(1), [0, 0], 0);
  expect(canPlace).toBe(false);
  canPlace = gameboard.placeShip(new Ship(4), [9, 0], 0);
  expect(canPlace).toBe(false);
});

test("Recieve attack is false on empty tile", () => {
  let hitShip = gameboard.recieveAttack([0, 0]);
  expect(hitShip).toBe(false);
});

test("Recieve attack is true on occupied tile", () => {
  let placeShip = gameboard.placeShip(ship, [4, 4], 1);
  let hitShip = gameboard.recieveAttack([4, 6]);
  expect(hitShip).toBe(true);
  expect(ship.hits).toBe(1);
});

test("Gameboard checks if all ships sunk", ()=>{
    gameboard.placeShip(ship,[0,0],0);
    gameboard.placeShip(new Ship(1), [4,4],0);
    gameboard.placeShip(new Ship(2),[7,8],1);
    expect(gameboard.allShipsSunk()).toBe(false);
    ship.hits = 5;
    gameboard.recieveAttack([4,4]);
    gameboard.recieveAttack([7,8]);
    gameboard.recieveAttack([7,9]);
    expect(gameboard.allShipsSunk()).toBe(true);
})