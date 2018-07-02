import {Promise} from 'es6-promise';

export class ResourceManager {

  spriteFrames = {};

  preload(resourceFolder, updateProgress) {
    return new Promise((resolve) => {
      cc.loader.loadResDir(
        resourceFolder,
        cc.SpriteFrame,
        (...args) => {
          let percent = this.onSpriteFrameLoad.apply(this, args);
          updateProgress(percent);
        },
        (...args) => {
          this.onSpriteFrameComplete.apply(this, args);
          resolve();
        }
      );
    });
  }

  private onSpriteFrameLoad(completedCount: number, totalCount: number, sp) {
    if (totalCount == 0) {
      return 1;
    }

    return completedCount / totalCount;
  }

  private onSpriteFrameComplete(err, spriteFrames) {
    for (let sp of spriteFrames) {
      this.spriteFrames[sp.name] = sp;
    }
  }

  getSpriteFrame(frameName) {
    return this.spriteFrames[frameName];
  }

  getCardSpriteFrame(cardType) {
    return this.spriteFrames[`${cardType}_1`];
  }

  readJsonFile(path) {
    return new Promise<any>((resolve) => {
      cc.loader.loadRes(path, function (err, res) {
        resolve(res);
      });
    });
  }

  static instance: ResourceManager;

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }

    return ResourceManager.instance;
  }
}