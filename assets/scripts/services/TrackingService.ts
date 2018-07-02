import {Config} from '../Config';

export class TrackingService {
  private static instance: TrackingService;

  init() {
    if (Config.dev) return;

    if (cc.sys.isNative) {
      (<any>sdkbox).PluginGoogleAnalytics.init();
      sdkbox.PluginGoogleAnalytics.logScreen("/");
      sdkbox.PluginGoogleAnalytics.dispatchHits();
    }
  }

  trackPage(name) {
    if (Config.dev) return;

    if (cc.sys.isNative) {
      sdkbox.PluginGoogleAnalytics.logScreen(name);
      sdkbox.PluginGoogleAnalytics.dispatchHits();
    } else if ((<any>window).gtag) {
      (<any>window).gtag('config', Config.gaId, {
        'page_title': name,
        'page_path': '/' + name
      });
    }
  }

  trackEvent(category, action) {
    if (Config.dev) return;

    if (cc.sys.isNative) {
      sdkbox.PluginGoogleAnalytics.logEvent(category, action, '', 1);
    } else if ((<any>window).gtag) {
      (<any>window).gtag('event', action, {
        'event_category': category
      });
    }
  }

  static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService();
    }

    return TrackingService.instance;
  }
}