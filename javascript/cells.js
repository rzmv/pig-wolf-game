'use strict';

class Cell {
  constructor(tableCellAdress, background = 'grass', itemsArray = []) {
    this.tableCell = tableCellAdress;
    this.addToLayer('background', background);
    this.layerTrajectory = [];
    this.layerUnit = null;
    this.staticItems = [];

    for (let i = 0; i < itemsArray.length; ++i) {
      switch(itemsArray[i].itemName) {
        case 'empty': this.staticItems.push(new ItemEmpty()); break;
        case 'wall': this.staticItems.push(new ItemWall()); break;
        case 'food': this.staticItems.push(new ItemFood()); break;
        case 'door': this.staticItems.push(new ItemDoor()); break;
        case 'button': this.staticItems.push(new ItemButton(itemsArray[i].doorPosition)); break;
      }
    }
  }

  isFree() {
    for (let i = 0; i < this.staticItems.length; ++i)
      if (!this.staticItems[i].passable)
        return false;
    return true;
  }

  addTrajectory(trajectory) {
    for (let i = 0; i < this.layerTrajectory.length; ++i)
      if (this.layerTrajectory[i] == trajectory)
        return;
    this.layerTrajectory.push(trajectory);
  }

  addToLayer(layerName, objectName) {
    switch (layerName) {
      case 'background': this.layerBackground = objectName; break;
      case 'trajectory': this.addTrajectory(objectName); break;
      case 'unit': this.layerUnit = objectName; break;
    } 
  }

  removeLayer(layerName) {
    switch (layerName) {
      case 'background': this.layerBackground = ''; break;
      case 'trajectory': this.layerTrajectory = []; break;
      case 'unit': this.layerUnit = null; break;
    }
  }

  unitInfluence(unit) {
    for (let i = 0; i < this.staticItems.length; ++i)
      this.staticItems[i] = this.staticItems[i][unit.influenceOnCell]();
  }

  visit(unit) {
    if (unit !== null) {
      this.unitInfluence(unit);
      this.addToLayer('unit', unit);
    }
  }

  leave(unit) {
    if (unit !== null) {
      this.unitInfluence(unit);
      this.removeLayer('unit');
    }
  }

  openDoor() {
    for (let i = 0; i < this.staticItems.length; ++i)
      if (this.staticItems[i].name == 'door')
        this.staticItems[i] = this.staticItems[i].nextState();
  }

  getLayersHTMLString() {
    let ans = '';
    let backgroundImg = getBackgroundAddress(this.layerBackground);
    ans += getHTMLImgByImage(backgroundImg, 'layer-background');
    
    for (let i = 0; i < this.layerTrajectory.length; ++i) {
      let img = getTrajectoryAddress(this.layerTrajectory[i]);
      ans += getHTMLImgByImage(img, 'layer-trajectory');
    }
    
    // !!! different staticItems has different z-indeces
    for (let i = 0; i < this.staticItems.length; ++i) {
      ans += getHTMLImgByImage(this.staticItems[i].image, 'layer-staticItem');
    }

    let unitImg = this.layerUnit !== null ? this.layerUnit.image : '';
    ans += getHTMLImgByImage(unitImg, 'layer-unit');
    return ans;
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
    this.table = document.createElement('table');
    this.table.className = 'table';
    
    for (let i = 0; i < height; ++i) {
      let tableRow = document.createElement('tr');
      let row = [];
      for (let j = 0; j < width; ++j) {
        let tableCell = document.createElement('td');
        tableCell.className = 'table-cell';
        tableRow.appendChild(tableCell);
        row.push(new Cell(tableCell));  
      }
      this.table.appendChild(tableRow);
      this.cells.push(row);
    }
  }
  
  changeCell(point, background = 'grass', itemsArray = []) {
    let cell = this.pointToCell(point);
    this.cells[point.row][point.col] = new Cell(cell.tableCell, background, itemsArray);
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
