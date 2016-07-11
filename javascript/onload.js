'use strict';

// works without require
const units = require('./units');

var globalPig;

function keyToDirection(e) {
  e = e || window.event;

  if (e.keyCode == '38') {
      // up arrow
      return 'up';
  }
  else if (e.keyCode == '40') {
      // down arrow
      return 'down';
  }
  else if (e.keyCode == '37') {
     // left arrow
     return 'left';
  }
  else if (e.keyCode == '39') {
     // right arrow
     return 'right';
  }
  return '';
}

function checkKey(e) {
  let dir = keyToDirection(e);
  alert(dir);
  //if (dir != '')
  //  globalPig.tryMove(dir);
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

  //globalPig = new units.Pig(Point(0, 0));
  document.onkeydown = checkKey;
}