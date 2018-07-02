import {DIALOG_TYPE, GAME_EVENT} from '../game/Constants';
import {NodeUtils} from '../core/NodeUtils';

const {ccclass, property} = cc._decorator;

@ccclass
export class DialogService extends cc.Component {

  @property({
    type: cc.Prefab
  })
  arr_prefab: Array<cc.Prefab> = [];


  constructor() {
    super();
    DialogService.instance = this;
  }

  static init(instance) {
    DialogService.instance = instance;
    cc.game.addPersistRootNode(instance.node);
  }

  onLoad() {

  }

  // showToast(msg, time = 4): ToastDialog {
  //   this.removeDialog(DIALOG_TYPE.TOAST);
  //   let dlg = this.createDialog(DIALOG_TYPE.TOAST);
  //   let toastDlg: ToastDialog = dlg.getComponent(ToastDialog);
  //   toastDlg.setMessage(msg);
  //   toastDlg.show(time);
  //   this.dialogInEffect(dlg);
  //   this.node.addChild(dlg);
  //   return toastDlg;
  // }
  //
  // showNotice(msg, callback?): NoticeDialog {
  //   let dlg = this.createDialog(DIALOG_TYPE.NOTICE);
  //   let noticeDlg: NoticeDialog = dlg.getComponent(NoticeDialog);
  //   noticeDlg.setMessage(msg);
  //   this.dialogInEffect(dlg);
  //   this.stretchShadow(dlg);
  //   this.node.addChild(dlg);
  //   if (callback) {
  //     dlg.once(GAME_EVENT.CLOSE_DIALOG, () => {
  //       callback();
  //     });
  //   }
  //   return noticeDlg;
  // }
  //
  // showConnecting() : ConnectingDialog {
  //   this.removeDialog(DIALOG_TYPE.CONNECTING);
  //   let dlg = this.createDialog(DIALOG_TYPE.CONNECTING);
  //   let connectingDlg: ConnectingDialog = dlg.getComponent(ConnectingDialog);
  //   this.node.addChild(dlg);
  //   this.stretchShadow(dlg)
  //   return connectingDlg;
  // }
  //
  // showWaiting() {
  //   this.removeDialog(DIALOG_TYPE.WAITING);
  //   let dlg = this.createDialog(DIALOG_TYPE.WAITING);
  //   let waitingDialog: WaitingDialog = dlg.getComponent(WaitingDialog);
  //   this.node.addChild(dlg);
  //   this.stretchShadow(dlg)
  //   return waitingDialog;
  // }
  //
  // showDraw() {
  //   let dlg = this.createDialog(DIALOG_TYPE.DRAW);
  //   this.dialogInEffect(dlg);
  //   this.node.addChild(dlg);
  //   this.stretchShadow(dlg);
  // }
  //
  // showWinner(winTimes, winRate) {
  //   let dlg = this.createDialog(DIALOG_TYPE.WIN);
  //   let winDialog: WinDialog = dlg.getComponent(WinDialog);
  //   winDialog.setData(winTimes, winRate);
  //   this.dialogInEffect(dlg);
  //   this.node.addChild(dlg);
  //   this.stretchShadow(dlg);
  //   return winDialog;
  // }
  //
  // showLoser() {
  //   let dlg = this.createDialog(DIALOG_TYPE.LOSE);
  //   let loseDialog: LoseDialog = dlg.getComponent(LoseDialog);
  //   this.dialogInEffect(dlg);
  //   this.node.addChild(dlg);
  //   this.stretchShadow(dlg);
  //   return loseDialog;
  // }
  //
  // hideConnecting() {
  //   this.removeDialog(DIALOG_TYPE.CONNECTING);
  // }
  //
  // hideWaiting() {
  //   this.removeDialog(DIALOG_TYPE.WAITING);
  // }

  removeDialog(dlg_type) {
    let dlg = this.getDialog(dlg_type);
    if (dlg) {
      dlg.removeFromParent();
      dlg.destroy();
    }
  }

  closeAll() {
    this.node.removeAllChildren();
  }

  getDialog(dlg_type) {
    return this.node.getChildByTag(dlg_type);
  }

  dialogInEffect(dlg: cc.Node) {
    dlg.opacity = 0;
    let fadeAction = cc.fadeIn(0.1);
    dlg.y += 20;
    let moveDownAction = cc.moveBy(0.1, cc.v2(0, -20));
    dlg.runAction(
      cc.spawn(fadeAction, moveDownAction)
    );
  }

  stretchShadow(dlg) {
    let shadow = NodeUtils.findNode(dlg, 'shadow');
    if (shadow) {
      shadow.width = cc.winSize.width;
      shadow.height = cc.winSize.height;
    }
  }

  private createDialog(dlg_type): cc.Node {
    let dlg = cc.instantiate(this.arr_prefab[dlg_type]);
    dlg.tag = dlg_type;
    return dlg;
  }

  static instance: DialogService;

  static getInstance(): DialogService {
    if (!DialogService.instance) {
      DialogService.instance = new DialogService();
      DialogService.init(DialogService.instance);
    }

    return DialogService.instance;
  }
}