'use strict';

function $(id) { return document.getElementById(id); }

function Point(i, j) {
  return { row: i, col: j };  
}

const directionToShift = {
  '': Point(0, 0),
  'stay': Point(0, 0),
  'up': Point(-1, 0),
  'down': Point(1, 0),
  'left': Point(0, -1),
  'right': Point(0, 1),
};

class Direction {
  constructor(direction) {
    this.direction = direction;
    this.shift = directionToShift[direction];
  }

  nextPoint(point) {
    return Point(point.row + this.shift.row, point.col + this.shift.col);  
  }
}

function keyToDirection(keyCode) {
  let ans = '';
  switch (keyCode) {
    case 38: ans = 'up'; break;
    case 40: ans = 'down'; break;
    case 37: ans = 'left'; break;
    case 39: ans = 'right'; break;
    case 32: ans = 'stay'; break;
  }
  
  return new Direction(ans);
}

function incrementPoints() {
  ++globalPoints;
  $('points-output').innerHTML = globalPoints;
}

function pointsDistance(p1, p2) {
  return Math.max(Math.abs(p1.row - p2.row),
    Math.abs(p1.col - p2.col));
}

function winLoseCheck() {
  for (let i = 0; i < globalWolves.length; ++i)
    if (pointsDistance(globalPig.position(), globalWolves[i].position()) <= 1)
      alert('You lose!');
}
