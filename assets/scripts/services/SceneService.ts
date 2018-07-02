import {Promise} from 'es6-promise';
import {SceneComponent} from '../components/SceneComponent';
import {MainScene} from '../scenes/MainScene';
import {DialogService} from './DialogService';

export interface SceneInfo {
  nextScene?: any;
}

export class SceneService {
  scenes = {};
  prevScene;
  curScene;
  stackSceneNames = [];
  stackScenes = [];
  main: MainScene;

  setMain(main: MainScene) {
    this.main = main;
  }

  addScene(sceneName, node) {
    this.scenes[sceneName] = node;
  }

  goBack(transition?: SceneTransition) {
    this.stackSceneNames.pop();
    let lastScene = this.stackScenes.pop();
    let prevScene = this.stackScenes[this.stackScenes.length - 1];
    if (prevScene) {
      this.curScene = prevScene;
      this.switchScene(lastScene, this.curScene, transition);
    }
  }

  goToScene(sceneName, transition?: SceneTransition, clearStacks?) {
    this.prevScene = this.curScene;
    this.curScene = this.scenes[sceneName];
    this.stackScenes.push(this.curScene);
    this.stackSceneNames.push(sceneName);
    this.switchScene(this.prevScene, this.curScene, transition);
    cc.log("Go to scene: ", sceneName);
    if (clearStacks) {
      this.stackScenes = [this.curScene];
      this.stackSceneNames = [sceneName];
    }
  }

  isInScene(sceneType) {
    let sceneName = this.stackSceneNames[this.stackSceneNames.length-1];
    return !!(sceneName && sceneName == sceneType);
  }

  private switchScene(prevScene, curScene, transition?: SceneTransition) {
    DialogService.getInstance().closeAll();

    if (!transition) {
      transition = new NoneTransition();
    }

    if (prevScene) {
      let prevSceneComp: SceneComponent = prevScene.getComponent(SceneComponent);
      prevSceneComp.onLeave();
    }

    let curSceneComp: SceneComponent = curScene.getComponent(SceneComponent);
    curScene.active = true;
    curScene.opacity = 0;
    curSceneComp.onEnter();

    transition.processTransition(prevScene, curScene)
      .then(() => {
        if (prevScene) {
          prevScene.active = false;
        }

        curScene.opacity = 255;

        if (cc.game.canvas) {
          cc.game.canvas.style.cursor = 'auto';
        }
      });
  }

  static instance: SceneService;

  static getInstance(): SceneService {
    if (!SceneService.instance) {
      SceneService.instance = new SceneService();
    }

    return SceneService.instance;
  }
}

export interface SceneTransition {
  processTransition(prevScene, curScene): Promise<any>;
}

export class NoneTransition implements SceneTransition {
  processTransition(prevScene, curScene): Promise<any> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

export class FadeOutInTransition implements SceneTransition {

  constructor(public duration: number) {
  }

  processTransition(prevScene: any, curScene: any): Promise<any> {
    return new Promise((resolve) => {
      if (prevScene) {
        prevScene.runAction(cc.fadeOut(this.duration));
      }

      curScene.runAction(
        cc.sequence(
          cc.fadeIn(this.duration),
          cc.callFunc(() => {
            if (prevScene) {
              prevScene.stopAllActions();
            }
            resolve();
          })
        )
      );
    });
  }
}

export class LeftToRightTransition implements SceneTransition {

  constructor(public duration: number) {
  }

  processTransition(prevScene: any, curScene: any): Promise<any> {
    return new Promise((resolve) => {
      if (prevScene) {
        prevScene.x = 0;
        prevScene.runAction(
          cc.moveTo(this.duration, cc.v2(cc.winSize.width, 0))
        );
      }

      curScene.x = -cc.winSize.width;
      curScene.opacity = 255;
      curScene.runAction(
        cc.sequence(
          cc.moveTo(this.duration, cc.v2(0, 0)),
          cc.callFunc(() => {
            if (prevScene) {
              prevScene.stopAllActions();
              prevScene.x = 0;
              prevScene.opacity = 0;
            }
            curScene.x = 0;
            curScene.opacity = 255;
            resolve();
          })
        )
      );
    });
  }
}
