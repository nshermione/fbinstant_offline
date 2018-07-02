export class CArray {
  static removeElement(arr, ele) {
    let index = arr.indexOf(ele);
    if (index >= 0) {
      arr.splice(index, 1);
    }
  }

  static pushElement(arr, ele) {
    let index = arr.indexOf(ele);
    if (index < 0) {
      arr.push(ele);
    }
  }

  /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   */
  static shuffle(a: Array<any>) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
  }
}