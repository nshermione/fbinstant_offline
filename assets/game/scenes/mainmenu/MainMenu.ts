import {SceneComponent} from '../../../core/SceneComponent';
import {FadeOutInTransition, SceneService} from '../../../services/SceneService';
import {SCENE_TYPE} from '../../Constants';
const {ccclass, property} = cc._decorator;

declare let FBInstant: any;

@ccclass
export class MainMenu extends SceneComponent {

  openLeaderboard() {
    let transition = new FadeOutInTransition(0.1);
    SceneService.getInstance().goToScene(SCENE_TYPE.LEADERBOARD, transition);
  }

  openSettings() {
    let transition = new FadeOutInTransition(0.1);
    SceneService.getInstance().goToScene(SCENE_TYPE.SETTINGS, transition);
  }

  onEnter() {
    super.onEnter();
    // if (SoundService.getInstance().currentMusicName != 'main.mp3') {
    //   SoundService.getInstance().stopAll();
    //   SoundService.getInstance().playMusic('main.mp3');
    // }
  }

  onLeave() {
    super.onLeave();
  }

  onLanguageChange() {
  }
}