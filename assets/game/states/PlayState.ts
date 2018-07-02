import {GameState, IGameState, PlayUpdateData} from './GameState';
import {PlayScene} from '../scenes/play/Play';
import EventMouse = cc.Event.EventMouse;

const {ccclass, property, executionOrder} = cc._decorator;

@ccclass
@executionOrder(1)
export class PlayState extends GameState implements IGameState {


  onEnter(game: PlayScene, data: any) {
  }

  onLeave(game: PlayScene, data: any) {
  }

  onUpdate(game: PlayScene, updateData: PlayUpdateData) {
  }
}