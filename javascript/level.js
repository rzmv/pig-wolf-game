'use strict';

class Level {
  constructor(field, pig, wolves = []) {
    // void constructor
    if (!field)
      return;

    this.field = field;
    this.pig = pig;
    this.wolves = wolves;
    this.lights = true;
    this.init();
  }

  countFood() {
    let ans = 0;
    for (let i = 0; i < this.field.height; ++i)
      for (let j = 0; j < this.field.width; ++j)
        ans += this.field.cells[i][j].countFood();
    return ans; 
  }

  init() {
    this.points = 0;
    this.maxPoints = this.countFood();
    Carrots = this.countFood();
    // !!! add this.maxPoints = all carrots on the field
    for (let i = 0; i < this.wolves.length; ++i)
      this.wolves[i].addTrajectoryLayerToField(this.field);
  }
  
  
  loadFromJSON(JSONString) {
    let lev = JSON.parse(JSONString);
    this.lights = true;
    
    this.pig = new Pig(lev.pigPosition);
    
    this.wolves = [];       
    for (let i = 0; i < lev.wolvesTrajectories.length; ++i) {
      let curTraj = lev.wolvesTrajectories[i];

      let curStep = curTraj._currentStep;
      this.wolves.push(new Wolf(curTraj._trajectory[curStep], curTraj._trajectory));
    }

    // read field
    this.field = new Field(lev.field.height, lev.field.width);
    for (let i = 0; i < lev.field.height; ++i)
      for (let j = 0; j < lev.field.width; ++j) {
        let curCell = lev.field.cells[i][j];
        
        // B for background
        let curBackground = curCell.B;

        let curStaticItems = [];
        for (let z = 0; z < curCell.I.length; ++z) {
          // I for staticItems
          let curItem = curCell.I[z];

          curStaticItems.push({'itemName':curItem.N, 'doorPosition':curItem.P});
        }

        this.field.changeCell(Point(i, j), curBackground, curStaticItems);
      }
          
    this.init();
  }

  saveToJSON() {
    let wolvesTrajectories = [];
    for (let i = 0; i < this.wolves.length; ++i) {
      wolvesTrajectories.push(this.wolves[i].trajectory);  
    }
    
    let fieldToSave = {};
    fieldToSave.height = this.field.height;
    fieldToSave.width = this.field.width;
    fieldToSave.cells = [];

    for (let i = 0; i < fieldToSave.height; ++i) {
      let curRow = [];
      for (let j = 0; j < fieldToSave.width; ++j) {
        let curCol = {};
        curCol.B = this.field.cells[i][j].layerBackground;
        
        // I for staticItems
        curCol.I = [];

        for (let z = 0; z < this.field.cells[i][j].staticItems.length; ++z) {
          let curItem = this.field.cells[i][j].staticItems[z];
          curCol.I.push({'N':curItem.name, 'P':curItem.doorPosition});
        }

        curRow.push(curCol);
      }
      fieldToSave.cells.push(curRow);
    }

    let lev = {
      'field': fieldToSave,
      'pigPosition': this.pig.position(),
      'wolvesTrajectories': wolvesTrajectories,
    };
    
    let JSONString = JSON.stringify(lev);
    return JSONString;
  }

  freezeWolves() {
    for (let i = 0; i < this.wolves.length; ++i)
      this.wolves[i].freeze();
  }

  defrostWolves() {
    for (let i = 0; i < this.wolves.length; ++i)
      this.wolves[i].defrost();
  }

  turnLightsOff(visibilityRange) {
    if (!this.lights)
      return;
    
    this.pig.visibilityRange = visibilityRange;
    this.lights = false;  
    animateTurningLightsOff(this.pig.position(), this.pig.visibilityRange);
    
    // turn off instantly
    /*
    for (let i = 0; i < this.field.height; ++i)
      for (let j = 0; j < this.field.width; ++j) {
        this.field.cells[i][j].addToLayer('darkness', 'darkness');
        redrawCell(this.field.cells[i][j]);
      }
    */
  }

  turnLightsOn() {
    if (this.lights)
      return;

    this.pig.visibility = 0;
    this.lights = true;
    animateTurningLightsOn(this.pig.position(), this.pig.visibilityRange);
    
    // turn on instantly
    /*
    for (let i = 0; i < this.field.height; ++i)
      for (let j = 0; j < this.field.width; ++j) {
        this.field.cells[i][j].removeLayer('darkness');
        redrawCell(this.field.cells[i][j]);
      }
    */
  }
}
