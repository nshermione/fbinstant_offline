import {UserInfo} from '../../game/Model';

export interface IGlobalInfo {
  me?: UserInfo;
  reset?: Function;
}

export const GlobalInfo: IGlobalInfo = {
  reset: function () {
    this.me = new UserInfo();
  }
};

GlobalInfo.reset();