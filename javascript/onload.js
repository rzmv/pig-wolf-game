'use strict';

// works without require
//const units = require('./units');

//const Point = require('./utils').Point;

var globalPig;
var globalWolf, globalWolf2;

function keyToDirection(e) {
  e = e || window.event;
  let ans = '';

  if (e.keyCode == 38) {
      // up arrow
      ans = 'up';
  }
  else if (e.keyCode == 40) {
      // down arrow
      ans = 'down';
  }
  else if (e.keyCode == 37) {
     // left arrow
     ans = 'left';
  }
  else if (e.keyCode == 39) {
     // right arrow
     ans = 'right';
  }
  return new Direction(ans);
}

function checkKey(e) {
  let dir = keyToDirection(e);
  globalPig.tryMove(dir);
}

window.onload = function () {
  for (let i = 0; i < 4; i++) {
    let newRow = document.createElement("tr");
    for (let j = 0; j < 8; j++) {
      let newCell = document.createElement("td");
      newCell.className = "table-cell";
      newRow.appendChild(newCell);
    }
    document.getElementById("mainTable").appendChild(newRow);
  }

  globalPig = new Pig(Point(1, 1));
  globalWolf = new Wolf(Point(2, 2), 1000, [Point(2, 2), Point(2, 3), Point (2, 4), Point(1, 4)]);
  globalWolf2 = new Wolf(Point(0, 0), 500, [Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0)]);

  globalWolf.startMovement();
  globalWolf2.startMovement();

  document.onkeydown = checkKey;
}