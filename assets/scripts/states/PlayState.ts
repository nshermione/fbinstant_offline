import {GameState, IGameState, PlayUpdateData} from './GameState';
import {PlayScene} from '../scenes/Play';
import {KEYS, SERVER_EVENT} from '../core/Constants';
import EventMouse = cc.Event.EventMouse;
import {DialogService} from "../services/DialogService";
import {RoomService} from "../services/RoomService";

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