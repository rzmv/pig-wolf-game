'use strict';

class Cell {
  constructor(tableCellAdress, background = 'grass', itemsArray = []) {
    this.tableCell = tableCellAdress;
    this.addToLayer('background', background);
    this.layerTrajectory = [];
    this.layerUnit = [];
    this.staticItems = [];
    this.layerDarkness = '';

    for (let i = 0; i < itemsArray.length; ++i) {
      let curName = itemsArray[i].itemName;
      let doorPos = itemsArray[i].doorPosition;
      this.staticItems.push(this.createStaticItemByName(curName, doorPos));  
    }
  }

  createStaticItemByName(itemName, doorPosition = null) {
    switch(itemName) {
      case 'empty': return new ItemEmpty();
      case 'wall': return new ItemWall();
      case 'food': return new ItemFood();
      case 'door': return new ItemDoor();
      case 'button': return new ItemButton(doorPosition);
      case 'snowflake': return new ItemSnowflake();
      case 'fire': return new ItemFire();
      case 'blackButton': return new ItemBlackButton();
      case 'lamp': return new ItemLamp();
    }  
  }

  countFood() {
    let ans = 0;
    for (let i = 0; i < this.staticItems.length; ++i)
      if (this.staticItems[i].name == 'food')
        ++ans;
    return ans;  
  }

  isFree() {
    for (let i = 0; i < this.staticItems.length; ++i)
      if (!this.staticItems[i].passable())
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
      case 'unit': this.layerUnit.push(objectName); break;
      case 'darkness': this.layerDarkness = objectName; break;
    } 
  }

  removeLayer(layerName, unit) {
    switch (layerName) {
      case 'background': this.layerBackground = ''; break;
      case 'trajectory': this.layerTrajectory = []; break;
      case 'darkness': this.layerDarkness = ''; break;
      case 'unit': {
        for (let i = 0; i < this.layerUnit.length; ++i)
          if (this.layerUnit[i].name == unit.name) {
            this.layerUnit.splice(i, 1);
            break;
          }
        break;
      }
    }
  }

  unitInfluence(unit) {
    for (let i = 0; i < this.staticItems.length; ++i)
      this.staticItems[i] = this.staticItems[i][unit.influenceOnCell]();
  }

  visit(unit) {
    this.unitInfluence(unit);
    this.addToLayer('unit', unit);
  }

  leave(unit) {
    this.removeLayer('unit', unit);
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
    
    for (let i = 0; i < this.staticItems.length; ++i) {
      ans += getHTMLImgByImage(this.staticItems[i].image, this.staticItems[i].className);
    }

    let unitImg = (this.layerUnit.length) ? this.layerUnit[0].image() : '';
    ans += getHTMLImgByImage(unitImg, 'layer-unit');
    
    // add arrows for wolves
    for (let i = 0; i < this.layerUnit.length; ++i)
      if (this.layerUnit[i].name == 'wolf') {
        let img = getArrowAddress(this.layerUnit[i].trajectory.directionToNextPoint());
        ans += getHTMLImgByImage(img, 'layer-arrow');
      }

    let darknessImg = getDarknessAddress(this.layerDarkness);
    ans += getHTMLImgByImage(darknessImg, 'layer-darkness');
    return ans;
  }

  getStaticItemByName(name) {
    for (let i = 0; i < this.staticItems.length; ++i)
      if (this.staticItems[i].name == name)
        return this.staticItems[i];
    
    return null;
  }
}

class Field {
  constructor(height, width, defaultBackground = 'grass') {
    this.height = height;
    this.width = width;
    this._createCells(height, width, defaultBackground);
  }
  
  _createCells(height, width, defaultBackground) {
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
        row.push(new Cell(tableCell, defaultBackground));  
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

  toogleDoorByButton(buttonPosition) {
    let cellButton = this.pointToCell(buttonPosition);
    let buttonItem = cellButton.getStaticItemByName('button');

    if (buttonItem !== null) {
      let cellDoor = this.pointToCell(buttonItem.doorPosition);
      let doorItem = cellDoor.getStaticItemByName('door');
      
      buttonItem.toogle(cellDoor, doorItem);
    
      redrawCell(cellButton);
      redrawCell(cellDoor);
    }
  }
}
