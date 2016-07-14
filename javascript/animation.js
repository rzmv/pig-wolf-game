'use strict';

function getTrajectoryAddress(trajectory) {
  return 'images/trajectory_' + trajectory + '.svg';
}

function getBackgroundAddress(background) {
  return 'images/' + background + '.svg';
}

function getDarknessAddress(darkness) {
  if (darkness === '')
    return '';
  return 'images/black.svg';
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

  if (!currentLevel.lights)
    redrawDarkness(); 
}

function initialDraw() {
  drawUnit(currentLevel.pig);
  for (let i = 0; i < currentLevel.wolves.length; ++i)
    drawUnit(currentLevel.wolves[i]);

  for (let i = 0; i < currentLevel.field.height; ++i)
    for (let j = 0; j < currentLevel.field.width; ++j)
      redrawCell(currentLevel.field.pointToCell(Point(i, j)));
}

function redrawDarkness() {
  // !!!TODO: rewrite it to bfs, it'll be O(r^2) not O(width * height)
  let lev = currentLevel;
  
  // some error occured, pig can see thole field
  if (lev.pig.visibilityRange == 0)
    return;

  for (let i = 0; i < lev.field.height; ++i)
    for (let j = 0; j < lev.field.width; ++j) {
      let dist = pointsDistance(lev.pig.position(), Point(i, j));
      /*
      alert('PIG ' + lev.pig.position().row + ' ' + lev.pig.position().col);
      alertPoint(Point(i, j));
      alert('DISTANCE = ' + dist);
      */
      if (dist > lev.pig.visibilityRange)
        lev.field.cells[i][j].addToLayer('darkness', 'darkness');
      else
        lev.field.cells[i][j].removeLayer('darkness');

      redrawCell(lev.field.cells[i][j]);
    }
}
