'use strict';

class Editor {
  constructor(level) {
    this.level = level;
    this.makeFieldCellsClickable();

    this.pushBackgrounds();
    this.createTableFromArray(this.arrayBackgrounds, 'table-backgrounds', 'background');

    this.pushStaticItems();
    this.createTableFromArray(this.arrayStaticItems, 'table-staticItems', 'staticItem');

    this.pushPigs();
    this.createTableFromArray(this.arrayPigs, 'table-pigs', 'pig');

    this.currentItemType = 'background';
    this.currentItemName = 'grass';
    this.latestButton = null;
    this.latestButtonPosition = null;
    this.updateCurrentTool();
  }

  makeFieldCellsClickable() {
    for (let i = 0; i < this.level.field.height; ++i)
      for (let j = 0; j < this.level.field.width; ++j)
        this.level.field.cells[i][j].tableCell.onclick = () => this.addSelectedItem(Point(i, j));
  }

  pushBackgrounds() {
    this.arrayBackgrounds = [];
    this.arrayBackgrounds.push('grass');
    this.arrayBackgrounds.push('ground');
    this.arrayBackgrounds.push('wood');
  }

  pushStaticItems() {
    this.arrayStaticItems = [];
    this.arrayStaticItems.push('clear');
    this.arrayStaticItems.push('wall');
    this.arrayStaticItems.push('food');
    this.arrayStaticItems.push('door');
    this.arrayStaticItems.push('button');
    this.arrayStaticItems.push('snowflake');
    this.arrayStaticItems.push('fire');
    this.arrayStaticItems.push('blackButton');
    this.arrayStaticItems.push('lamp');
  }
  
  pushPigs() {
    this.arrayPigs = ['pig'];
  }

  updateCurrentTool() {
    $('currentTool').innerHTML = this.currentItemType + ' - ' + this.currentItemName;  
  }

  createTableFromArray(arr, tableId, itemType) {
    let table = document.createElement('table');
    table.id = tableId;
    table.border = '1px';
    
    let curRow = document.createElement('tr');
    for (let i = 0; i < arr.length; ++i) {
      let curCol = document.createElement('td');
      curCol.innerHTML = arr[i];
      
      let self = this;
      curCol.onclick = function () {
        self.currentItemType = itemType;
        self.currentItemName = arr[i];
        self.updateCurrentTool();
      };
      curRow.appendChild(curCol);  
    }
    table.appendChild(curRow);

    $('tools-panel').appendChild(table);
  }

  addSelectedItem(point) {
    if (this.currentItemType == 'background') {
      let curCell = this.level.field.pointToCell(point);
      let curName = this.currentItemName;
      curCell.addToLayer('background', curName);
      redrawCell(curCell);
    }

    if (this.currentItemType == 'staticItem') {
      let curCell = this.level.field.pointToCell(point);
      let curName = this.currentItemName;
      
      if (curName == 'clear') {
        curCell.staticItems = [];
      }
      else {
        let curItem = curCell.createStaticItemByName(curName, null);
        curCell.staticItems.push(curItem);        
        
        if (curName == 'button') {
          this.latestButton = curCell;
          this.latestButtonPosition = point;
        }

          // !!! may be errors, be careful
          // when we delete this not-assigned button,
          // we stil have it in this.latestButton
        if (curName == 'door' && this.latestButton !== null) {
          this.latestButton.doorPosition = point;
          
          let b = this.latestButtonPosition;
          let d = point;
          alert('BUTTON (' + b.row + ', ' + b.col + ') BINDED WITH ' +
            'DOOR (' + d.row + ', ' + d.col + ')');
          
          this.latestButton = null;
          this.latestButtonPosition = null;
        }
      }
      redrawCell(curCell);
    }

    if (this.currentItemType == 'pig') {
      let oldPoint = this.level.pig.position();
      let newPoint = point;
      let oldCell = this.level.field.pointToCell(oldPoint)
      let newCell = this.level.field.pointToCell(newPoint);

      this.level.pig._position = newPoint;

      oldCell.removeLayer('unit');
      newCell.addToLayer('unit', this.level.pig);
      redrawCell(oldCell);
      redrawCell(newCell);            
    }
  }
}
