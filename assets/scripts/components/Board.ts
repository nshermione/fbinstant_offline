import {Cell} from './Cell';
import {Random} from '../core/Random';
import {GameService} from '../services/GameService';
import {CArray} from '../core/Array';
const {ccclass, property} = cc._decorator;

@ccclass
export class Board extends cc.Component {
  rows = 4;
  cols = 4;

  cellSize = 120;
  cellSpan = 15;

  min = 1;
  max = 2;

  cells: Array<Array<Cell>> = [];
  emptyCells: Array<Cell> = [];

  @property(cc.Node)
  cellNode: cc.Node = null;

  @property(cc.Prefab)
  cellPrefab: cc.Prefab = null;

  onLoad() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.cells[i]) {
          this.cells[i] = [];
        }
        let cell = cc.instantiate(this.cellPrefab);
        cell.x = j * (this.cellSize + this.cellSpan) - 560 / 2 + (this.cellSize / 2) + this.cellSpan;
        cell.y -= i * (this.cellSize + this.cellSpan) - 560 / 2 + (this.cellSize / 2) + this.cellSpan;
        this.cells[i][j] = cell.getComponent(Cell);
        this.cells[i][j].setCoord(i, j);
        this.cellNode.addChild(cell);

        // this.cells[i][j].setValue(j);
        this.emptyCells.push(this.cells[i][j]);
      }
    }
  }

  swapCells(selectedCell: Cell, cell: Cell, callback?) {
    let firstPos = selectedCell.node.position;
    let secondPos = cell.node.position;
    this.promoteToTop([selectedCell, cell]);

    selectedCell.node.runAction(cc.moveTo(0.5, secondPos).easing(cc.easeBackInOut()));
    cell.node.runAction(cc.moveTo(0.5, firstPos).easing(cc.easeBackInOut()));

    let i0, i1, j0, j1;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.cells[i][j] == selectedCell) {
          i0 = i;
          j0 = j;
        } else if (this.cells[i][j] == cell) {
          i1 = i;
          j1 = j;
        }
      }
    }

    this.cells[i0][j0] = cell;
    this.cells[i0][j0].setCoord(i0, j0);
    this.cells[i1][j1] = selectedCell;
    this.cells[i1][j1].setCoord(i1, j1);

    this.node.runAction(
      cc.sequence(
        cc.delayTime(0.6),
        cc.callFunc(() => {
          if (callback) {
            callback();
          }
        })
      )
    )
  }

  startNewGame() {
    let startList;
    let isDoubleOne = Random.bool();
    if (isDoubleOne) {
      startList = [1, 1, 2];
    } else {
      startList = [1, 2, 2];
    }

    startList = Random.shuffle(startList);

    let isRow = Random.bool();
    if (isRow) {
      let i = Random.integer(0, 3);
      let j = Random.integer(0, 1);
      for (let k = 0; k < 3; k++) {
        this.cells[i][j + k].setValue(startList[k]);
        this.cells[i][j + k].showAnim();
        CArray.removeElement(this.emptyCells, this.cells[i][j + k]);
      }
    } else {
      let i = Random.integer(0, 1);
      let j = Random.integer(0, 3);
      for (let k = 0; k < 3; k++) {
        this.cells[i + k][j].setValue(startList[k]);
        this.cells[i + k][j].showAnim();
        CArray.removeElement(this.emptyCells, this.cells[i + k][j]);
      }
    }

    if (isDoubleOne) {
      this.generateCellsByList([1]);
      this.generateCells(2);
    } else {
      this.generateCellsByList([1, 1, 2]);
    }

    GameService.getInstance().saveStep();
  }

  updateMin() {
    let estimatedMin = this.max >= 10 ? this.max - 4 : this.max - 3;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.cells[i][j].value > 0) {
          estimatedMin = Math.min(this.cells[i][j].value, estimatedMin);
        }
      }
    }
    this.min = Math.max(estimatedMin, 1);
  }

  generateCellsByList(list, showAnim = true) {
    this.emptyCells = Random.shuffle(this.emptyCells);
    for (let i = 0; i < list.length; i++) {
      let cell = this.emptyCells.shift();
      while (this.checkCellCanCombine(cell, list[i])) {
        this.emptyCells.unshift(cell);
        this.emptyCells = Random.shuffle(this.emptyCells);
        cell = this.emptyCells.shift();
      }
      cell.setValue(list[i]);
      if (showAnim) {
        cell.showAnim();
      }
    }
  }

  generateCells(num = 3, showAnim = true) {
    cc.log('Before generate: ' , this.getValues());

    this.emptyCells = Random.shuffle(this.emptyCells);
    if (this.emptyCells.length < num) {
      GameService.getInstance().onLoseGame();
      return;
    }

    let max = this.max > 2 ? this.max - 1 : this.max;

    let hasInRow3 = false;
    for (let i = 0; i < num; i++) {
      let cell = this.emptyCells.shift();
      if (!hasInRow3) {
        this.emptyCells.unshift(cell);
        cell = null;
        for (let emptyCell of this.emptyCells) {
          if (this.checkCellInRow3(emptyCell)) {
            hasInRow3 = true;
            CArray.removeElement(this.emptyCells, emptyCell);
            cell = emptyCell;
            break;
          }
        }

        if (!hasInRow3) {
          cell = this.emptyCells.shift();
        }
      }

      let index = 0;
      let randomValue = Random.smallerInteger(this.min, max);
      while (this.checkCellCanCombine(cell, randomValue) && index < 20) {
        randomValue = Random.smallerInteger(this.min, max);
        index++;
      }
      cell.setValue(randomValue);
      if (showAnim) {
        cell.showAnim();
      }
    }

    cc.log('After generate: ' , this.getValues());
  }

  checkCellInRow3(targetCell) {
    let ret = false;
    let rows = [];
    let cols = [];
    let rowIndices = [];
    let colIndices = [];
    for (let i = -3; i <= 3; i++) {
      let xRow = targetCell.coord.x;
      let yRow = targetCell.coord.y + i;
      if (i == 0 || (yRow >= 0 && yRow <= 3 && this.cells[xRow][yRow].value)) {
        rows.push(this.cells[xRow][yRow]);
        rowIndices.push(i);
      }

      let xCol = targetCell.coord.x + i;
      let yCol = targetCell.coord.y;
      if (i == 0 || (xCol >= 0 && xCol <= 3 && this.cells[xCol][yCol].value)) {
        cols.push(this.cells[xCol][yCol]);
        colIndices.push(i);
      }
    }

    if (rows.length >= 3) {
      let canCombine = true;
      for (let i = 0; i < rowIndices.length - 1; i++) {
        if (rowIndices[i] + 1 != rowIndices[i + 1]) {
          canCombine = false;
        }
      }
      if (canCombine) {
        ret = true;
      }
    } else if (cols.length >= 3) {
      let canCombine = true;
      for (let i = 0; i < colIndices.length - 1; i++) {
        if (colIndices[i] + 1 != colIndices[i + 1]) {
          canCombine = false;
        }
      }
      if (canCombine) {
        ret = true;
      }
    }
    return ret;
  }

  checkCellCanCombine(targetCell, targetValue) {
    let ret = false;
    let rows = [];
    let cols = [];
    let rowIndices = [];
    let colIndices = [];
    for (let i = -3; i <= 3; i++) {
      let xRow = targetCell.coord.x;
      let yRow = targetCell.coord.y + i;
      if (i == 0 || (yRow >= 0 && yRow <= 3 && this.cells[xRow][yRow].value == targetValue)) {
        rows.push(this.cells[xRow][yRow]);
        rowIndices.push(i);
      }

      let xCol = targetCell.coord.x + i;
      let yCol = targetCell.coord.y;
      if (i == 0 || (xCol >= 0 && xCol <= 3 && this.cells[xCol][yCol].value == targetValue)) {
        cols.push(this.cells[xCol][yCol]);
        colIndices.push(i);
      }
    }

    if (rows.length >= 3) {
      let canCombine = true;
      for (let i = 0; i < rowIndices.length - 1; i++) {
        if (rowIndices[i] + 1 != rowIndices[i + 1]) {
          canCombine = false;
        }
      }
      if (canCombine) {
        ret = true;
      }
    }

    if (cols.length >= 3) {
      let canCombine = true;
      for (let i = 0; i < colIndices.length - 1; i++) {
        if (colIndices[i] + 1 != colIndices[i + 1]) {
          canCombine = false;
        }
      }
      if (canCombine) {
        ret = true;
      }
    }
    return ret;
  }

  isInRow(cell: Cell, otherCell: Cell) {
    let isInRow = true;
    if (cell.coord.x == otherCell.coord.x) {
      let minY = Math.min(cell.coord.y, otherCell.coord.y);
      let maxY = Math.max(cell.coord.y, otherCell.coord.y);
      for (let i = minY; i < maxY; i++) {
        if (this.cells[cell.coord.x][i].value !== this.cells[cell.coord.x][i+1].value) {
          isInRow = false;
        }
      }
    } else if (cell.coord.y == otherCell.coord.y) {
      let minX = Math.min(cell.coord.x, otherCell.coord.x);
      let maxX = Math.max(cell.coord.x, otherCell.coord.x);
      for (let i = minX; i < maxX; i++) {
        if (this.cells[i][cell.coord.y].value !== this.cells[i+1][cell.coord.y].value) {
          isInRow = false;
        }
      }
    } else {
      isInRow = false;
    }

    return isInRow;
  }

  mergeCells(targetCell: Cell) {
    if (!targetCell) {
      return null;
    }
    let ret = false;
    let rows = [];
    let cols = [];
    let rowIndices = [];
    let colIndices = [];
    let direction = 0;
    for (let i = -3; i <= 3; i++) {
      let xRow = targetCell.coord.x;
      let yRow = targetCell.coord.y + i;
      if (yRow >= 0 && yRow <= 3 && this.cells[xRow][yRow].value == targetCell.value) {
        rows.push(this.cells[xRow][yRow]);
        rowIndices.push(i);
      }

      let xCol = targetCell.coord.x + i;
      let yCol = targetCell.coord.y;
      if (xCol >= 0 && xCol <= 3 && this.cells[xCol][yCol].value == targetCell.value) {
        cols.push(this.cells[xCol][yCol]);
        colIndices.push(i);
      }
    }

    let swallowFunc = (cells) => {
      let actions = [];
      for (let cell of cells) {
        let action = this.swallowCell(cell, targetCell);
        if (action) {
          actions.push(action);
        }
      }
      return actions;
    };

    let retActions = [];
    if (rows.length >= 3) {
      let canSwallow = true;
      for (let i = 0; i < rowIndices.length - 1; i++) {
        if (rowIndices[i] + 1 != rowIndices[i + 1]) {
          canSwallow = false;
        }
      }
      if (canSwallow) {
        ret = true;
        retActions = retActions.concat(swallowFunc(rows));
        direction++;
      }
    }
    if (cols.length >= 3) {
      let canSwallow = true;
      for (let i = 0; i < colIndices.length - 1; i++) {
        if (colIndices[i] + 1 != colIndices[i + 1]) {
          canSwallow = false;
        }
      }
      if (canSwallow) {
        ret = true;
        retActions = retActions.concat(swallowFunc(cols));
        direction++;
      }
    }

    if (direction == 2) {
      GameService.getInstance().pushScore(80);
    } else if (direction == 1) {
      GameService.getInstance().pushScore(20);
    }

    if (ret) {
      return cc.sequence(
        cc.spawn(retActions),
        cc.delayTime(0.1),
        cc.callFunc(() => {
          targetCell.increaseValue();
          this.max = Math.max(targetCell.value, this.max);
          this.updateMin();
        })
      );
    }
  }

  swallowCell(cell: Cell, targetCell: Cell) {
    if (cell.coord.x == targetCell.coord.x && cell.coord.y == targetCell.coord.y) return;
    this.emptyCells.push(cell);
    let startPos = cc.v2(cell.node.position.x, cell.node.position.y);
    return cc.sequence(
      cc.callFunc(() => {
        cell.node.runAction(
          cc.sequence(
            cc.moveTo(0.2, targetCell.node.position),
            cc.callFunc(() => {
              cell.hideCell();
              cell.node.position = startPos;
            })
          )
        )
      }),
      cc.delayTime(0.2)
    );
  }

  promoteToTop(cells) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let cell = this.cells[i][j];
        if (cells.indexOf(cell) >= 0) {
          cell.node.setLocalZOrder(2);
        } else {
          cell.node.setLocalZOrder(1);
        }
      }
    }
  }

  clear() {
    this.emptyCells = [];
    this.min = 1;
    this.max = 2;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let cell = this.cells[i][j];
        cell.hideCell();
        this.emptyCells.push(cell);
      }
    }
  }

  setValues(values: Array<number>) {
    let min = 1;
    let max = 2;
    this.emptyCells = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let cell = this.cells[i][j];
        let value = values[i * this.rows + j];
        if (value) {
          min = Math.min(value, min);
          max = Math.max(value, max);
          cell.setValue(values[i * this.rows + j]);
        } else {
          this.emptyCells.push(cell);
          cell.hideCell();
        }
      }
    }
    this.min = min;
    this.max = max;
  }

  getValues() {
    let values = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let cell = this.cells[i][j];
        values.push(cell.value);
      }
    }
    return values;
  }
}