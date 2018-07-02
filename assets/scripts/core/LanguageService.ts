import {Config} from './../Config';
import {ResourceManager} from './../core/ResourceManager';
import {GAME_EVENT} from '../core/Constants';


export class LanguageService {

  dictionary = {};

  lang = '';

  constructor() {
    let lang = cc.sys.localStorage.getItem('lang');
    this.setLang(lang || Config.defaultLanguage || cc.sys.language);
  }

  supportUnicodeCharacter() {
    if ((<any>cc).TextUtils) {
      (<any>cc).TextUtils.label_wordRex = /([a-zA-Z0-9@ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁёÀÁÂẤÃÈÉÊÌÍÎÐÒÓÔÕ×ÙÚÛÝàáâấãèéêìíîòóôùúûảẢậẬịỊựỰẹẸệỆọỌểỂẩẨộỘưƯđĐổỔặẶăĂửỬạẠắẮằẰẳẲẵẴầẦẫẪẻẺẽẼếẾềỀễỄủỦũŨụỤứỨừỪữỮỏỎơƠớỚờỜởỞỡỠợỢỉỈĩĨồỒỗỖốỐộỘ]+|\S)/;
      (<any>cc).TextUtils.label_firsrEnglish = /^[a-zA-Z0-9@ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁёÀÁÂẤÃÈÉÊÌÍÎÐÒÓÔÕ×ÙÚÛÝàáâấãèéêìíîòóôùúûảẢậẬịỊựỰẹẸệỆọỌểỂẩẨộỘưƯđĐổỔặẶăĂửỬạẠắẮằẰẳẲẵẴầẦẫẪẻẺẽẼếẾềỀễỄủỦũŨụỤứỨừỪữỮỏỎơƠớỚờỜởỞỡỠợỢỉỈĩĨồỒỗỖốỐộỘ]/;
      (<any>cc).TextUtils.label_lastEnglish = /[a-zA-Z0-9@ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁёÀÁÂẤÃÈÉÊÌÍÎÐÒÓÔÕ×ÙÚÛÝàáâấãèéêìíîòóôùúûảẢậẬịỊựỰẹẸệỆọỌểỂẩẨộỘưƯđĐổỔặẶăĂửỬạẠắẮằẰẳẲẵẴầẦẫẪẻẺẽẼếẾềỀễỄủỦũŨụỤứỨừỪữỮỏỎơƠớỚờỜởỞỡỠợỢỉỈĩĨồỒỗỖốỐộỘ]+$/;
    }
  }

  refreshDictionary() {
    let resMgr = ResourceManager.getInstance();
    resMgr.readJsonFile('languages/' + this.getCurrentLanguage())
      .then((val) => {
        this.dictionary = val;
      });
  }

  getCurrentLanguage() {
    return this.lang;
  }

  setLang(langCode) {
    this.lang = langCode;
    cc.sys.localStorage.setItem('lang', this.lang);
    this.refreshDictionary();
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