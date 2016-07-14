'use strict';

class Editor {
  constructor(level) {
    this.level = level;
    this.makeFieldCellsClickable();

    let tp = $('tools-panel');
    while (tp.firstChild) {
      tp.removeChild(tp.firstChild);
    }

    this.pushBackgrounds();
    this.createTableFromArray(this.arrayBackgrounds, 'table-backgrounds', 'background');

    this.pushStaticItems();
    this.createTableFromArray(this.arrayStaticItems, 'table-staticItems', 'staticItem');

    this.pushPigs();
    this.createTableFromArray(this.arrayPigs, 'table-pigs', 'pig');

    this.pushWolves();
    this.createTableFromArray(this.arrayWolves, 'table-wolves', 'wolf');

    this.currentItemType = 'background';
    this.currentItemName = 'grass';
    
    this.latestButton = null;
    this.latestButtonPosition = null;
    this.latestWolf = null;
    
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
    this.arrayStaticItems.push('wall');
    this.arrayStaticItems.push('food');
    this.arrayStaticItems.push('door');
    this.arrayStaticItems.push('button');
    this.arrayStaticItems.push('snowflake');
    this.arrayStaticItems.push('fire');
    this.arrayStaticItems.push('blackButton');
    this.arrayStaticItems.push('lamp');
    this.arrayStaticItems.push('clear');
  }
  
  pushPigs() {
    this.arrayPigs = ['pig'];
  }

  pushWolves() {
    this.arrayWolves = ['wolf', 'clear'];
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

  applyBackground(point) {
    let curCell = this.level.field.pointToCell(point);
    let curName = this.currentItemName;
    curCell.addToLayer('background', curName);
    redrawCell(curCell);
  }

  applyStaticItem(point) {
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

  applyPig(point) {
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

  addSelectedItem(point) {
    if (this.latestWolf !== null && this.currentItemType != 'wolf') {
      this.latestWolf = null;
      this.latestTrajectory = [];
      this.level.wolves.pop();
      this.completeFieldRedraw();
    }

    switch (this.currentItemType) {
      case 'background': this.applyBackground(point); break;
      case 'staticItem': this.applyStaticItem(point); break;
      case 'pig': this.applyPig(point); break;
      case 'wolf': this.applyWolf(point); break;
    }
  }

  finishWolf() {
    this.latestWolf.trajectory = new Trajectory(this.latestWolf._position,
      this.latestWolf.trajectory._trajectory);

    this.completeFieldRedraw();
    alert('WOLF SUCCESSFULLY CREATED');  

    this.latestWolf = null;
    this.latestWolfTrajectory = []; 
  }

  applyWolf(point) {
    let curCell = this.level.field.pointToCell(point);
    
    if (this.currentItemName == 'clear') {
      this.latestWolf = null;

      let t = [];

      for (let i = 0; i < this.level.wolves.length; ++i) {
        let curWolf = this.level.wolves[i];
        if (JSON.stringify(curWolf.position()) != JSON.stringify(point)) {
          t.push(curWolf);
        }
      }

      this.level.wolves = t;
      this.completeFieldRedraw();
      return;
    }

    // we're editing his trajectory
    if (this.latestWolf !== null) {
      this.latestWolf.trajectory._trajectory.push(point);
      this.completeFieldRedraw();
    }
    else {
      let wolf = new Wolf(point, []);
      curCell.addToLayer('unit', wolf);
      this.level.wolves.push(wolf);
      
      this.latestWolf = wolf;
    }

    redrawCell(curCell);
  }

  completeFieldRedraw() {
    for (let i = 0; i < this.level.field.height; ++i)
      for (let j = 0; j < this.level.field.width; ++j) {
        let curCell = this.level.field.cells[i][j];
        curCell.layerTrajectory = [];
        curCell.layerUnit = null;
      }
    
    for (let i = 0; i < this.level.wolves.length; ++i) {
      let curWolf = this.level.wolves[i];
      curWolf.trajectory.addLayerToField(this.level.field);
    }
    
    initialDraw();
  }
}
