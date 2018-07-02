import {GameState, IGameState} from './GameState';
import {PlayScene} from '../scenes/Play';
import {GlobalInfo} from '../core/GlobalInfo';
import {GAME_STATE, KEYS} from '../core/Constants';
import {DialogService} from '../services/DialogService';
import {RoomService} from '../services/RoomService';
import {WaitState} from './WaitState';
import {SoundService} from '../services/SoundService';

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