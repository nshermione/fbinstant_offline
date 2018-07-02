export const MaterialColor = [
  '#00b8d4',
  '#ffc58b',
  '#8cdbff',
  '#ff5395',
  '#00ffdc',
  '#b484f3',
  '#ff9578',
  '#bdea71',
  '#ffe78a',
  '#7fffdd',
  '#ffe85b',
  '#1dda59',
  '#ffed65',
  '#ff8d92',
  '#ac88ff',
  '#fffc5c',
  '#b3fefe',
  '#b2ff59',
  '#a0ffe2',
  '#ff7eb2',
  '#dd2c00',
  '#ff6d00',
  '#ffab00',
  '#ffd600',
  '#aeea00',
  '#64dd17',
  '#00c853',
  '#00bfa5',
  '#00b8d4',
  '#0091ea',
  '#2962ff',
  '#304ffe',
  '#6200ea',
  '#aa00ff',
  '#c51162',
  '#d50000',
  '#ffff00',
  '#b2ff59',
  '#64ffda',
  '#ff4081',
];

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export class Random {
  static integer(from: number, to: number) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }

  static smallerInteger(from: number, to: number) {
    let arr = [];
    for (let i = from; i <= to; i++) {
      arr.push(i);
      if (i !== to) {
        arr.push(i);
        arr.push(i);
      }
    }
    return Random.fromList(arr);
  }

  static bool() {
    return Math.random() >= 0.5;
  }

  static str(len: number = 10) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static keyFromDict(dict, regex: RegExp = /.*/g) {
    let listKeys = Object.keys(dict)
      .filter((key) => {
        return regex.test(key);
      });
    let randIndex = Random.integer(0, listKeys.length);
    return listKeys[randIndex];
  }

  static fromList(list) {
    let randIndex = Random.integer(0, list.length - 1);
    return list[randIndex];
  }

  static color() {
    let index = Random.integer(0, MaterialColor.length - 1);
    return hexToRgb(MaterialColor[index]);
  }

  static shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}