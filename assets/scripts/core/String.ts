let emoticon = ':d :\') :-* /-heart /-strong :3 --b :b ;d :~ :> ;p :* ;o :(( :) :p :$ :-h :-(( x-) 8-) ;-d :q :( b-) ;? :| ;xx :--| ;g :o :z :l p-( :-bye :x |-) :wipe :! 8* :-dig :t &-( :-| :handclap >-| :-f :-l :-r /-showlove ;-x :-o ;-s ;8 ;! ;f :; :+ ;-a :-< :)) /-li /-beer';
let emoticonList = emoticon.split(' ');
let upperEmoticonList = emoticonList.map(item => item.toUpperCase());

export class CString {
  static format(str: string, ...args: any[]) {
    let content = str;
    for (let i = 0; i < args.length; i++) {
      let replacement = '{' + i + '}';
      content = content.replace(replacement, args[i]);
    }
    return content;
  }

  static formatMoney(num: number) {
    let numstr = num + '';
    let x = numstr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  static unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
      function (match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
      });
  }

  static parseMoney(numstr: string): number {
    return +numstr.replace(/\,/g, '');
  }

  static isNullOrEmpty(str): boolean {
    return (str == undefined || str == null || str == '');
  }

  // static limitChatWidth(text) {
  //   if (text.length < Config.maxChatLength / 2) {
  //     return text;
  //   }
  //
  //   text = text.substr(0, Math.min(Config.maxChatLength, text.length));
  //
  //   let middleIndex = Math.floor(Config.maxChatLength / 2);
  //   for (let i = middleIndex; i >= 0; i--) {
  //     let character = text[i];
  //     if (character == ' ') {
  //       text = text.substring(0, i) + '\n' + text.substr(i, text.length);
  //       break;
  //     }
  //   }
  //
  //   return text;
  // }

  static limitTextWith3Dots(text: string, maxLen: number): string {
    if (text && text.length > maxLen) {
      return text.substr(0, maxLen) + '...';
    }
    return text;
  }

  static parseEmoticon(text) {
    let emoList = [].concat(emoticonList);
    emoList.sort((a, b) => b.length - a.length);
    for (let i = 0; i < emoList.length; i++) {
      let emoticon = emoList[i];
      if (text.indexOf(emoticon) > -1) {
        let index = emoticonList.indexOf(emoticon);
        let emotext = `<img src='emoticon_${index + 1}' />`;
        text = text.split(emoticon).join(emotext);
      }

      let upperEmoticon = emoticon.toUpperCase();
      if (text.indexOf(upperEmoticon > -1)) {
        let upperIndex = upperEmoticonList.indexOf(upperEmoticon);
        let upperEmotext = `<img src='emoticon_${upperIndex + 1}' />`;
        text = text.split(upperEmoticon).join(upperEmotext);
      }
    }

    return text;
  }

  static getEmoticonList() {
    return emoticonList;
  }

  static imageURLToBase64(url): Promise<string> {
    return new Promise<string>((resolve) => {
      if (cc.sys.isNative) {
        // cc.loader.load(url, (err, texture) => {
        //   cc.log('loaded texture:', url, texture);
        //   let base64Str = (<any>cc).SimpleNativeClass.getBase64FromTexture2D(url);
        //   cc.log('ba')
        //   let imageData = 'data:image/png;base64,' + base64Str;
        //   resolve(imageData);
        // });
      } else {
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          let canvas: any = document.createElement('CANVAS');
          let ctx = canvas.getContext('2d');
          let dataURL;
          canvas.height = (<any>this).naturalHeight;
          canvas.width = (<any>this).naturalWidth;
          ctx.drawImage(this, 0, 0);
          dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        };
        img.src = url;
      }
    });
  }

  static round(number, decimals) {
    decimals = decimals || 0;
    return ( Math.floor(parseInt((number * Math.pow(10, decimals)).toFixed(decimals))) / Math.pow(10, decimals) );
  }

}