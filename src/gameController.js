import * as dc from "./domController.js";
import Player from "./player.js";
import Ship from "./ship.js";

const players = dc.players;
players.player1.game = new Player();
players.player2.game = new Player();
players.active = players.player1;
players.inactive = players.player2;

function swapActivePlayer() {
  if (players.active === players.player1) {
    players.active = players.player2;
    players.inactive = players.player1;
  } else {
    players.active = players.player1;
    players.inactive = players.player2;
  }
}

let swapFunction = () => {};

function playerHitPromise() {
  return new Promise((resolve) => {
    dc.setHitFunction((i) => {
      const coords = [parseInt(i / 10), i % 10];
      let hit = players.inactive.game.board.tiles[coords[0]][coords[1]].hit;
      if (!hit) {
        players.inactive.game.board.recieveAttack(coords);
        resolve();
      }
    });
  }).then(() => {
    dc.setHitFunction((i) => {});
  });
}

function passScreen() {
  return new Promise((resolve) => {
    dc.dialogBox.showDialog(
      `Pass to ${players.active.dom.name.string}`,
      resolve
    );
  });
}

async function CPUswap() {
  swapActivePlayer();
  if (players.active === players.player1) {
    dc.displayPlayer();
    await playerHitPromise();
  } else {
    players.active.game.playRandomMove(players.inactive.game);
  }
}

async function PVPswap() {
  swapActivePlayer();
  dc.displayPlayer();
  await playerHitPromise();
  await new Promise((resolve) => {
    dc.updateHitBoard();
    resolve();
  });
  if(!players.inactive.game.board.allShipsSunk()){

    await passScreen();
  }
}

export async function playGame() {
  while (true) {
    await startPlacement();
    await playTurns();
    await endGame();
  }
}

async function endGame() {
  let win = players.player1.game.board.allShipsSunk();
  await new Promise((resolve) => {
  dc.dialogBox.showDialog(
    `${
      win ? players.player1.dom.name.string : players.player2.dom.name.string
      } wins!`,
      resolve,
      "New game!"
    );
  });
  players.player1.game = new Player();
  players.player2.game = new Player();
  players.active = players.player1;
  players.inactive = players.player2;
}

export function startPlacement() {
  return dc.playerPlacement(0).then((value) => {
    swapActivePlayer();
    if (value === "PVP") {
      swapFunction = PVPswap;
      return dc.playerPlacement(1);
    } else {
      swapFunction = CPUswap;
      let ships = [
        new Ship(2),
        new Ship(3),
        new Ship(3),
        new Ship(4),
        new Ship(5),
      ];
      while (ships.length) {
        let ship = ships.pop();
        let random;
        let direction;
        let placed = false;
        while (!placed) {
          random = parseInt(Math.random() * 100);
          direction = Math.round(Math.random());
          placed = players.active.game.board.placeShip(
            ship,
            [parseInt(random / 10), random % 10],
            direction
          );
        }
      }
      dc.updateGameboards();
    }
  });
}

async function playTurns() {
  let win = false;
  while (!win) {
    await swapFunction();
    win = players.inactive.game.board.allShipsSunk();
  }
}
