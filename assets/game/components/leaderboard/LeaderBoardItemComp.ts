import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import {ShaderUtils} from '../../../core/ShaderUtils';
import {LeaderBoardItem} from '../../Model';
import {NodeUtils} from '../../../core/NodeUtils';

@ccclass
export class LeaderBoardItemComp extends ShaderUtils {

  @property(cc.Sprite)
  avatar: cc.Sprite = null;

  @property(cc.Label)
  playername: cc.Label = null;

  @property(cc.Label)
  score: cc.Label = null;

  @property(cc.Label)
  rank: cc.Label = null;

  onLoad() {
    ShaderUtils.useShaderOnNode('circle', this.avatar.node);
  }

  setInfo(itemInfo: LeaderBoardItem) {
    NodeUtils.loadAvatar(this.avatar, itemInfo.avatar);
    this.playername.string = itemInfo.name;
    this.score.string = itemInfo.score;
    this.rank.string = itemInfo.rank;
  }
}