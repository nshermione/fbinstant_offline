import {SceneComponent} from '../../../core/SceneComponent';
import {FadeOutInTransition, SceneService} from '../../../services/SceneService';
import {SoundService} from '../../../services/SoundService';
const {ccclass, property} = cc._decorator;

declare let FBInstant: any;

@ccclass
export class Settings extends SceneComponent {

  sound = true;

  onEnter() {
    super.onEnter();
    this.sound = cc.sys.localStorage.getItem('sound') == '1';
  }

  onLeave() {
    super.onLeave();
  }

  onLanguageChange() {
  }

  onBack() {
    let transition = new FadeOutInTransition(0.1);
    SceneService.getInstance().goBack(transition);
  }

  onSoundClick() {
    this.sound = !this.sound;
    SoundService.getInstance().toggle();
    SoundService.getInstance().stopAll();
    if (this.sound) {
      // SoundService.getInstance().playMusic('main.mp3');
    }
  }

}
