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

function inBounds(point) {
  return point.row >= 0 && point.col >= 0
    && point.row < fieldHeight && point.col < fieldWidth;
}

// TODO: check class Field
function pointToCell(point)
{
  return Field.cells[point.row][point.col];
}

function freeCell(point) {
  if (inBounds(point))
    return pointToCell(point).isFree();
  return false;  
}