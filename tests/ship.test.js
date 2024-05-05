import Ship from "../src/ship";

test("Ship has correct properties", () => {
  const ship = new Ship();
  expect(ship).toHaveProperty("length");
  expect(ship).toHaveProperty("hits");
  expect(ship).toHaveProperty("sunk");
});

test("Hit function works correctly", () => {
  const ship = new Ship(1);
  expect(ship.hits).toBe(0);
  ship.hit();
  expect(ship.hits).toBe(1);
});

test("IsSunk function works correctly", () => {
  const ship = new Ship(4);
  expect(ship.isSunk()).toBe(false);
  for (let i = 1; i < ship.length; i++) {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  }
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
