import {GameService} from '../services/GameService';
import {SocialService} from '../services/SocialService';
import {Config} from '../Config';
import {AdService} from '../services/AdService';
const {ccclass, property} = cc._decorator;

@ccclass
export class EndGame extends cc.Component {

  @property(cc.Node)
  container: cc.Node = null;

  @property(cc.Node)
  content: cc.Node = null;

  show() {
    this.container.y = 560;
    this.node.active = true;
    this.content.opacity = 0;
    this.container.runAction(
      cc.moveTo(0.5, cc.v2(0, 0)).easing(cc.easeBackOut())
    );
    this.content.runAction(
      cc.sequence(
        cc.delayTime(0.6),
        cc.fadeIn(0.5),
        cc.callFunc(() => {
          AdService.getInstance().showEndgameAds();
        })
      )
    )
  }

  onRestart() {
    GameService.getInstance().restartGame();
  }

  onChallenge() {
    GameService.getInstance().challengeOther();
  }

  hide(callback?) {
    this.container.runAction(
      cc.moveTo(0.5, cc.v2(0, 560)).easing(cc.easeBackIn())
    );
    this.content.runAction(
      cc.sequence(
        cc.delayTime(0.3),
        cc.fadeOut(0.2),
        cc.callFunc(() => {
          this.node.active = false;
          if (callback) {
            callback();
          }
        })
      )
    )
  }
}