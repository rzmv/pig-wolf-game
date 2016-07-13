'use strict';

/* FIXME: problems with modules (exactly function 'require')
 * that's why we need to include files in header
 * and pray for God they will be in right order
*/

//const units = require('./units');
//const Point = require('./utils').Point;

var globalPig;
var globalWolf, globalWolf2, globalWolf3;
var globalWolves = [];
var globalField;
var globalPoints = 0;

function checkKey(e) {
  e = e || window.event;
  let dir = keyToDirection(e.keyCode);
  if (dir.direction != '')
    globalPig.tryMove(dir);
}

window.onload = function () {

  globalField = new Field(10, 10);
  document.getElementById('mainDiv').appendChild(globalField.table);

  /*globalField.cells[5][5] = new Cell('wall');
  globalField.cells[5][6] = new Cell('wall');
  globalField.cells[6][6] = new Cell('wall');
  globalField.cells[7][9] = new Cell('wall');

  globalField.cells[8][3] = new Cell('food');
  globalField.cells[3][8] = new Cell('food');
  globalField.cells[2][3] = new Cell('food');

  let curDoor = new Cell('door');
  globalField.cells[0][7] = new Cell('wall');
  globalField.cells[1][7] = curDoor;
  globalField.cells[2][7] = new Cell('wall');
  globalField.cells[2][8] = new Cell('wall');
  globalField.cells[2][9] = new Cell('wall');

  globalField.cells[0][9] = new Cell('food');
  globalField.cells[9][0] = new Cell('button', curDoor);*/

  globalPig = new Pig(Point(1, 1));
  globalWolf = new Wolf(Point(2, 2), [Point(2, 2), Point(2, 3), Point (2, 4), Point(1, 4)]);
  globalWolf2 = new Wolf(Point(0, 0), [Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0)]);
  globalWolf3 = new Wolf(Point(8, 4), [Point(8, 2), Point(8, 3), Point(8, 4), Point(8, 5),
    Point(7, 5), Point(6, 5), Point(6, 6), Point(6, 7)]);

  globalWolves = [globalWolf, globalWolf2, globalWolf3];

//  initialDraw();
  document.onkeydown = checkKey;
}
