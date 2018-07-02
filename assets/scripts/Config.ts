import {Promise} from 'es6-promise';
import {ModelUtils} from './core/ModelUtils';

export let Config = {
  defaultLanguage: "en",
  canvasWidth: 640,
  canvasHeight: 960,
  boardWidth: 15,
  boardHeight: 15,
  cellSize: 40,
  selectServer: false,
  serverUrl: "ws://128.199.240.46:5003/socket",
  uploadImageUrl: "https://xocaro.io/api/upload/upload.php",
  ads: {
    home: "https://xocaro.io/ads.php?view=home",
    endgame: "https://xocaro.io/ads.php?view=endgame"
  },
  share: {
    title: 'xocaro.io',
    desc: 'Lol... I have score {0} with {1}. How about you? Come and play with me at xocaro.io!'
  },
  site: "https://xocaro.io",
  checksum: "b314e0e184d14d1ae3f05bc033636798",
  maxSeat: 2,
  fbId: "125121001621886",
  gaId: "UA-8933281-14",
  maxNameLength: 12,
  maxViewer: 4,
  viewerAvatarSize: 36,
  repositionLeaderboardDuration: 0.2,
  leaderboardItemHeight: 65,
  countdowntime: 3,
  dev: true,
  instant: false,
  personalLeaderboard: 'Personal Leaderboard.',
  worldLeaderboard: 'World Leaderboard',
  inviteImage: "",
  color: [
    '#00b8d4',
    '#ffc58b',
    '#8cdbff',
    '#ff5395',
    '#00ffdc',
    '#b484f3',
    '#ff9578',
    '#bdea71',
    '#ffe78a',
    '#7fffdd',
    '#ffe85b',
    '#1dda59',
    '#ffed65',
    '#ff8d92',
    '#ac88ff',
    '#fffc5c',
    '#b3fefe',
    '#b2ff59',
    '#a0ffe2',
    '#ff7eb2',
  ]
};

export function loadProjectConfig(): Promise<any> {
  return new Promise((resolve, reject) => {
    let configFile = 'project.json';
    if (cc.sys.isNative) {
      configFile = 'project.mobile.json';
    }
    cc.log('config file:', configFile);
    cc.loader.loadRes(configFile, (err, resource: any) => {
      ModelUtils.merge(Config, resource);
      resolve();
    });
  });
}

