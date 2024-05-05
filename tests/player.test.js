import Player from "../src/player";
let player1, player2;
beforeEach(() => {
  player1 = new Player();
  player2 = new Player();
});

test("Player has gameboard", () => {
  expect(player1.board).toBeDefined();
});

test("Players can play random moves", () => {
  player1.playRandomMove(player2);
  let hasBeenHit = false;
  player2.board.tiles.forEach((col) => {
    if (hasBeenHit) {
      return;
    }
    col.forEach((tile) => {
      if (tile.hit) {
        hasBeenHit = true;
        return;
      }
    });
  });
  expect(hasBeenHit).toBe(true);
});
