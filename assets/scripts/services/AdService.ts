import {Config} from "../Config";

declare var FBInstant: any;

export class AdService {
  preloadedRewardedVideo;
  preloadedInterstitial;

  canShowWebAd() {
    return !cc.sys.isNative && !Config.dev && !Config.instant;
  }

  preloadAds() {
    if (!Config.instant) return;
    this.preloadedRewardedVideo = null;

    FBInstant.getRewardedVideoAsync(
      '125121001621886_125127861621200', // Your Ad Placement Id
    ).then(function(rewarded) {
      // Load the Ad asynchronously
      this.preloadedRewardedVideo = rewarded;
      return this.preloadedRewardedVideo.loadAsync();
    }).then(function() {
      console.log('Rewarded video preloaded')
    }).catch(function(err){
      console.error('Rewarded video failed to preload: ' + err.message);
    });

    this.preloadedInterstitial = null;

    FBInstant.getInterstitialAdAsync(
      '125121001621886_125296378271015', // Your Ad Placement Id
    ).then(function(interstitial) {
      // Load the Ad asynchronously
      this.preloadedInterstitial = interstitial;
      return this.preloadedInterstitial.loadAsync();
    }).then(function() {
      console.log('Interstitial preloaded')
    }).catch(function(err){
      console.error('Interstitial failed to preload: ' + err.message);
    });
  }

  showVideoAds(callback?) {
    if (!Config.instant) return;
    if (!this.preloadedRewardedVideo) return;

    this.preloadedRewardedVideo.showAsync()
      .then(function() {
        // Perform post-ad success operation
        if (callback) {
          callback();
        }
      })
      .catch(function(e) {
        console.error(e.message);
      });
  }

  showEndgameAds() {
    if (!this.preloadedInterstitial) return;

    this.preloadedInterstitial.showAsync()
      .then(function() {
        // Perform post-ad success operation
        console.log('Interstitial ad finished successfully');
      })
      .catch(function(e) {
        console.error(e.message);
      });
  }

  private static instance: AdService;

  static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }

    return AdService.instance;
  } 
}