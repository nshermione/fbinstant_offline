import {Config} from '../Config';
import {LeaderBoardItem} from '../../game/Model';

declare let FBInstant: any;

export class SocialService {

  init() {

  }

  addFBScore(leaderboardName, score, extraData = {}) {
    if (!Config.instant) return;

    return FBInstant
      .getLeaderboardAsync(leaderboardName)
      .then(leaderboard => {
        console.log(leaderboard.getName());
        return leaderboard.setScoreAsync(score, JSON.stringify(extraData));
      })
      .then(() => console.log('Score saved'))
      .catch(error => console.error(error));
  }

  getFBScore(leaderboardName, isPersonal = false): Promise<Array<LeaderBoardItem>> {
    if (!Config.instant) return;

    return FBInstant
      .getLeaderboardAsync(leaderboardName)
      .then(leaderboard => {
        if (isPersonal) {
          return leaderboard.getConnectedPlayerEntriesAsync(50, 0)
        } else {
          return leaderboard.getEntriesAsync(50, 0)
        }
      })
      .then(entries => {
        let items = [];
        for (let i = 0; i < entries.length; i++) {
          let item = new LeaderBoardItem();
          item.rank = entries[i].getRank();
          item.score = entries[i].getScore();
          item.name = entries[i].getPlayer().getName();
          item.avatar = entries[i].getPlayer().getPhoto();
          // item.time = JSON.parse(entries[i].getExtraData()).time;
          items.push(item);
        }
        items.sort((a: LeaderBoardItem, b: LeaderBoardItem): number => {
          return a.rank - b.rank;
        });
        return items;
      }).catch(error => console.error(error));
  }

  updateResult(base64Image, msg?, callback?) {
    if (Config.instant) {
      FBInstant.updateAsync({
        action: 'CUSTOM',
        cta: 'Play',
        image: base64Image,
        text: {
          default: msg,
          localizations: {}
        },
        template: 'pass_score',
        data: {},
        strategy: 'IMMEDIATE',
        notification: 'NO_PUSH',
      }).then(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  shareFB(base64Image, msg?, callback?, shareData = {}) {
    if (Config.instant) {
      FBInstant.context
        .chooseAsync()
        .then(() => {
          FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Play',
            image: base64Image,
            text: {
              default: msg,
              localizations: {}
            },
            template: 'pass_score',
            data: shareData,
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
          }).then(() => {
            if (callback) {
              callback();
            }
          });
        })
        .catch(() => {
          FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Play',
            image: base64Image,
            text: {
              default: msg,
              localizations: {}
            },
            template: 'pass_score',
            data: shareData,
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
          }).then(() => {
            if (callback) {
              callback();
            }
          });
        });
    }
  }

  private static instance: SocialService;

  static getInstance(): SocialService {
    if (!SocialService.instance) {
      SocialService.instance = new SocialService();
    }

    return SocialService.instance;
  }
}