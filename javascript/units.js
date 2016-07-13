'use strict';
/*
const utils = require('./utils');
const Point = utils.Point;
*/

class Unit {
  constructor(position, name, image) {
    this._position = position;
    this.name = name;
    this.image = image;

    // cause we need function in Wolf's position
    // so let's make it general
    this.position = () => this._position;
  }

  tryMove(direction) {
    let next = direction.nextPoint(this.position());
    if (globalField.freeCell(next)) {
      movePlayer(direction);
      winLoseCheck()
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
  }
}

class Trajectory {
  constructor(position, trajectory) {
    this._trajectory = trajectory || [];
    this._currentDirection = (this._trajectory.length > 1 ? 1 : 0);
    this._currentStep = this._getTrajectoryStep(position);    
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
}

class Wolf extends Unit {
  constructor(position, trajectory) {
    super(position, 'wolf', 'images/wolf.svg');
    this.trajectory = new Trajectory(position, trajectory);
    this.position = () => this.trajectory.currentPosition();
    this.influenceOnCell = 'toogleVisibility';
  }

  move() {
    this.trajectory.move();
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
