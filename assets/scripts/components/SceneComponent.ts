import {NodeUtils} from '../core/NodeUtils';
import {ShaderComponent} from '../core/ShaderComponent';

const {ccclass, property} = cc._decorator;

@ccclass
export class SceneComponent extends ShaderComponent {

  protected __serverEvents = {};
  protected __moneyEvents = [];

  @property([cc.Node])
  hoverNodes: Array<cc.Node> = [];

  onEnter() {
    NodeUtils.applyWebHoverNodes(this.hoverNodes);
  }

  onLeave() {
  }
}