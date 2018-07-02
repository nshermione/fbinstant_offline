import {Config} from '../Config';
import {UserInfo} from '../../game/Model';

declare const FBInstant: any;

export class DataService {

  getValue(key): Promise<any> {
    if (Config.instant) {
      FBInstant.player
        .getDataAsync([key])
        .then(function(stats) {
          return stats[key];
        });
    } else {
      return new Promise((resolve, reject) => {
        resolve(cc.sys.localStorage.getItem(key));
      });
    }
  }

  saveUser(userInfo: UserInfo) {
    if (Config.instant) {
      FBInstant.player
        .setDataAsync({
          user: JSON.stringify(userInfo)
        })
        .then(function() {
          cc.log('data is set');
        });
    } else {
      cc.sys.localStorage.setItem('user', JSON.stringify(userInfo));
    }
  }

  getUser() {
    if (Config.instant) {
      return FBInstant.player
        .getDataAsync(['user'])
        .then(function(stats) {
          if (stats['user']) {
            return (<UserInfo>JSON.parse(stats['user']));
          } else {
            return {};
          }
        });
    } else {
      return new Promise(resolve => {
        resolve(JSON.parse(cc.sys.localStorage.getItem('user') || '{}'));
      });
    }
  }

  getValues(keys): Promise<Array<any>> {
    if (Config.instant) {
      return FBInstant.player
        .getDataAsync(keys)
        .then(function(stats) {
          return stats;
        });
    } else {
      return new Promise((resolve, reject) =>  {
        let ret = {};
        for (let key of keys) {
          ret[key] = cc.sys.localStorage.getItem(key);
        }
        resolve(ret);
      });
    }
  }

  setValue(key, value) {
    if (Config.instant) {
      FBInstant.player
        .setDataAsync({
          key: value
        })
        .then(function() {
          cc.log('data is set');
        });
    } else {
      cc.sys.localStorage.setItem(key, value);
    }
  }

  setValues(jsonObject) {
    if (Config.instant) {
      FBInstant.player
        .setDataAsync(jsonObject)
        .then(function() {
          cc.log('data is set');
        });
    } else {
      let keys = Object.keys(jsonObject);
      for (let key of keys) {
        cc.sys.localStorage.setItem(key, jsonObject[key]);
      }
    }
  }

  private static instance: DataService;

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }
}