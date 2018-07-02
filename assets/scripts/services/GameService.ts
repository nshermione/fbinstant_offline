import {PlayScene} from '../scenes/Play';
import {Cell} from '../components/Cell';
import {SocialService} from './SocialService';
import {Config} from '../Config';

declare var FBInstant: any;

export class GameService {

  private score = 0;
  private hiScore = 0;
  private rewardScore = 0;

  loadSavedData() {
    if (Config.instant) {
      FBInstant.getLeaderboardAsync(Config.worldLeaderboard)
        .then((leaderboard) => {
          return leaderboard.getPlayerEntryAsync();
        })
        .then((entry) => {
          this.hiScore = +entry.getScore();
        });
    }
  }

  resetScore() {
    this.score = 0;
  }

  pushScore(score) {
    this.rewardScore += score;
  }

  applyRewardScore() {
    this.score += this.rewardScore;
    this.score = Math.max(0, this.score);
    this.rewardScore = 0;
    this.hiScore = Math.max(this.hiScore, this.score);
    SocialService.getInstance().addFBScore(Config.worldLeaderboard, this.hiScore);
  }

  saveFBScore(leaderBoardName) {
    return SocialService.getInstance().addFBScore(leaderBoardName, this.hiScore);
  }

  getScore() {
    return this.score;
  }

  getHighScore() {
    return this.hiScore;
  }

  private static instance: GameService;

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  game: PlayScene;

  setGameScene(game: PlayScene) {
    this.game = game;
  }

}