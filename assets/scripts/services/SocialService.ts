/**
 * Created by thinhtran on 12/20/17.
 */
import {Config} from '../Config';
import {KEYS, LOGIN_TYPE} from '../core/Constants';
import {NodeUtils} from '../core/NodeUtils';
import {GlobalInfo} from '../core/GlobalInfo';
import {HttpService} from './HttpService';
import {LanguageService} from '../core/LanguageService';
import {DialogService} from './DialogService';
import {GameService} from './GameService';
import {CString} from '../core/String';
import {LeaderBoardItem} from '../components/LeaderBoard';

declare let FBInstant: any;

export class SocialService {

  onLoginFB;

  init() {
    if (Config.instant) {
      this.initInstant();
    } else {
      this.initFB();
    }
  }

  initInstant() {
    // ios
    // FBInstant.getInterstitialAdAsync(
    //   '1682532471783229_1779066125463196', // Your Ad Placement Id
    // ).then(function (interstitial) {
    //   // Load the Ad asynchronously
    //   GlobalInfo.instantAds = interstitial;
    //   return GlobalInfo.instantAds.loadAsync();
    // }).then(function () {
    //   console.log('Interstitial preloaded')
    // }).catch(function (err) {
    //   console.log('Interstitial failed to preload: ' + err.message);
    // });
  }

  showAudienceAds() {
    if (GlobalInfo.instantAds) {
      GlobalInfo.instantAds.showAsync()
        .then(function () {
          // Perform post-ad success operation
          console.log('Interstitial ad finished successfully');
        })
        .catch(function (e) {
          console.log(e.message);
        });
    }
  }

  checkLoginTwitter() {
    let accessToken = cc.sys.localStorage.getItem('tw_access_token') || '';
    cc.sys.localStorage.setItem('tw_access_token', '');
    if (accessToken) {
      GlobalInfo.me.loginType = LOGIN_TYPE.LOGIN_TW;
    }
  }

  initFB() {
    if (cc.sys.isNative) {

    } else {
    }
  }

  inviteFBInstant() {
    if (Config.instant) {
      NodeUtils.captureScreen().then((dataImage) => {
        FBInstant.context
          .chooseAsync()
          .then(() => {
            FBInstant.context.updateAsync({
              action: 'CUSTOM',
              cta: 'Play',
              image: dataImage,
              text: {
                default: `${FBInstant.player.getName()} just scored ${GameService.getInstance().getScore()}!`,
                localizations: {}
              },
              template: 'pass_score',
              data: {myReplayData: '...'},
              strategy: 'IMMEDIATE',
              notification: 'NO_PUSH',
            }).then(() => {

            });
          });
      });
    }
  }

  addFBScore(leaderboardName, hiScore) {
    return FBInstant
      .getLeaderboardAsync(leaderboardName)
      .then(leaderboard => {
        console.log(leaderboard.getName());
        return leaderboard.setScoreAsync(hiScore, `{}`);
      })
      .then(() => console.log('Score saved'))
      .catch(error => console.error(error));
  }

  getFBScore(leaderboardName, isPersonal = false): Promise<Array<LeaderBoardItem>> {
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
          items.push(item);
        }
        items.sort((a: LeaderBoardItem, b: LeaderBoardItem): number => {
          return a.rank - b.rank;
        });
        return items;
      }).catch(error => console.error(error));
  }

  shareFB(base64Image, msg?, callback?) {
    if (Config.instant) {
      FBInstant.context
        .chooseAsync()
        .then(() => {
          Config.personalLeaderboard = 'Personal Leaderboard.' + FBInstant.context.getID();
          FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Play',
            image: base64Image,
            text: {
              default: msg,
              localizations: {}
            },
            template: 'pass_score',
            data: {myReplayData: '...'},
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
            data: {myReplayData: '...'},
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

  shareTwitter(msg) {
    cc.sys.openURL('https://twitter.com/intent/tweet?text=' + msg);
  }

  private static instance: SocialService;

  static getInstance(): SocialService {
    if (!SocialService.instance) {
      SocialService.instance = new SocialService();
    }

    return SocialService.instance;
  }
}