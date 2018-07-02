import {Config} from '../Config';
import {ResourceService} from './ResourceService';
import {GAME_EVENT} from '../core/Constants';

declare var FBInstant: any;

export class LanguageService {

  dictionary = {};

  lang = '';

  supportLanguages = ['en', 'vi'];

  // supportLanguages = ['en', 'vi', 'es', 'pt', 'fr', 'ar', 'id', 'th', 'tr', 'de'];

  constructor() {

  }

  init() {
    let lang;
    if (Config.instant) {
      let locale = FBInstant.getLocale();
      lang = locale.substr(0, 2);
    } else {
      lang = cc.sys.localStorage.getItem('lang');
    }
    return this.setLang(lang || Config.defaultLanguage || cc.sys.language);
  }

  supportUnicodeCharacter() {
    if ((<any>cc).TextUtils) {
      (<any>cc).TextUtils.label_wordRex = /([a-zA-Z0-9@ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁёÀÁÂẤÃÈÉÊÌÍÎÐÒÓÔÕ×ÙÚÛÝàáâấãèéêìíîòóôùúûảẢậẬịỊựỰẹẸệỆọỌểỂẩẨộỘưƯđĐổỔặẶăĂửỬạẠắẮằẰẳẲẵẴầẦẫẪẻẺẽẼếẾềỀễỄủỦũŨụỤứỨừỪữỮỏỎơƠớỚờỜởỞỡỠợỢỉỈĩĨồỒỗỖốỐộỘ]+|\S)/;
      (<any>cc).TextUtils.label_firsrEnglish = /^[a-zA-Z0-9@ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁёÀÁÂẤÃÈÉÊÌÍÎÐÒÓÔÕ×ÙÚÛÝàáâấãèéêìíîòóôùúûảẢậẬịỊựỰẹẸệỆọỌểỂẩẨộỘưƯđĐổỔặẶăĂửỬạẠắẮằẰẳẲẵẴầẦẫẪẻẺẽẼếẾềỀễỄủỦũŨụỤứỨừỪữỮỏỎơƠớỚờỜởỞỡỠợỢỉỈĩĨồỒỗỖốỐộỘ]/;
      (<any>cc).TextUtils.label_lastEnglish = /[a-zA-Z0-9@ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁёÀÁÂẤÃÈÉÊÌÍÎÐÒÓÔÕ×ÙÚÛÝàáâấãèéêìíîòóôùúûảẢậẬịỊựỰẹẸệỆọỌểỂẩẨộỘưƯđĐổỔặẶăĂửỬạẠắẮằẰẳẲẵẴầẦẫẪẻẺẽẼếẾềỀễỄủỦũŨụỤứỨừỪữỮỏỎơƠớỚờỜởỞỡỠợỢỉỈĩĨồỒỗỖốỐộỘ]+$/;
    }
  }

  refreshDictionary() {
    let resMgr = ResourceService.getInstance();
    return resMgr.readJsonFile('languages/' + this.getCurrentLanguage() + '.json')
      .then((val) => {
        this.dictionary = val;
      });
  }

  getCurrentLanguage() {
    return this.lang;
  }

  setLang(langCode) {
    if (this.supportLanguages.indexOf(langCode) < 0) {
      langCode = 'en';
    }
    this.lang = langCode;
    cc.sys.localStorage.setItem('lang', this.lang);
    return this.refreshDictionary();
  }

  get(key: string): string {
    return this.dictionary[key];
  }

  private static instance: LanguageService;

  static getInstance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService();
      LanguageService.instance.supportUnicodeCharacter();
    }

    return LanguageService.instance;
  }
}