import {LOGIN_TYPE} from '../core/Constants';

export class UserInfo {
  userid = -1;
  symbol = 0;
  isowner = 0;
  username = '';
  displayname = '';
  rank = 9999;
  score = 0;
  seat = -1;
  loggedIn = false;
  loginType = LOGIN_TYPE.LOGIN_FAIL;
  avatar = '';
  color = '#000000';
  winnum = 0;
  winrate = 0;
  isready = false;
}