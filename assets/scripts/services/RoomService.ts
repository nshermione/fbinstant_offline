import { Config } from '../Config';
import { UserInfo } from '../model/UserInfo';
import { GlobalInfo } from '../core/GlobalInfo';
import { ModelUtils } from '../core/ModelUtils';

export class RoomService {

  getSeatIndex(user: UserInfo) {
    return (user.seat + Config.maxSeat - GlobalInfo.me.seat) % Config.maxSeat;
  }

  updateMyRoomInfo() {
    for (let user of GlobalInfo.room.listplayerinfo) {
      if (user.userid == GlobalInfo.me.userid) {
        ModelUtils.merge(GlobalInfo.me, user);
        break;
      }
    }
  }

  getEnemyPlayer() {
    if (this.isPlayer(GlobalInfo.me.userid)) {
      for (let user of GlobalInfo.room.listplayerinfo) {
        if (user.userid != GlobalInfo.me.userid) {
          return user;
        }
      }
    }
  }

  isViewer(userId) {
    for (let user of GlobalInfo.room.listviewerinfo) {
      if (user.userid == userId) {
        return true;
      }
    }

    return false;
  }

  isPlayer(userId) {
    for (let user of GlobalInfo.room.listplayerinfo) {
      if (user.userid == userId) {
        return true;
      }
    }

    return false;
  }

  updateOwner(ownerId) {
    for (let user of GlobalInfo.room.listplayerinfo) {
      user.isowner = (user.userid == ownerId) ? 1 : 0;
      if (user.userid == GlobalInfo.me.userid) {
        ModelUtils.merge(GlobalInfo.me, user);
        break;
      }
    }
  }

  getPlayerById(userId) {
    for (let user of GlobalInfo.room.listplayerinfo) {
      if (user.userid == userId) {
        return user;
      }
    }
  }

  getViewerById(userId) {
    for (let user of GlobalInfo.room.listviewerinfo) {
      if (user.userid == userId) {
        return user;
      }
    }
  }

  removePlayerById(userId) {
    let i = 0;
    for (let user of GlobalInfo.room.listplayerinfo) {
      if (user.userid == userId) {
        GlobalInfo.room.listplayerinfo.splice(i, 1);
        return user;
      }
      i++;
    }
  }

  removeViewerById(userId) {
    let i = 0;
    for (let user of GlobalInfo.room.listviewerinfo) {
      if (user.userid == userId) {
        GlobalInfo.room.listviewerinfo.splice(i, 1);
        return user;
      }
      i++;
    }
  }

  getColorByPlayerId(userId): string {
    let user = this.getPlayerById(userId);
    return user == null ? '#000000' : user.color;
  }

  getPlayerCount() {
    return GlobalInfo.room.listplayerinfo.length;
  }

  updateNewPlayers(newPlayerList: Array<any>) {
    for (let newPlayer of newPlayerList) {
      for (let user of GlobalInfo.room.listplayerinfo) {
        if (user.userid == newPlayer.userid) {
          ModelUtils.merge(user, newPlayer);
          break;
        }
      }
    }
    this.updateMyRoomInfo();
  }

  private static instance: RoomService;

  static getInstance(): RoomService {
    if (!RoomService.instance) {
      RoomService.instance = new RoomService();
    }

    return RoomService.instance;
  }
}