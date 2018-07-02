const {ccclass, property} = cc._decorator;

export class TimerTask {
  action: Function;
  startTime: number;
}

export class ScheduleOnceTask extends TimerTask {
  constructor(public callback: Function,
              public timeout: number) {
    super();

    this.action = (elapsedTime: number) => {
      if ((elapsedTime / 1000) >= timeout) {
        if (callback) {
          callback();
        }
        TimerStatic.removeTask(this);
      }
    };
  }
}

export class ScheduleTask extends TimerTask {

  times = 1;

  constructor(public callback: Function,
              public timeout: number) {
    super();

    this.action = (elapsedTime: number) => {
      if ((elapsedTime / 1000) >= timeout * this.times) {
        if (callback) {
          callback();
        }
        this.times++;
      }
    };
  }
}

export class TweenTask extends TimerTask {
  totalTime = 0;
  totalValue = 0;

  constructor(public startNumber: number,
              public amount: number,
              public onUpdate: Function,
              public onEnd: Function,
              public animTime: number) {
    super();

  }
}

export class NumberIncreaseTask extends TimerTask {


  constructor(public startNumber: number,
              public amount: number,
              public onUpdate: Function,
              public onEnd: Function,
              public animTime: number) {
    super();


    this.action = (elapsedTime: number) => {
      let currentAmount = startNumber + elapsedTime/(animTime*1000) * amount;
      if ((currentAmount >= startNumber + amount && amount >= 0) || (currentAmount <= startNumber + amount && amount <= 0)) {
        onUpdate(startNumber + amount);
        if (onEnd) {
          onEnd(startNumber + amount);
        }
        TimerStatic.removeTask(this);
        return;
      }

      onUpdate(currentAmount);
    };
  }
}

@ccclass
export class TimerComponent extends cc.Component {

  tasks: Array<TimerTask> = [];
  persistasks: Array<TimerTask> = [];

  returnGameTasks: Array<Function> = [];

  addTask(task: TimerTask, persist = false) {
    task.startTime = Date.now();
    if (persist) {
      this.persistasks.push(task);
    } else {
      this.tasks.push(task);
    }
  }

  removeTask(task: TimerTask) {
    let index = this.tasks.indexOf(task);
    if (index >= 0) {
      this.tasks.splice(index, 1);
    }
  }

  removeTasks(tasks: Array<TimerTask>) {
    for (let task of tasks) {
      this.removeTask(task);
    }
  }

  registerReturnGame(callback) {
    this.returnGameTasks.push(callback);
  }

  unregisterReturnGames() {
    this.returnGameTasks = [];
  }

  removeAllTasks() {
    this.tasks = [];
  }

  onReturnGame() {
    for (let returnTask of this.returnGameTasks) {
      returnTask();
    }
  }

  update() {
    for (let task of this.tasks) {
      if (task && task.action) {
        let elapsedTime = Date.now() - task.startTime;
        task.action(elapsedTime);
      }
    }

    for (let task of this.persistasks) {
      if (task && task.action) {
        let elapsedTime = Date.now() - task.startTime;
        task.action(elapsedTime);
      }
    }
  }
}

export class TimerStatic {
  static timer: TimerComponent;

  static setTimer(timer) {
    TimerStatic.timer = timer;
  }

  static increaseMoney(startMoney, amount, onUpdate, onEnd?, animTime = 1): TimerTask {
    let task = new NumberIncreaseTask(startMoney, amount, onUpdate, onEnd, animTime);
    TimerStatic.timer.addTask(task);
    return task;
  }

  static scheduleOnce(callback, timeout): TimerTask {
    let task = new ScheduleOnceTask(callback, timeout);
    TimerStatic.timer.addTask(task);
    return task;
  }

  static removeTask(task: TimerTask) {
    TimerStatic.timer.removeTask(task);
  }

  static registerOnReturnGame(callback) {
    TimerStatic.timer.registerReturnGame(callback);
  }

  static unregisterOnReturnGames() {
    TimerStatic.timer.unregisterReturnGames();
  }

  static stopAllTasks() {
    TimerStatic.timer.removeAllTasks();
  }

  static onReturnGame() {
    TimerStatic.timer.onReturnGame();
  }

  static stopSecondClock(node) {
    if (node.clockAction) {
      node.stopAction(node.timerAction);
    }
  }

  static runSecondClock(node, onUpdate) {
    let totalTime = 0;
    node.clockAction = node.runAction(
      cc.sequence(
        cc.callFunc(() => {
          onUpdate(totalTime++);
        }),
        cc.delayTime(1)
      ).repeatForever()
    )
  }
}