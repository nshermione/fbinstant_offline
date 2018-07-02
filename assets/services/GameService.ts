import {PlayScene} from '../../game/scenes/play/Play';
import {SocialService} from './SocialService';
import {Config} from '../Config';
import {GlobalInfo} from '../core/GlobalInfo';
import {DataService} from './DataService';
import {ModelUtils} from '../core/ModelUtils';
import {Score, UserInfo} from '../../game/Model';

declare var FBInstant: any;

export class GameService {

  loadSavedData() {
    DataService.getInstance().getUser()
      .then((user: UserInfo) => {
        ModelUtils.merge(GlobalInfo.me, user);
        if (GlobalInfo.me.firstTime) {
          GlobalInfo.me.firstTime = false;
          if (Config.instant) {
            FBInstant.setSessionData({
              firstime: true,
            });
            FBInstant.canCreateShortcutAsync()
              .then(function (canCreateShortcut) {
                if (canCreateShortcut) {
                  FBInstant.createShortcutAsync()
                    .then(function () {
                      // Shortcut created
                    })
                    .catch(function () {
                      // Shortcut not created
                    });
                }
              });
          }
        }

        DataService.getInstance().saveUser(GlobalInfo.me);
      });
  }

  saveFBScore(leaderBoardName) {
    let score = this.getScore();
    return SocialService.getInstance().addFBScore(leaderBoardName, score.point, score);
  }

  getScore() {
    let score = new Score();
    score.point = 0;
    return score;
  }

  private static instance: GameService;

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  game: PlayScene;

  setGameScene(game: PlayScene) {
    this.game = game;
  }

}