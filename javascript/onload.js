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

function checkKey(e) {
  e = e || window.event;
  let dir = keyToDirection(e.keyCode);
  if (dir.direction != '')
    globalPig.tryMove(dir);
}

window.onload = function () {
  for (let i = 0; i < 10; i++) {
    let newRow = document.createElement("tr");
    for (let j = 0; j < 10; j++) {
      let newCell = document.createElement("td");
      newCell.className = "table-cell";
      newRow.appendChild(newCell);
    }
    document.getElementById("mainTable").appendChild(newRow);
  }

  globalField = new Field(10, 10);
  globalField.cells[5][5] = new Cell('wall');
  globalField.cells[5][6] = new Cell('wall');
  globalField.cells[6][6] = new Cell('wall');
  globalField.cells[7][9] = new Cell('wall');

  globalPig = new Pig(Point(1, 1));
  globalWolf = new Wolf(Point(2, 2), [Point(2, 2), Point(2, 3), Point (2, 4), Point(1, 4)]);
  globalWolf2 = new Wolf(Point(0, 0), [Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0)]);
  globalWolf3 = new Wolf(Point(8, 4), [Point(8, 2), Point(8, 3), Point(8, 4), Point(8, 5),
    Point(7, 5), Point(6, 5), Point(6, 6), Point(6, 7)]);

  globalWolves = [globalWolf, globalWolf2, globalWolf3];

  initialDraw();
  document.onkeydown = checkKey;
}
