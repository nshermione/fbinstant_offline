import {SceneComponent} from './SceneComponent';
import {SCENE_TYPE} from './Constants';
import {TimerComponent, TimerStatic} from './TimerComponent';
import {GlobalInfo} from './GlobalInfo';
import {ShaderUtils} from './ShaderUtils';
import {DialogService} from '../services/DialogService';
import {NoneTransition, SceneService} from '../services/SceneService';
import {Config, loadProjectConfig} from '../game/Config';
import {SoundService} from '../services/SoundService';
import {GameService} from '../services/GameService';
import {TrackingService} from '../services/TrackingService';
import {SocialService} from '../services/SocialService';
import {LanguageService} from '../services/LanguageService';
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
  mainmenu: cc.Node = null;

  @property(cc.Node)
  leaderboard: cc.Node = null;

  @property(cc.Node)
  settings: cc.Node = null;

  @property(cc.Node)
  scenes: cc.Node = null;

  @property(cc.Node)
  timer: cc.Node = null;

  onLoad() {
    let sceneService = SceneService.getInstance();
    sceneService.setMain(this);
    sceneService.addScene(SCENE_TYPE.MAIN, this.mainmenu);
    sceneService.addScene(SCENE_TYPE.LEADERBOARD, this.leaderboard);
    sceneService.addScene(SCENE_TYPE.PLAY, this.play);
    sceneService.addScene(SCENE_TYPE.SETTINGS, this.settings);
    SoundService.getInstance().loadConfig();

    let timerComp = this.timer.getComponent(TimerComponent);
    TimerStatic.setTimer(timerComp);

    loadProjectConfig()
      .then(() => {
        try {
          GameService.getInstance().loadSavedData();
        } catch (e) {
          cc.log('ERROR', e);
        }

        this.boostrap();
      });

    this.onEnter();
  }

  boostrap() {
    DialogService.getInstance();

    TrackingService.getInstance().init();
    SocialService.getInstance().init();

    ShaderUtils.loadShader('circle', 'shaders/default_vert.glsl', 'shaders/circle_frag.glsl');

    cc.director.setDisplayStats(false);

    LanguageService.getInstance().init()
      .then(() => {
        if (Config.instant) {
          this.startInstantGame();
        } else {
          this.startGame();
        }
      });
  }

  startInstantGame() {
    cc.log('start instant game');
    FBInstant.startGameAsync()
      .then(() => {
        cc.log('start game');
        GlobalInfo.me.userId = FBInstant.player.getID();
        GlobalInfo.me.displayName = FBInstant.player.getName();
        GlobalInfo.me.avatar = FBInstant.player.getPhoto();

        AdService.getInstance().preloadAds();
        this.startGame();

        FBInstant.onPause(function() {
          SoundService.getInstance().stopAll();
        })
      });
  }

  startGame() {
    let transition = new NoneTransition();
    if (Config.instant) {
      // TODO: check entryPoint to play game immediately
      SceneService.getInstance().goToScene(SCENE_TYPE.MAIN, transition);
    } else {
      SceneService.getInstance().goToScene(SCENE_TYPE.LEADERBOARD, transition);
    }

  }
}