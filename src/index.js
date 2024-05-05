import "./style.css";
import * as dc from "./domController.js";
import * as gc from "./gameController.js";
import { displayPlayer } from "./domController.js";
let player = 1;
displayPlayer(0);

// gc.placeRandom(gc.gameGetPlayers().player1);
// dc.updateGameboard(dc.domGetPlayers().player1.board, gc.gameGetPlayers().player1);
gc.playGame();