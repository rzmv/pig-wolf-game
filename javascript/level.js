'use strict';

class Level {
  constructor(field, pig, wolves = []) {
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
    // !!! add this.maxPoints = all carrots on the field
    for (let i = 0; i < this.wolves.length; ++i)
      this.wolves[i].addTrajectoryLayerToField(this.field);
  }
  
  loadFromJSON(JSONString) {
    let lev = JSON.parse(JSONString);
    
    this.lights = lev.lights;
    this.pig = new Pig(lev.pig._position);
    
    this.wolves = [];
    for (let i = 0; i < lev.wolves.length; ++i) {
      let curTraj = lev.wolves[i].trajectory;
      let curStep = curTraj._currentStep;
      this.wolves.push(new Wolf(curTraj._trajectory[curStep], curTraj._trajectory));
    }

    // read field
    this.field = new Field(lev.field.height, lev.field.width);
    for (let i = 0; i < lev.field.height; ++i)
      for (let j = 0; j < lev.field.width; ++j) {
        let curCell = lev.field.cells[i][j];
        let curBackground = curCell.layerBackground;

        let curStaticItems = [];
        for (let z = 0; z < curCell.staticItems.length; ++z) {
          let curItem = curCell.staticItems[z];
          curStaticItems.push({'itemName':curItem.name, 'doorPosition':curItem.doorPosition});
        }

        this.field.changeCell(Point(i, j), curBackground, curStaticItems);
      }
      
    this.init();
  }

  showJSON(fileName) {
    let lev = {
      'field': this.field,
      'pig': this.pig,
      'wolves': this.wolves,
      'lights': true,
    };

    let JSONString = JSON.stringify(lev);
    let textArea = document.createElement('textarea');
    textArea.id = 'JSONTextArea';
    textArea.appendChild(document.createTextNode(JSONString));
    textArea.setAttribute('rows', 100);
    textArea.setAttribute('cols', 100);

    document.body.appendChild(textArea);
    
    return JSONString;
    //output.write(JSON.stringify(level));
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
    this.pig.visibilityRange = visibilityRange;
    this.lights = false;  
    
    // !!! delete this cycle, there is function in module animate that does the same
    for (let i = 0; i < this.field.height; ++i)
      for (let j = 0; j < this.field.width; ++j)
        this.field.cells[i][j].addToLayer('darkness', 'darkness');
  }

  turnLightsOn() {
    if (this.lights)
      return;

    this.lights = true;

    for (let i = 0; i < this.field.height; ++i)
      for (let j = 0; j < this.field.width; ++j) {
        this.field.cells[i][j].removeLayer('darkness');
        redrawCell(this.field.cells[i][j]);
      }
  }
}
