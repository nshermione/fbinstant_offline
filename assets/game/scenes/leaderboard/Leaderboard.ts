import {SceneComponent} from '../../../core/SceneComponent';
import {FadeOutInTransition, SceneService} from '../../../services/SceneService';
import {GameService} from '../../../services/GameService';
import {LeaderBoardItemComp} from '../../components/leaderboard/LeaderBoardItemComp';
import {NodeUtils} from '../../../core/NodeUtils';
import {SocialService} from '../../../services/SocialService';
import {Config} from '../../Config';
import {LanguageService} from '../../../services/LanguageService';
import {LeaderBoardItem} from '../../Model';
const {ccclass, property} = cc._decorator;

declare let FBInstant: any;

@ccclass
export class Leaderboard extends SceneComponent {

  @property(cc.Node)
  tabs: cc.Node = null;

  @property(cc.Node)
  worldTab: cc.Node = null;

  @property(cc.Node)
  friendTab: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(cc.ScrollView)
  itemScrollView: cc.ScrollView = null;

  @property(cc.Node)
  loading: cc.Node = null;

  @property(cc.Node)
  shareBlock: cc.Node = null;

  @property(cc.Node)
  ui: cc.Node = null;

  itemNodes: Array<cc.Node> = [];


  onEnter() {
    super.onEnter();
    setTimeout(() => {
      this.updateTabs()
    }, 10);

    this.showWorld();
  }

  onLeave() {
    super.onLeave();
  }

  onLanguageChange() {
    NodeUtils.setLocaleLabel(this.node, 'title', 'leaderboards', {upper: true});
    NodeUtils.setLocaleLabel(this.node, 'friend_title', 'friends', {upper: true});
    NodeUtils.setLocaleLabel(this.node, 'world_title', 'world', {upper: true});
    NodeUtils.setLocaleLabel(this.node, 'invite_lbl', 'invite', {upper: true});

  }

  updateTabs() {
    for (let child of this.tabs.children) {
      child.width = this.tabs.width/this.tabs.childrenCount;
    }
  }

  onBack() {
    let transition = new FadeOutInTransition(0.3);
    SceneService.getInstance().goBack(transition);
  }

  onLoad() {
    for (let i = 0; i < 50; i++) {
      let itemNode = cc.instantiate(this.itemPrefab);
      this.itemNodes.push(itemNode);
    }
    this.loading.runAction(
      cc.rotateBy(3, 720).repeatForever()
    )
  }

  shareInLeaderBoard() {
    this.ui.active = false;
    this.shareBlock.opacity = 255;
    let capturedScreen = NodeUtils.captureScreen((cc.winSize.width / 640) * 400);
    this.shareBlock.opacity = 0;
    this.ui.active = true;
    SocialService.getInstance().shareFB(
      capturedScreen,
      LanguageService.getInstance().get('playWithMe'),
    );
  }

  getAndUpdateItems(leaderBoardName, isPersonal=false) {
    this.loading.active = true;
    this.itemScrollView.content.removeAllChildren();
    if (!Config.instant) return;
    GameService.getInstance().saveFBScore(leaderBoardName)
      .then(() => {
        SocialService.getInstance().getFBScore(leaderBoardName, isPersonal)
          .then((items: Array<LeaderBoardItem>) => {
            this.loading.active = false;
            let i = 0;
            for (let item of items) {
              let itemNode = this.itemNodes[i++];
              itemNode.active = true;
              let itemComp: LeaderBoardItemComp = itemNode.getComponent(LeaderBoardItemComp);
              itemComp.setInfo(item);

              this.itemScrollView.content.addChild(itemNode);
            }
          })
      });
  }

  showWorld() {
    this.friendTab.color = cc.hexToColor('#C8D5E2');
    this.worldTab.color = cc.hexToColor('#BCDBFC');
    this.getAndUpdateItems(Config.worldLeaderboard);
  }

  show() {
    this.friendTab.color = cc.hexToColor('#BCDBFC');
    this.worldTab.color = cc.hexToColor('#C8D5E2');
    this.getAndUpdateItems(Config.worldLeaderboard, true);
  }

  hide() {
    this.node.runAction(
      cc.sequence(
        cc.fadeOut(0.15),
        cc.callFunc(() => {
          this.itemScrollView.content.removeAllChildren();
          for (let itemNode of this.itemNodes) {
            itemNode.active = false;
          }
          this.node.active = false;
        })
      )
    )
  }
}