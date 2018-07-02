/**
 * Created by thinhtran on 5/18/18.
 */

import {GameService} from '../services/GameService';
import {SocialService} from '../services/SocialService';
import {NodeUtils} from '../core/NodeUtils';
import {Config} from '../Config';
const {ccclass, property} = cc._decorator;

declare var FBInstant: any;

@ccclass
export class LeaderBoard extends cc.Component {

  @property(cc.Node)
  sampleItem: cc.Node = null;

  @property(cc.ScrollView)
  itemScrollView: cc.ScrollView = null;

  @property(cc.Node)
  loading: cc.Node = null;

  @property(cc.Label)
  title: cc.Label = null;

  onLoad() {
    this.loading.runAction(
      cc.rotateBy(3, 720).repeatForever()
    )
  }

  setTitle(title) {
    this.title.string = title;
  }

  shareInLeaderBoard() {
    GameService.getInstance().shareInLeaderboard();
  }

  getAndUpdateItems(leaderBoardName, isPersonal=false) {
    this.loading.active = true;
    this.itemScrollView.content.removeAllChildren();
    GameService.getInstance().saveFBScore(leaderBoardName)
      .then(() => {
        SocialService.getInstance().getFBScore(leaderBoardName, isPersonal)
          .then((items: Array<LeaderBoardItem>) => {
            this.loading.active = false;
            for (let item of items) {
              let itemNode = cc.instantiate(this.sampleItem);
              itemNode.active = true;
              NodeUtils.setLabel(itemNode, 'name', item.name);
              NodeUtils.setLabel(itemNode, 'rank', item.rank);
              NodeUtils.setLabel(itemNode, 'score', item.score + ' points');
              let avatarNode = NodeUtils.findNode(itemNode, 'avatar');
              let avatarSprite: cc.Sprite = avatarNode.getComponent(cc.Sprite);
              if (avatarSprite) {
                NodeUtils.loadAvatar(avatarSprite, item.avatar);
              }
              this.itemScrollView.content.addChild(itemNode);
            }
          })
      });
  }

  showWorld() {
    this.node.active = true;
    this.node.opacity = 0;
    this.node.runAction(cc.fadeIn(0.3));
    this.getAndUpdateItems(Config.worldLeaderboard);
  }

  show() {
    this.node.active = true;
    this.node.opacity = 0;
    this.node.runAction(cc.fadeIn(0.3));
    this.getAndUpdateItems(Config.worldLeaderboard, true);
  }

  hide() {
    this.node.runAction(
      cc.sequence(
        cc.fadeOut(0.15),
        cc.callFunc(() => {
          this.itemScrollView.content.removeAllChildren();
          this.node.active = false;
        })
      )
    )
  }
}

export class LeaderBoardItem {
  rank;
  name;
  score;
  avatar;
}