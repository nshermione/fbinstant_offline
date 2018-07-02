import {NodeUtils} from './NodeUtils';
const {ccclass, property} = cc._decorator;

@ccclass
export class SceneComponent extends cc.Component {

  protected __serverEvents = {};
  protected __moneyEvents = [];

  @property([cc.Node])
  hoverNodes: Array<cc.Node> = [];

  onEnter() {
    NodeUtils.applyWebHoverNodes(this.hoverNodes);
    this.onLanguageChange();
  }

  onLeave() {
  }

  onLanguageChange() {

  }
}