'use strict';
/*
const utils = require('./utils');
const Point = utils.Point;
*/

class Unit {
  constructor(position, name, image) {
    this._position = position;
    this.name = name;
    this.normalImg = image;

    // cause we need function in Wolf's position
    // so let's make it general
    this.position = () => this._position;
    this._currentImg = this.normalImg;
    this.image = () => this._currentImg;
  }

  tryMove(direction) {
    let next = direction.nextPoint(this.position());
    if (currentLevel.field.freeCell(next)) {
      movePlayer(direction);
      winLoseCheck();
    }    
  }

  move(direction) {
    let next = direction.nextPoint(this.position());
    this._position = next;
  }
}

class Pig extends Unit {
  constructor(position) {
    super(position, 'pig', 'images/pig.svg');
    this.influenceOnCell = 'nextState';
    
    // we can see all cells on the field
    this.visibilityRange = 0;
  }
}

class Trajectory {
  constructor(position, trajectory) {
    this._trajectory = trajectory || [];
    this._currentDirection = (this._trajectory.length > 1 ? 1 : 0);
    this._currentStep = this._getTrajectoryStep(position);    
    
    // need to rememeber for wolf.freeze
    this._latestDirection = this._currentDirection;
  }
  _getTrajectoryStep(position) {
    for (let i = 0; i < this._trajectory.length; ++i)
      if (JSON.stringify(this._trajectory[i]) == JSON.stringify(position))
        return i;
    
    // we're not staying on the trajectory
    // then we'll stay at the same place
    this._trajectory = [position];
    this._currentDirection = 0;
    return 0;
  }
  
  currentPosition() {
    return this._trajectory[this._currentStep];
  }

  move() {
    let curStep = this._currentStep;
    let curDir = this._currentDirection;
    
    if ((curStep + curDir == this._trajectory.length) ||
       (curStep + curDir < 0))
    {
      this._currentDirection = -this._currentDirection;  
    }
    this._currentStep += this._currentDirection;
  }

  shiftToDirName(shift) {
    switch (shift.row + ' ' + shift.col) {
      case '-1 0': return 'up'; break;
      case '1 0': return 'down'; break;
      case '0 -1': return 'left'; break;
      case '0 1': return 'right'; break;
    }
  }

  addLayerToField(field) {
    for (let i = 1; i < this._trajectory.length; ++i) {
      let prev = this._trajectory[i - 1];
      let cur = this._trajectory[i];
      let prevLine = this.shiftToDirName(Point(cur.row - prev.row, cur.col - prev.col));
      let curLine = this.shiftToDirName(Point(prev.row - cur.row, prev.col - cur.col));
            
      field.pointToCell(prev).addToLayer('trajectory', prevLine);
      field.pointToCell(cur).addToLayer('trajectory', curLine);  
    } 
  }

  freeze() {
    if (this._currentDirection != 0) {
      this._latestDirection = this._currentDirection;
      this._currentDirection = 0;
    }
  }

  defrost() {
    if (this._currentDirection == 0)
      this._currentDirection = this._latestDirection;
  }
}

class Wolf extends Unit {
  constructor(position, trajectory) {
    super(position, 'wolf', 'images/wolf.svg');
    this.frozenImg = 'images/blue_wolf.svg';
    this.trajectory = new Trajectory(position, trajectory);
    this.position = () => this.trajectory.currentPosition();
    this.influenceOnCell = 'toogleVisibility';
  }

  move() {
    this.trajectory.move();
  }

  addTrajectoryLayerToField(field) {
    this.trajectory.addLayerToField(field);
  }

  freeze() {
    this.trajectory.freeze();
    this._currentImg = this.frozenImg;    
  }

  defrost() {
    this.trajectory.defrost();
    this._currentImg = this.normalImg;
  }
}

// DEBUG
/*
let defaultPig = new Pig(Point(0, 0));
console.log(defaultPig);

console.log(new Pig(Point(2, 5), 50));

let w = new Wolf(Point(100, 100), 2, [Point(100, 100), Point(100, 101)]);
for (let i = 0; i < 5; ++i) {
  console.log(w.position());
  w.move();
}
*/
