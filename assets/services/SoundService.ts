import {Random} from '../core/Random';

export class SoundService {

  volume = 1;

  musicId;

  playing = true;

  currentMusicName = '';

  loadConfig() {
    let sound = cc.sys.localStorage.getItem('sound');
    if (sound) {
      this.playing = sound == "1";
    } else {
      cc.sys.localStorage.setItem('sound', '1');
    }

  }

  playSound(soundName, volume=this.volume) {
    // if (this.playing) {
    //   cc.audioEngine.play('res/raw-assets/resources/sound/' + soundName, false, volume);
    // }
  }

  playMusic(musicName) {
    // this.currentMusicName = musicName;
    // if (this.musicId) {
    //   cc.audioEngine.stop(this.musicId);
    // }
    // if (this.playing) {
    //   this.musicId = cc.audioEngine.play('res/raw-assets/resources/sound/' + musicName, true, this.volume);
    // }
  }

  playPlayList() {
    // let soundId = Random.integer(1, 4);
    // SoundService.getInstance().playMusic(`ingame${soundId}.mp3`);

  }

  stopAll() {
    cc.audioEngine.stopAll();
  }

  pauseAll() {
    this.playing = false;
    if (this.musicId) {
      cc.audioEngine.pause(this.musicId);
    }
    cc.sys.localStorage.setItem('sound', '-1');
  }

  resumeAll() {
    this.playing = true;
    if (this.musicId) {
      cc.audioEngine.resume(this.musicId);
    }
    cc.sys.localStorage.setItem('sound', '1');
  }

  toggle() {
    if (this.playing) {
      this.pauseAll();
    } else {
      this.resumeAll();
    }
  }

  isPlaying() {
    return this.playing;
  }

  private static instance: SoundService;

  static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }

    return SoundService.instance;
  }
}