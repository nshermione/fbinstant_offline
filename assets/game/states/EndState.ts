import {GameState, IGameState} from './GameState';
import {PlayScene} from '../scenes/play/Play';

const {ccclass, property, executionOrder} = cc._decorator;

@ccclass
@executionOrder(1)
export class EndState extends GameState implements IGameState {

  onEnter(game: PlayScene, data) {
  }

  onUpdate(game: PlayScene, data: any) {
  }

  onLeave(game: PlayScene, data: any) {
  }
}