import {Config} from '../game/Config';

export class TrackingService {
  private static instance: TrackingService;

  init() {
    if (Config.dev) return;

  }

  trackPage(name) {
    if (Config.dev) return;

  }

  trackEvent(category, action) {
    if (Config.dev) return;

  }

  static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService();
    }

    return TrackingService.instance;
  }
}