import {NodeUtils} from '../core/NodeUtils';
import {GameService} from '../services/GameService';
import {Config} from '../Config';
import Vec2 = cc.Vec2;
const {ccclass, property} = cc._decorator;

@ccclass
export class Cell extends cc.Component {

  cellEnabled = false;
  value = 0;

  @property(cc.Label)
  valueText: cc.Label = null;

  @property(cc.Node)
  activeBg: cc.Node = null;

  coord: Vec2 = new Vec2();

  onLoad() {
    NodeUtils.applyWebHover(this.activeBg);
  }

  onCellClick() {
    if (this.cellEnabled) {
      GameService.getInstance().pushCell(this);
    }
  }

  doSelectAnim() {
    this.activeBg.stopAllActions();
    this.activeBg.runAction(
      cc.sequence(
        cc.scaleTo(0.3, 1.1),
        cc.scaleTo(0.3, 1)
      ).repeatForever()
    );
  }

  stopSelectAnim() {
    this.activeBg.stopAllActions();
    this.activeBg.runAction(
      cc.scaleTo(0.1, 1)
    );
  }

  setValue(val) {
    this.value = val;
    this.valueText.string = '' + val;
    this.activeBg.active = true;
    this.activeBg.color = cc.hexToColor(Config.color[val % Config.color.length]);
    this.enableClick();

  }

  showAnim() {
    this.activeBg.scale = 0;
    this.activeBg.runAction(cc.scaleTo(0.3, 1));
  }

  hideCell() {
    this.value = 0;
    this.valueText.string = '' + 0;
    this.stopSelectAnim();
    this.activeBg.active = false;
    this.disableClick();
  }

  setCoord(x, y) {
    this.coord.x = x;
    this.coord.y = y;
  }

  disableClick() {
    this.cellEnabled = false;
  }

  enableClick() {
    this.cellEnabled = true;
  }

  increaseValue() {
    this.value++;
    this.setValue(this.value);
  }
}