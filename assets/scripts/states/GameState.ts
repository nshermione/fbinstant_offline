import {PlayScene} from '../scenes/Play';

export interface IGameState {
  onEnter(game: PlayScene, data: any);

  onLeave(game: PlayScene, data: any);

  onUpdate(game: PlayScene, data: any);
}

export interface PlayUpdateData {
  actionType: any;
  data: any;
}

export class GameState extends cc.Component implements IGameState {

  onLoad() {
  }

  onEnter(game: PlayScene, data: any) {
  }

  onUpdate(game: PlayScene, data: any) {
  }

  onLeave(game: PlayScene, data: any) {
  }

}

