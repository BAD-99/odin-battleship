import Ship from "./ship.js";
const hitBoard = createBoard();

for (let i = 0; i < 100; i++) {
  hitBoard.tiles[i].addEventListener("click", () => {
    hitFunction(i);
  });
}

export const dialogBox = (() => {
  const dialog = document.createElement("dialog");
  const div = document.createElement("div");
  const text = document.createElement("div");
  const button = document.createElement("button");
  let clickFunction = () => {};
  button.addEventListener("click", () => {
    clickFunction();
    dialog.classList.toggle("fade-in", false);
    dialog.close();
  });
  div.append(text, button);
  dialog.append(div);
  document.body.append(dialog);
  function showDialog(str, onClick, buttonStr = "Ready!") {
    dialog.classList.toggle("fade-in", true);
    clickFunction = onClick;
    text.textContent = str;
    button.textContent = buttonStr;
    dialog.showModal();
  }
  return { showDialog };
})();

export function updateHitBoard() {
  hitBoard.div.classList.toggle("red", players.active === players.player1);
  for (let i = 0; i < 100; i++) {
    const tile = players.inactive.game.board.tiles[parseInt(i / 10)][i % 10];
    hitBoard.tiles[i].classList.toggle("hit", tile.hit);
    hitBoard.tiles[i].classList.toggle("has-ship", tile.ship && tile.hit);
  }
}
hitBoard.div.addEventListener("click", () => {
  updateHitBoard();
});

export const players = {
  player1: {
    dom: {
      board: createBoard(),
      name: { div: document.createElement("div"), string: "Player 1" },
      ships: {},
    },
    game: {},
  },
  player2: {
    dom: {
      board: createBoard(),
      name: { div: document.createElement("div"), string: "Player 2" },
      ships: {},
    },
    game: {},
  },
  active: {},
  inactive: {},
};

players.player2.dom.board.div.classList.add("red");

let hitFunction = (i) => {};

export function setHitFunction(cb) {
  hitFunction = cb;
}

let shipIndex = 0;
let shipArr = [];

function shipDrag(e, shipIndex, div) {
  e.dataTransfer.setData("index", shipIndex);
  let x = e.clientX;
  let y = e.clientY;
  let origin = div.firstChild.getBoundingClientRect();

  e.dataTransfer.setData("x", origin.x + origin.width / 2 - x);
  e.dataTransfer.setData("y", origin.y + origin.height / 2 - y);
}

function shipClick(shipIndex) {
  let ship = shipArr[shipIndex];
  if (!ship.placed) {
    ship.direction = (ship.direction + 1) % 2;
    ship.div.classList.toggle("horizontal", ship.direction);
  } else {
    players.active.game.board.removeShip(ship.ship);
    ship.direction = (ship.direction + 1) % 2;
    ship.div.classList.toggle("horizontal", ship.direction);
    ship.placed = players.active.game.board.placeShip(
      ship.ship,
      ship.coord,
      ship.direction
    );
    if (!ship.placed) {
      ship.direction = (ship.direction + 1) % 2;
      ship.div.classList.toggle("horizontal", ship.direction);
      ship.placed = players.active.game.board.placeShip(
        ship.ship,
        ship.coord,
        ship.direction
      );
    }
  }
}

function generateShipPiece(length) {
  let currentShipIndex = shipIndex;
  shipIndex++;
  let ship = new Ship(length);
  let div = document.createElement("div");
  for (let i = 0; i < length; i++) {
    let tile = document.createElement("div");
    tile.classList.add("tile");
    div.append(tile);
  }
  div.classList.add("ship");
  div.classList.toggle("red", players.active === players.player2);
  div.draggable = true;

  div.addEventListener("dragstart", (e) => {
    shipDrag(e, currentShipIndex, div);
  });

  let direction = 0;
  let obj = { div, ship, direction };
  div.addEventListener("click", () => {
    shipClick(currentShipIndex);
  });
  shipArr.push(obj);
  return obj;
}

const shipTray = (() => {
  const tray = {
    body: document.createElement("div"),
    pile: document.createElement("div"),
    buttons: document.createElement("div"),
  };
  document.body.append(tray.body);
  tray.body.append(tray.pile, tray.buttons);
  tray.body.classList.add("ship-tray");
  tray.pile.classList.add("ship-pile");
  tray.buttons.classList.add("ship-buttons");
  tray.body.classList.add("hidden");
  tray.pile.addEventListener("drop", (e) => {
    shipDropOnTray(e);
  });
  tray.pile.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  let ships = [];

  function buttonUpdate() {
    trayPvpButton.disabled = ships.length !== 0;
    trayComputerButton.disabled = ships.length !== 0;
    trayStartGameButton.disabled = ships.length !== 0;
  }
  const placeRandomButton = document.createElement("button");
  function placeRandom() {
    while (ships.length !== 0) {
      let ship = ships[0];
      let placed = false;
      let direction;
      let random;
      while (!placed) {
        direction = Math.round(Math.random());
        random = parseInt(Math.random() * 100);
        placed = players.active.game.board.placeShip(
          ship.ship,
          [parseInt(random / 10), random % 10],
          direction
        );
      }
      removeShip(ship);
      players.active.dom.board.tiles[random].append(ship.div);
      ship.direction = direction;
      ship.div.classList.toggle("horizontal", ship.direction);
    }
  }
  placeRandomButton.addEventListener("click", () => {
    placeRandom();
  });
  placeRandomButton.innerText = "Random";
  tray.buttons.append(placeRandomButton);

  const trayPvpButton = document.createElement("button");
  tray.buttons.append(trayPvpButton);
  trayPvpButton.innerText = "VS Player";
  const trayComputerButton = document.createElement("button");
  tray.buttons.append(trayComputerButton);
  const trayStartGameButton = document.createElement("button");
  trayStartGameButton.innerText = "Start Game";
  tray.buttons.append(trayStartGameButton);
  trayComputerButton.innerText = "VS Computer";
  const addShip = (ship) => {
    ships.push(ship);
    tray.pile.append(ship.div);
    buttonUpdate();
  };
  const removeShip = (ship) => {
    let i = ships.indexOf(ship);
    if (i === -1) {
      return;
    }
    ships[i] = ships[ships.length - 1];
    ships.pop();
    tray.pile.removeChild(ship.div);
    buttonUpdate();
  };
  const hasShip = (ship) => {
    return ships.indexOf(ship) !== -1;
  };
  const hideTray = (toggle) => {
    if (toggle) {
      tray.body.classList.toggle("hidden", true);
      return;
    }
    tray.body.classList.toggle("hidden", false);
  };
  return {
    tray,
    addShip,
    removeShip,
    hasShip,
    hideTray,
    trayPvpButton,
    trayComputerButton,
    trayStartGameButton,
  };
})();

function shipDropOnTray(event) {
  const shipObj = shipArr[event.dataTransfer.getData("index")];
  if (shipTray.hasShip(shipObj)) {
    return;
  }
  players.active.game.board.removeShip(shipObj.ship);
  shipObj.placed = false;
  if (shipObj.div.parentElement) {
    shipObj.div.parentElement.removeChild(shipObj.div);
  }
  shipTray.addShip(shipObj);
}

function shipDropOnBoard(event, board) {
  const i = event.dataTransfer.getData("index");
  const x = event.dataTransfer.getData("x");
  const y = event.dataTransfer.getData("y");
  if (i === "" || x === "" || y === "") {
    return;
  }
  const shipObj = shipArr[i];
  const element = document.elementFromPoint(
    event.clientX + parseFloat(x),
    event.clientY + parseFloat(y)
  );
  const index = [...board.div.children].indexOf(element);
  if (index < 0) {
    return;
  }
  const coord = [parseInt(index / 10), index % 10];
  players.active.game.board.removeShip(shipObj.ship);
  shipObj.placed = players.active.game.board.placeShip(
    shipObj.ship,
    coord,
    shipObj.direction
  );
  if (shipObj.placed) {
    shipObj.coord = coord;
    shipTray.removeShip(shipObj);
    element.append(shipObj.div);
  }
}

function createBoard() {
  let board = {
    div: document.createElement("div"),
    tiles: [],
  };
  board.div.classList.add("gameboard");
  board.div.addEventListener("drop", (e) => {
    shipDropOnBoard(e, board);
  });
  board.div.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  for (let i = 0; i < 100; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    board.tiles.push(tile);
  }
  board.div.append(...board.tiles);
  document.body.append(board.div);
  return board;
}

/**
 *
 * @param {HTMLDivElement} tileDiv
 * @param {Object} tileObj
 */
function updateTile(tileDiv, tileObj) {
  tileDiv.classList.toggle("has-ship", tileObj.ship);
  tileDiv.classList.toggle("hit", tileObj.hit);
}

export function displayPlayer() {
  shipTray.tray.body.classList.toggle("hidden", true);
  hitBoard.div.classList.toggle("hidden", false);
  players.player1.dom.board.div.classList.toggle("hidden", true);
  players.player2.dom.board.div.classList.toggle("hidden", true);
  players.active.dom.board.div.classList.toggle("hidden", false);
  updateGameboards();
  updateHitBoard();
}

/**
 *
 * @param {Object} playerDOM
 * @param {Object} playerGC
 */
export function updateGameboards() {
  for (let i = 0; i < 100; i++) {
    let div = players.player1.dom.board.tiles[i];
    let obj = players.player1.game.board.tiles[parseInt(i / 10)][i % 10];
    updateTile(div, obj);
    div = players.player2.dom.board.tiles[i];
    obj = players.player2.game.board.tiles[parseInt(i / 10)][i % 10];
    updateTile(div, obj);
  }
}

/**
 *
 * @param {[HTMLDivElement]} tiles
 */
function clearTiles(tiles) {
  tiles.forEach((tile) => {
    tile.replaceChildren();
  });
}

export async function playerPlacement() {
  updateGameboards();
  players.inactive.dom.board.div.classList.toggle("hidden", true);
  players.active.dom.board.div.classList.toggle("hidden", false);
  hitBoard.div.classList.toggle("hidden", true);
  shipTray.hideTray(false);
  shipTray.addShip(generateShipPiece(2));
  shipTray.addShip(generateShipPiece(3));
  shipTray.addShip(generateShipPiece(3));
  shipTray.addShip(generateShipPiece(4));
  shipTray.addShip(generateShipPiece(5));
  if (players.inactive === players.player1) {
    shipTray.trayPvpButton.classList.toggle("hidden", true);
    shipTray.trayComputerButton.classList.toggle("hidden", true);
    shipTray.trayStartGameButton.classList.toggle("hidden", false);
    let startPromise = new Promise((resolve) => {
      shipTray.trayStartGameButton.addEventListener(
        "click",
        () => {
          clearTiles(players.active.dom.board.tiles);
          updateGameboards();
          resolve("START");
        },
        { once: true }
      );
    });
    return startPromise;
  } else {
    shipTray.trayPvpButton.classList.toggle("hidden", false);
    shipTray.trayComputerButton.classList.toggle("hidden", false);
    shipTray.trayStartGameButton.classList.toggle("hidden", true);
    let pvpPromise = new Promise((resolve) => {
      shipTray.trayPvpButton.addEventListener(
        "click",
        () => {
          clearTiles(players.active.dom.board.tiles);
          updateGameboards();
          resolve("PVP");
        },
        { once: true }
      );
    });
    let cpuPromise = new Promise((resolve) => {
      shipTray.trayComputerButton.addEventListener(
        "click",
        () => {
          clearTiles(players.active.dom.board.tiles);
          updateGameboards();
          resolve("CPU");
        },
        { once: true }
      );
    });
    return Promise.race([pvpPromise, cpuPromise]);
  }
}
