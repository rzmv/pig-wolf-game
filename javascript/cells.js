'use strict';

class Cell {
  constructor(tableCellAdress, background = 'grass', itemName = 'empty', itemDoor = {}) {
    switch(itemName) {
      case 'empty': this.staticItem = new ItemEmpty(); break;
      case 'wall': this.staticItem = new ItemWall(); break;
      case 'food': this.staticItem = new ItemFood(); break;
      case 'door': this.staticItem = new ItemDoor(); break;
      case 'button': this.staticItem = new ItemButton(itemDoor); break;
    }
    this.layers = [];
    this.layers[0] = this.getBackgroundAdress(background);
    this.layers[1] = [];
    this.layers[2] = this.staticItem.image;
    this.layers[3] = '';
    this.tableCell = tableCellAdress;
  }

  isFree() {
    return this.staticItem.passable;
  }

  visit(unit) {
    this.staticItem = this.staticItem[unit.influenceOnCell]();    
    this.layers[2] = this.staticItem.image;
    this.layers[3] = unit.image;
  }

  leave(unit) {
    this.staticItem = this.staticItem[unit.influenceOnCell]();    
    this.layers[2] = this.staticItem.image;  
    this.layers[3] = '';
  }

  getBackgroundAdress(background) {
    return '.\\images\\' + background + '.svg';
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
    this.table = document.createElement("table");
    this.table.className = "table";
    
    for (let i = 0; i < height; ++i) {
      let tableRow = document.createElement("tr");
      let row = [];
      for (let j = 0; j < width; ++j) {
        let tableCell = document.createElement("td");
        tableCell.className = "table-cell";
        tableRow.appendChild(tableCell);
        row.push(new Cell(tableCell));  
      }
      this.table.appendChild(tableRow);
      this.cells.push(row);
    }
  }

  changeCell(point, background = 'grass', itemName = 'empty', itemDoor = {}) {
    let cell = this.pointToCell(point);
    this.cells[point.row][point.col] = new Cell(cell.tableCell, background, itemName, itemDoor);
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
