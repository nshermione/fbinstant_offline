import executionOrder = cc._decorator.executionOrder;
import {GameState} from '../../states/GameState';
import {NodeUtils} from '../../../core/NodeUtils';
import {SceneComponent} from '../../../core/SceneComponent';
import {GameService} from '../../../services/GameService';

const {ccclass, property} = cc._decorator;

declare var FBInstant: any;

@ccclass
export class PlayScene extends SceneComponent {

  @property(cc.Node)
  stateNode: cc.Node = null;

  @property(cc.Node)
  ui: cc.Node = null;

  state: GameState;

  onEnter() {
    super.onEnter();
    GameService.getInstance().setGameScene(this);

    try {
      GameService.getInstance().loadSavedData();
    } catch (e) {
      cc.log('ERROR', e);
    }
  }

  onLeave() {
    super.onLeave();
  }

  changeState(stateNodeName, stateClass, data?) {
    let stateNode = NodeUtils.findNode(this.stateNode, stateNodeName);
    let stateComp = stateNode.getComponent(stateClass);
    if (this.state) {
      this.state.onLeave(this, data);
      this.state.node.active = false;
    }

    this.state = stateComp;
    this.state.node.active = true;
    this.state.onEnter(this, data);
    cc.log('Enter state:', stateNodeName, data);
  }

}