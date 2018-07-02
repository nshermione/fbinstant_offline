import {Config} from '../Config';

declare var FBInstant: any;

export class AdService {
  preloadedRewardedVideo;
  preloadedInterstitial;
  endgameCount = 0;
  startTime = 0;
  videoTime = 600;
  interstitialTime = 240;

  constructor() {
    this.startTime = Date.now();
  }

  canShowWebAd() {
    return !cc.sys.isNative && !Config.dev && !Config.instant;
  }

  preloadAds() {
    if (!Config.instant) return;
    this.preloadVideo();
    this.preloadInterstitial();
  }

  preloadInterstitial() {
    this.preloadedInterstitial = null;

    FBInstant.getInterstitialAdAsync(
      '832330236966450_844338219098985', // Your Ad Placement Id
    ).then((interstitial) => {
      // Load the Ad asynchronously
      this.preloadedInterstitial = interstitial;
      return this.preloadedInterstitial.loadAsync();
    }).then(() => {
      console.log('Interstitial preloaded')
    }).catch((err) => {
      console.error('Interstitial failed to preload: ' + err.message);
    });
  }

  preloadVideo() {
    this.preloadedRewardedVideo = null;

    FBInstant.getRewardedVideoAsync(
      '832330236966450_844342755765198', // Your Ad Placement Id
    ).then((rewarded) => {
      // Load the Ad asynchronously
      this.preloadedRewardedVideo = rewarded;
      return this.preloadedRewardedVideo.loadAsync();
    }).then(() => {
      console.log('Rewarded video preloaded')
    }).catch((err) => {
      console.error('Rewarded video failed to preload: ' + err.message);
    });
  }

  showInterstitialAds() {
    if (!Config.instant) return;
    if (!this.preloadedInterstitial) return;
    this.preloadedInterstitial.showAsync()
      .then(() => {
        // Perform post-ad success operation
        console.log('Interstitial ad finished successfully');
        this.preloadInterstitial();
      })
      .catch((e) => {
        this.preloadInterstitial();
        console.error(e.message);
      });
  }

  showVideoAds(callback?) {
    if (!Config.instant) return;
    if (!this.preloadedRewardedVideo) return;

    this.preloadedRewardedVideo.showAsync()
      .then(() => {
        // Perform post-ad success operation
        if (callback) {
          callback();
        }

        this.preloadVideo();
      })
      .catch((e) => {
        this.preloadVideo();
        console.error(e.message);
      });
  }

  showEndgameAds() {
    this.endgameCount++;
    let playTime = (Date.now() - this.startTime) / 1000; // seconds

    if (this.preloadedRewardedVideo && (this.endgameCount >= 6 || playTime >= this.videoTime)) {
      this.videoTime += 400;
      this.endgameCount = 0;
      this.startTime = playTime;
      this.showVideoAds();
      return;
    }

    if (this.preloadedInterstitial && (this.endgameCount == 3 || playTime >= this.interstitialTime)) {
      this.interstitialTime += 400;
      this.showInterstitialAds();
    }
  }

  private static instance: AdService;

  static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }

    return AdService.instance;
  }
}