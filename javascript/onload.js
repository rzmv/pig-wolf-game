'use strict';

/* FIXME: problems with modules (exactly function 'require')
 * that's why we need to include files in header
 * and pray for God they will be in right order
*/

//const units = require('./units');
//const Point = require('./utils').Point;

var globalPig;
var globalWolf, globalWolf2;
var globalWolves = [];

function checkKey(e) {
  e = e || window.event;
  let dir = keyToDirection(e.keyCode);
  if (dir.direction != '')
    globalPig.tryMove(dir);
}

window.onload = function () {
  for (let i = 0; i < 6; i++) {
    let newRow = document.createElement("tr");
    for (let j = 0; j < 10; j++) {
      let newCell = document.createElement("td");
      newCell.className = "table-cell";
      newRow.appendChild(newCell);
    }
    document.getElementById("mainTable").appendChild(newRow);
  }

  globalPig = new Pig(Point(1, 1));
  globalWolf = new Wolf(Point(2, 2), [Point(2, 2), Point(2, 3), Point (2, 4), Point(1, 4)]);
  globalWolf2 = new Wolf(Point(0, 0), [Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0)]);

  globalWolves = [globalWolf, globalWolf2];

  document.onkeydown = checkKey;
}
