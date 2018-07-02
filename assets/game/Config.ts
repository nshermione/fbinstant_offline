import {Promise} from 'es6-promise';
import {ModelUtils} from '../core/ModelUtils';

export let Config = {
  defaultLanguage: "en",
  canvasWidth: 640,
  canvasHeight: 960,
  instant: false,
  dev: true,
  worldLeaderboard: 'World Leaderboard',
};

export function loadProjectConfig(): Promise<any> {
  return new Promise((resolve, reject) => {
    let configFile = 'project.json';
    // if (cc.sys.isNative) {
    //   configFile = 'project.mobile.json';
    // }
    cc.loader.loadRes(configFile, (err, resource: any) => {
      ModelUtils.merge(Config, resource);
      resolve();
    });
  });
}

