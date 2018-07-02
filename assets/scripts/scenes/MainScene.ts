import {SceneComponent} from '../components/SceneComponent';
import {Config, loadProjectConfig} from '../Config';
import {DialogService} from '../services/DialogService';
import {LanguageService} from '../core/LanguageService';
import {SocialService} from '../services/SocialService';
import {ShaderComponent} from '../core/ShaderComponent';
import {FadeOutInTransition, SceneService} from '../services/SceneService';
import {SCENE_TYPE} from '../core/Constants';
import {SoundService} from '../services/SoundService';
import {TimerComponent, TimerStatic} from '../components/TimerComponent';
import {TrackingService} from '../services/TrackingService';
import {AdService} from '../services/AdService';

const {ccclass, property} = cc._decorator;

declare let FBInstant: any;

@ccclass
export class MainScene extends SceneComponent {

  @property(DialogService)
  dialogRoot: DialogService = null;

  @property(cc.Node)
  play: cc.Node = null;

  @property(cc.Node)
  scenes: cc.Node = null;

  @property(cc.Node)
  timer: cc.Node = null;

  onLoad() {
    let sceneService = SceneService.getInstance();
    sceneService.setMain(this);
    sceneService.addScene(SCENE_TYPE.PLAY, this.play);
    SoundService.getInstance().loadConfig();

    let timerComp = this.timer.getComponent(TimerComponent);
    TimerStatic.setTimer(timerComp);

    loadProjectConfig()
      .then(() => {
        this.boostrap();
      });


    this.onEnter();
  }

  boostrap() {
    DialogService.getInstance();
    LanguageService.getInstance();
    TrackingService.getInstance().init();
    SocialService.getInstance().init();

    ShaderComponent.loadShader('circle', 'shaders/default_vert.glsl', 'shaders/circle_frag.glsl');

    cc.director.setDisplayStats(false);

    if (Config.instant) {
      this.startInstantGame();
    } else {
      this.startGame();
    }
  }

  startInstantGame() {
    cc.log('start instant game');
    FBInstant.startGameAsync()
      .then(() => {
        cc.log('start game');
        // Retrieving context and player information can only be done
        // once startGameAsync() resolves
        // let contextId = FBInstant.context.getID();
        // let contextType = FBInstant.context.getType();
        //
        Config.personalLeaderboard = 'Personal Leaderboard.' + FBInstant.context.getID();
        AdService.getInstance().preloadAds();
        this.startGame();

        FBInstant.canCreateShortcutAsync()
          .then(function (canCreateShortcut) {
            if (canCreateShortcut) {
              FBInstant.createShortcutAsync()
                .then(function () {
                  // Shortcut created
                })
                .catch(function () {
                  // Shortcut not created
                });
            }
          });
      });
  }

  startGame() {
    let transition = new FadeOutInTransition(0.5);
    SceneService.getInstance().goToScene(SCENE_TYPE.PLAY, transition);
  }
}