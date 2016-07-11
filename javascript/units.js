'use strict';
const utils = require('./utils');
const Point = utils.Point;

const initialHealth = 3;
const initialMana = 10;
// FIXMYNAME: actually it is 1 / speed, i.e. time needed to go by 1 cell
const initialSpeed = 1000;

class Unit {
  constructor(position, speed) {
    this.position = position;
    this.speed = speed || initialSpeed;
  }

  tryMove(direction) {
    // TODO: check for correctness
    let next = direction.nextPoint(this.position);
    // if (utils.freeCell(next))
      move(direction);    
  }

  move(direction) {
    let next = direction.nextPoint(this.position);
    this.position = next;
  }
}

class Pig extends Unit {
  constructor(position, speed, health, mana) {
    super(position, speed);
    this.health = health || initialHealth;
    this.mana = mana || initialMana;
  }
  
  move(direction) {
    //Animation.move.call(this, super.move, direction);
    let next = direction.nextPoint(this.position);
    $('mainTable').rows[position.row].cells[position.col].innerHTML = '';
    this.position = next;
    $('mainTable').rows[position.row].cells[position.col].innerHTML = 'PIG';              
  }
  
}

class Trajectory {
  
  _getTrajectoryStep (position) {
    for (let i = 0; i < this._trajectory.length; ++i)
      if (JSON.stringify(this._trajectory[i]) == JSON.stringify(position))
        return i;
    
    // we're not staying on the trajectory
    // then we'll stay at the same place
    this._trajectory = [position];
    this._currentDirection = 0;
    return 0;
  }
  
  constructor(position, trajectory) {
    this._trajectory = trajectory;
    this._currentDirection = (trajectory.length > 1) ? 1 : 0;
    this._currentStep = this._getTrajectoryStep(position);    
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
  constructor(position, speed, trajectory) {
    super(position, speed);
    this.trajectory = new Trajectory(position, trajectory);
    this.position = () => this.trajectory.currentPosition();
    // setInterval(this.move, speed);
  }

  move() {
  	//Animation.move.call(this, this.trajectory.move());
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
