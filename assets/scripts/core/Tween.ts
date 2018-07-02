export class CTween {

  static intervalTargets = [];

  static stopAllTweens(target) {
    for (let tg of this.intervalTargets) {
      if (tg === target && tg.__moneyAnim) {
        clearInterval(tg.__moneyAnim);
      }
    }
  }

  static stopAll() {
    for (let tg of this.intervalTargets) {
      if (tg.__moneyAnim) {
        clearInterval(tg.__moneyAnim);
      }
    }
  }

  static increaseInteger(target: any,
                         startNumber: number,
                         amount: number,
                         onUpdate: Function,
                         onEnd?: Function,
                         animTime = 1) {

    let currentMoney = startNumber;
    if (target.__moneyAnim !== undefined && target.__currentMoney !== undefined) {
      clearInterval(target.__moneyAnim);
    }

    let endMoney = startNumber + amount;
    amount = endMoney - currentMoney;

    let stepPercent = 1 / 60; // 5%
    let stepTime = stepPercent * animTime;
    let amountPerStep = amount * stepPercent;
    if (amountPerStep > 0 && amountPerStep < 1) {
      amountPerStep = 1;
    } else if (amountPerStep > -1 && amountPerStep < 0) {
      amountPerStep = -1;
    } else {
      amountPerStep = Math.ceil(amountPerStep);
    }

    target.__currentMoney = currentMoney;
    onUpdate(currentMoney);
    target.__moneyAnim = setInterval(() => {
      currentMoney += amountPerStep;
      if ((currentMoney >= endMoney && amount >= 0) || (currentMoney <= endMoney && amount <= 0)) {
        target.__endMoney = undefined;
        target.__currentMoney = endMoney;
        onUpdate(endMoney);
        if (onEnd) {
          onEnd(endMoney);
        }
        clearInterval(target.__moneyAnim);
        CTween.intervalTargets.splice(CTween.intervalTargets.indexOf(target, 1));
        return;
      } else {
        target.__currentMoney = currentMoney;
        onUpdate(currentMoney);
      }
    }, stepTime * 1000);

    CTween.intervalTargets.push(target);
  }
}