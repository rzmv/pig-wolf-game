'use strict';

class Unit {
  constructor(position, name, image) {
    this._position = position;
    this._prevPosition = position;
    this.name = name;
    this.normalImg = image;

    // cause we need function in Wolf's position
    // so let's make it general
    this.position = () => this._position;
    this.prevPosition = () => this._prevPosition;
    this._currentImg = this.normalImg;
    this.image = () => this._currentImg;
  }

  // real game, or editor game
  tryMove(direction) {
    let next = direction.nextPoint(this.position());
    if (!currentLevel.field.freeCell(next))
      return;

    movePlayer(direction);
    
    if (isRealGame) {
      incrementSteps();
      winLoseCheck();
    }    
  }

  move(direction) {
    let next = direction.nextPoint(this.position());
    this._prevPosition = this._position;
    this._position     = next;
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
        
    this._isCycle = this._isTrajectoryCycle(this._trajectory, 0, trajectory.length - 1);
    this._position = position;

    // need to rememeber for wolf.freeze
    this._latestDirection = this._currentDirection;
  }
  
  _getTrajectoryStep(position) {
    for (let i = 0; i < this._trajectory.length; ++i)
      if (equalPoints(this._trajectory[i], position))
        return i;
    
    // we're not staying on the trajectory
    // then we'll stay at the same place
    this._trajectory = [position];
    this._currentDirection = 0;
    return 0;
  }

  _isTrajectoryCycle(trajectory, first, second) {
    return trajectory.length > 1 && equalPoints(trajectory[first], trajectory[second]);
  }

  currentPosition() {
    return this._trajectory[this._currentStep];
  }

  // return and object {'step':value, 'direction':value}
  nextStepAndDirection() {
    let curStep = this._currentStep;
    let curDir = this._currentDirection;
    
    let nextStep = curStep;
    let nextDir = curDir;

    if ((curStep + curDir == this._trajectory.length) ||
       (curStep + curDir < 0))
    {
      if (this._isCycle) {
        if (curStep + curDir == this._trajectory.length)
          nextStep = 1;
        else
          nextStep = this._trajectory.length - 2;
        return {'step':nextStep, 'direction':nextDir};
      }
      else
        nextDir = -this._currentDirection;
    }
    nextStep += nextDir;
    
    // check for a door or a wall
    let nextPoint = this._trajectory[nextStep];
    let nextCell = currentLevel.field.pointToCell(nextPoint);
    if (!nextCell.isFree()) {
      // change direction
      nextDir = -nextDir;
      
      // not last or first element in the array
      if (nextStep + nextDir == 0 ||
        nextStep + nextDir == this._trajectory.length - 1)
      {
        nextStep += nextDir;
      }
      else
        nextStep += 2 * nextDir;

    }

    return {'step':nextStep, 'direction':nextDir};  
  }

  move() {
    let t = this.nextStepAndDirection();
    this._currentStep = t.step;
    this._currentDirection = t.direction;  
  }

  directionToNextPoint() {
    let t = this.nextStepAndDirection();
    let curPoint = this._trajectory[this._currentStep];
    let nextPoint = this._trajectory[t.step];
    return this.shiftToDirName(pointsDiff(nextPoint, curPoint));
  }

  shiftToDirName(shift) {
      switch (shift.row + ' ' + shift.col) {
      case '-1 0': return 'up'; break;
      case '1 0': return 'down'; break;
      case '0 -1': return 'left'; break;
      case '0 1': return 'right'; break;
      case '0 0': return ''; break;
    }
  }

  addLayerToField(field, traj = null) {
    if (traj === null)
      traj = this._trajectory;

    for (let i = 1; i < traj.length; ++i) {
      let prev = traj[i - 1];
      let cur = traj[i];
      let prevLine = this.shiftToDirName(pointsDiff(cur, prev));
      let curLine = this.shiftToDirName(pointsDiff(prev, cur));
            
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
  constructor(position, trajectory = []) {
    super(position, 'wolf', 'images/wolf.svg');
    this.frozenImg = 'images/blue_wolf.svg';

    this.trajectory = new Trajectory(position, trajectory);
    this.position = () => this.trajectory.currentPosition();
    this.influenceOnCell = 'toogleVisibility';
  }

  move() {
    this._prevPosition = this.position();
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
