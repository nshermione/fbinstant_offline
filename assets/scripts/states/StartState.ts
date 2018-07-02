import {GameState, IGameState} from './GameState';
import {PlayScene} from '../scenes/Play';
import {DialogService} from "../services/DialogService";
import {GlobalInfo} from "../core/GlobalInfo";
import {GAME_STATE, KEYS} from "../core/Constants";
import {PlayState} from "./PlayState";
import {RoomService} from "../services/RoomService";
import {Config} from '../Config';
import {LanguageService} from "../core/LanguageService";

const {ccclass, property, executionOrder} = cc._decorator;

@ccclass
@executionOrder(1)
export class StartState extends GameState implements IGameState {

  onEnter(game: PlayScene, data) {
  }
}