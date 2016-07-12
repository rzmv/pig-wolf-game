'use strict';

class Cell {
  constructor() {
    this.state = 'empty';  
  }

  isFree() {
    return this.state == 'empty';
  }
}

class Field {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this._createCells(height, width);
  }
  
  _createCells(height, width) {
    this.cells = [];
    for (let i = 0; i < height; ++i) {
      let row = [];
      for (let j = 0; j < width; ++j) {
        row.push(new Cell());  
      }
      this.cells.push(row);
    }
  }

  inBounds(point) {
    return point.row >= 0 && point.col >= 0
      && point.row < this.height && point.col < this.width;
  }

  pointToCell(point)
  {
    return this.cells[point.row][point.col];
  }

  freeCell(point) {
    if (this.inBounds(point))
      return this.pointToCell(point).isFree();
    return false;  
  }
}
