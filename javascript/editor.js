'use strict';

class Editor {
  constructor(level) {
    this.level = level;
    this.makeFieldCellsClickable();

    let tp = $('tools-panel');
    while (tp.firstChild) {
      tp.removeChild(tp.firstChild);
    }
    
    let curToolHeader = document.createElement('h2');
    curToolHeader.id = 'currentTool';
    tp.appendChild(curToolHeader);

    this.pushBackgrounds();
    this.createTableFromArray(this.arrayBackgrounds, 'table-backgrounds', 'background', getBackgroundAddress);

    this.pushStaticItems();
    this.createTableFromArray(this.arrayStaticItems, 'table-staticItems', 'staticItem', null, 'image');

    this.pushUnits();
    this.createTableFromArray(this.arrayUnits, 'table-units', 'unit', null, '_currentImg');

    this.currentItemType = 'background';
    this.currentItemName = 'grass';
    this.updateCurrentTool();

    this.latestButton = null;
    this.latestButtonPosition = null;
    
    this.latestWolf = null;
    this.latestWolfTrajectory = []; 
  }

  makeFieldCellsClickable() {
    for (let i = 0; i < this.level.field.height; ++i)
      for (let j = 0; j < this.level.field.width; ++j)
        this.level.field.cells[i][j].tableCell.onclick = () => this.addSelectedItem(Point(i, j));
  }

  _pairTextObj(text, obj) {
    return {'text': text, 'obj': obj};
  }

  pushBackgrounds() {
    this.arrayBackgrounds = [];
    for (let i = 0; i < BACKGROUNDS.length; ++i)
      this.arrayBackgrounds.push(this._pairTextObj(BACKGROUNDS[i], null));
  }

  pushStaticItems() {
    this.arrayStaticItems = [];
    this.arrayStaticItems.push(this._pairTextObj('wall', new ItemWall()));
    this.arrayStaticItems.push(this._pairTextObj('food', new ItemFood()));
    this.arrayStaticItems.push(this._pairTextObj('door', new ItemDoor()));
    this.arrayStaticItems.push(this._pairTextObj('button', new ItemButton()));
    this.arrayStaticItems.push(this._pairTextObj('snowflake', new ItemSnowflake()));
    this.arrayStaticItems.push(this._pairTextObj('fire', new ItemFire()));
    this.arrayStaticItems.push(this._pairTextObj('blackButton', new ItemBlackButton()));
    this.arrayStaticItems.push(this._pairTextObj('lamp', new ItemLamp()));
    this.arrayStaticItems.push(this._pairTextObj('clear', {'image':'images/cross_delete.svg'}));
  }
  
  pushUnits() {
    this.arrayUnits = [];
    this.arrayUnits.push(this._pairTextObj('pig', new Pig(Point(0,0))));
    this.arrayUnits.push(this._pairTextObj('wolf', new Wolf(Point(0,0))));
    this.arrayUnits.push(this._pairTextObj('clear', {'_currentImg':'images/cross_delete.svg'}));
  }

  updateCurrentTool() {
    $('currentTool').innerHTML = this.currentItemType + ' - ' + this.currentItemName;  
  }

  createTableFromArray(arr, tableId, itemType, textToImgFunc = null, imageProp = null) {
    let table = document.createElement('table');
    table.id = tableId;
    table.border = '1px';
    
    let curRow = document.createElement('tr');
    for (let i = 0; i < arr.length; ++i) {
      let curCol = document.createElement('td');
      curCol.title = arr[i].text;

      let image;
      // for background it's a function, for others it's image or image()
      if (textToImgFunc !== null)
        image = textToImgFunc(arr[i].text);
      else
        image = arr[i].obj[imageProp];

      curCol.innerHTML = getHTMLImgByImage(image, '', 40);

      let self = this;
      curCol.onclick = function () {
        self.currentItemType = itemType;
        self.currentItemName = arr[i].text;
        self.updateCurrentTool();
      };
      curRow.appendChild(curCol);  
    }
    table.appendChild(curRow);
    table.float = 'left';

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

      // when we delete latest not-assigned button,
      // we need to set null this.latestButton
      if (equalPoints(point, this.latestButtonPosition)) {
        this.latestButton = null;
        this.latestButtonPosition = null;
      }

      curCell.staticItems = [];
    }
    else {
      let curItem = curCell.createStaticItemByName(curName, null);
      curCell.staticItems.push(curItem);        
      
      if (curName == 'button') {
        this.latestButton = curItem;
        this.latestButtonPosition = point;
      }

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

    oldCell.removeLayer('unit', this.level.pig);
    newCell.addToLayer('unit', this.level.pig);
    redrawCell(oldCell);
    redrawCell(newCell);            
  }

  addSelectedItem(point) {
    if (this.latestWolf !== null && this.currentItemName != 'wolf') {
      this.finishWolf();
    }

    switch (this.currentItemType) {
      case 'background': this.applyBackground(point); break;
      case 'staticItem': this.applyStaticItem(point); break;
      case 'unit':
        if (this.currentItemName == 'pig')
          this.applyPig(point);
        else
          this.applyWolf(point);
        break;
    }

    // save state, we need it after we played on this level in editor
    initialLevelState = currentLevel.saveToJSON();
  }

  finishWolf() {
    if (this.latestWolf === null)
      return;

    let finalWolf = new Wolf(this.latestWolf.position(), this.latestWolfTrajectory);
    this.level.wolves.push(finalWolf);

    this.latestWolf = null;
    this.latestWolfTrajectory = [];

    this.completeFieldRedraw();
    alert('WOLF SUCCESSFULLY CREATED');  
    
    // save state, we need it after we played on this level in editor
    initialLevelState = currentLevel.saveToJSON();
  }

  applyWolf(point) {
    let curCell = this.level.field.pointToCell(point);
    
    if (this.currentItemName == 'clear') {
      this.latestWolf = null;
      this.latestWolfTrajectory = [];

      // remove latest added to this cell wolf
      for (let i = this.level.wolves.length - 1; i >= 0; --i) {
        let curWolf = this.level.wolves[i];
        if (equalPoints(curWolf.position(), point)) {
          this.level.wolves.splice(i, 1);
          break;
        }
      }

      this.completeFieldRedraw();
      return;
    }

    // we're editing his trajectory
    if (this.latestWolf !== null) {
      this.latestWolfTrajectory.push(point);
    }
    else {
      this.latestWolf = new Wolf(point, []);
      this.latestWolfTrajectory = [];
    }

    this.completeFieldRedraw();
  }

  completeFieldRedraw() {
    for (let i = 0; i < this.level.field.height; ++i)
      for (let j = 0; j < this.level.field.width; ++j) {
        let curCell = this.level.field.cells[i][j];
        curCell.layerTrajectory = [];
        curCell.layerUnit = [];
      }
    
    for (let i = 0; i < this.level.wolves.length; ++i) {
      let curWolf = this.level.wolves[i];
      curWolf.trajectory.addLayerToField(this.level.field);
    }
    
    // latestWolf isn't in array level.wolves, we need to draw it and his trajectory by ourselves
    if (this.latestWolf !== null) {
      this.level.field.pointToCell(this.latestWolf.position()).addToLayer('unit', this.latestWolf);
      this.latestWolf.trajectory.addLayerToField(this.level.field, this.latestWolfTrajectory);
    }
    
    // pig won't turn lights off, if he stay on blackButton
    initialDraw(false);
  }
}
