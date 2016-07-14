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
  let cell = currentLevel.field.pointToCell(unit.position());
  cell.addToLayer('unit', unit);
}

function redrawCell(cell) {
  let tableCell = cell.tableCell;
  tableCell.innerHTML = cell.getLayersHTMLString();
}

function animateMovement(unit, func, direction) {
  let pos = unit.position();
  let cell = currentLevel.field.pointToCell(pos);
  cell.leave(unit);
  
  redrawCell(cell);
  
  // update unit's coordinates
  unit[func](direction);
 
  pos = unit.position();
  cell = currentLevel.field.pointToCell(pos);
  cell.visit(unit);
  redrawCell(cell);
}

function movePlayer(direction) {
  animateMovement(currentLevel.pig, 'move', direction);
  for (let i = 0; i < currentLevel.wolves.length; ++i)
    animateMovement(currentLevel.wolves[i], 'move');     
}

function initialDraw() {
  drawUnit(currentLevel.pig);
  for (let i = 0; i < currentLevel.wolves.length; ++i)
    drawUnit(currentLevel.wolves[i]);

  for (let i = 0; i < currentLevel.field.height; ++i)
    for (let j = 0; j < currentLevel.field.width; ++j)
      redrawCell(currentLevel.field.pointToCell(Point(i, j)));
}
