import {GAME_EVENT} from '../../Constants';
import {NodeUtils} from '../../../core/NodeUtils';
import {SceneComponent} from '../../../core/SceneComponent';
const {ccclass, property} = cc._decorator;

@ccclass
export class CommonDialog extends SceneComponent {

  @property(cc.Label)
  title: cc.Label = null;

  @property(cc.Label)
  content: cc.Label = null;

  @property(cc.Node)
  cancelBtn: cc.Node = null;

  onOk;
  onCancel;

  onEnter() {
    super.onEnter();
  }

  onLeave() {
    super.onLeave();
  }

  onLanguageChange() {
    NodeUtils.setLocaleLabel(this.node, 'ok_lbl', 'ok', {upper: true});
    NodeUtils.setLocaleLabel(this.node, 'cancel_lbl', 'cancel', {upper: true});
  }

  onCloseClick() {
    this.node.emit(GAME_EVENT.CLOSE_DIALOG);
    this.node.removeFromParent();
  }

  setData(title, content, onOk?, hasCancel = false, onCancel?) {
    this.title.string = title;
    this.content.string = content;
    this.cancelBtn.active = hasCancel;
    this.onOk = onOk;
    this.onCancel = onCancel;
  }

  onOkClick() {
    if (this.onOk) {
      this.onOk();
    }
    this.onCloseClick();
  }

  onCancelClick() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.onCloseClick();
  }
}
