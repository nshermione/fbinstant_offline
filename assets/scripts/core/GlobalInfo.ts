import {UserInfo} from '../model/UserInfo';
import {Room} from '../model/Room';
import {ClientInfo} from '../model/ClientInfo';

export interface IGlobalInfo {
  me?: UserInfo;
  room?: Room;
  instantRoomId?: string;
  reset?: Function;
  fbToken?: string;
  clientInfo?: ClientInfo;
  firstLoadTime?: boolean;
  instantAds?: any;
  savedScore?: any;
  savedEnemy?: any;
  autojoinRoom?: any;
}

export const GlobalInfo: IGlobalInfo = {
  reset: function () {
    this.me = new UserInfo();
    this.room = null;
    this.firstLoadTime = false;
    this.autojoinRoom = true;
  }
};

GlobalInfo.reset();