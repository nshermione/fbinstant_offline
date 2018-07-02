import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import {GameService} from '../services/GameService';

@ccclass
export class ShareComponent extends cc.Component {

  @property(cc.Sprite)
  avatar: cc.Sprite = null;

  @property(cc.Label)
  playerName: cc.Label = null;

  @property(cc.Label)
  score: cc.Label = null;

  @property(cc.Label)
  scoreLabel: cc.Label = null;

  setScoreLabel(title) {
    this.scoreLabel.string = title;
  }
}