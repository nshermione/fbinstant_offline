import {UserInfo} from './UserInfo';

export class CellReplay {
  row;
  col;
  symbol;
}

export class UserReplay {
  userid;
  hitcells: Array<CellReplay> = [];
}

export class Room {
  roomid: string = '';
  listplayerinfo: Array<UserInfo> = [];
  listviewerinfo: Array<UserInfo> = [];
  isprivate: boolean;
  timestart: number;
}