import {UserInfo} from './UserInfo';

export class Match {
  playerA: UserInfo;
  playerB: UserInfo;
  aMoves: Array<cc.Vec2> = [];
  bMoves: Array<cc.Vec2> = [];

  isPlayerAWin() {
    let move = this.aMoves[this.aMoves.length - 1];
    if (move) {

    }
  }

  isPlayerBWin() {

  }
}