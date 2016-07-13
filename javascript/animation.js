'use strict';

function getTrajectoryAddress(trajectory) {
  return 'images/trajectory_' + trajectory + '.svg';
}

function getBackgroundAddress(background) {
  return 'images/' + background + '.svg';
}

function getHTMLImgByImage(image, cssClass) {
  if (image === '') {
    return '';
  }
  return '<img src = ' + image + ' class = ' + cssClass + ' width="49" height = "49">';
}

function drawUnit(unit) {
  let cell = globalField.pointToCell(unit.position());
  cell.addToLayer('unit', unit);
}

function redrawCell(cell) {
  let tableCell = cell.tableCell;
  tableCell.innerHTML = cell.getLayersHTMLString();
}

function animateMovement(unit, func, direction) {
  let pos = unit.position();
  let cell = globalField.pointToCell(pos);
  cell.leave(unit);
  
  redrawCell(cell);
  
  // update unit's coordinates
  unit[func](direction);
 
  pos = unit.position();
  cell = globalField.pointToCell(pos);
  cell.visit(unit);
  redrawCell(cell);
}

function movePlayer(direction) {
  animateMovement(globalPig, 'move', direction);
  for (let i = 0; i < globalWolves.length; ++i)
    animateMovement(globalWolves[i], 'move');     
}

function initialDraw() {
  drawUnit(globalPig);
  for (let i = 0; i < globalWolves.length; ++i)
    drawUnit(globalWolves[i]);

  for (let i = 0; i < globalField.height; ++i)
    for (let j = 0; j < globalField.width; ++j)
      redrawCell(globalField.pointToCell(Point(i, j)));
}
