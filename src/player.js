import Gameboard from "../src/gameboard.js";

export default class Player {
  constructor() {
    this.board = new Gameboard();
    this.validMoves = [];
    for (let i = 0; i < 100; i++) {
      this.validMoves[i] = i;
    }
  }

  popMove(index) {
    let value = this.validMoves[index];
    this.validMoves[index] = this.validMoves.pop();
    return value;
  }

  playRandomMove(otherPlayer) {
    let move = otherPlayer.popMove(
      parseInt(Math.random() * otherPlayer.validMoves.length)
    );

    otherPlayer.board.recieveAttack([parseInt(move / 10), move % 10]);
  }
}
