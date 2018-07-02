import {GameState, IGameState} from './GameState';
import {PlayScene} from '../scenes/Play';

const {ccclass, property, executionOrder} = cc._decorator;

@ccclass
@executionOrder(1)
export class WaitState extends GameState implements IGameState {

  game: PlayScene;


  onEnter(game: PlayScene) {

  }

  onUpdate(game: PlayScene, data: any) {
  }

  onLeave(game: PlayScene, data: any) {

  }
}