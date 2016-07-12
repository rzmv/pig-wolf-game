'use strict';

function drawCell(pos) {
  let stItem = globalField.pointToCell(pos).staticItem;
  switch (stItem.text) {
    case 'FOOD' :
      $('mainTable').rows[pos.row].cells[pos.col].innerHTML = '<img src = "images/carrot.svg" width="50">'; break;
    case 'WALL' :
      $('mainTable').rows[pos.row].cells[pos.col].innerHTML = '<img src = "images/wall.svg" width="50">'; break;
    case 'DOOR':
      $('mainTable').rows[pos.row].cells[pos.col].innerHTML = '<img src = "images/door.svg" width="50" height="50">'; break;
    case 'BUTTON':
      $('mainTable').rows[pos.row].cells[pos.col].innerHTML = '<img src = "images/Button.svg" width="50" >'; break;
  }
}

function drawUnit(unit) {
  let pos = unit.position();
  switch (unit.text) {
    case 'Wolf':
      $('mainTable').rows[pos.row].cells[pos.col].innerHTML = '<img src = "images/wolf.svg" width="50" >'; break;
    case 'PIG':
      $('mainTable').rows[pos.row].cells[pos.col].innerHTML = '<img src = "images/pig.svg" width="50" >'; break;
  }
}

function redrawCell(pos, unit) {
  let cell = globalField.pointToCell(pos);
  cell.visit(unit);
  drawCell(pos);  
}

function animateMovement(unit, func, direction) {
  let pos = unit.position();
  $('mainTable').rows[pos.row].cells[pos.col].innerHTML = '';
  redrawCell(pos, unit);

  // update unit's coordinates
  unit[func](direction);
  
  pos = unit.position();
  redrawCell(pos, unit);
  drawUnit(unit);
}

function movePlayer(direction) {
  animateMovement(globalPig, 'move', direction);
  for (let i = 0; i < globalWolves.length; ++i)
    animateMovement(globalWolves[i], 'move');     
}

function initialDraw() {
  for (let i = 0; i < globalField.height; ++i)
    for (let j = 0; j < globalField.width; ++j)
      drawCell(Point(i, j));

  for (let i = 0; i < globalWolves.length; ++i)
    drawUnit(globalWolves[i]);

  drawUnit(globalPig);
}
