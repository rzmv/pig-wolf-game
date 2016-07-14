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

function getHTMLImgByImage(image, cssClass = '', priority = null) {
  if (image === '') {
    return '';
  }                                                   
  return '<img src = "' + image + '" class = "' + cssClass + '">';
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
  let prev = unit.position();
  let cell = currentLevel.field.pointToCell(prev);
  cell.leave(unit);
  redrawCell(cell);
  
  // update unit's coordinates
  unit[func](direction);
 
  let cur = unit.position();
  cell = currentLevel.field.pointToCell(cur);
  cell.visit(unit);
  redrawCell(cell);

  if (!currentLevel.lights && unit.name == 'pig')
    redrawDarkness(prev, cur);
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

//getPointsFromRange(point, range)

function addDarkness(point, range) {
  let arr = getPointsFromRange(point, range);
  for (let i = 0; i < arr.length; ++i) {
    let curCell = currentLevel.field.pointToCell(arr[i]);
    curCell.addToLayer('darkness', 'darkness');
    redrawCell(curCell);
  }
}

function removeDarkness(point, range) {
  let arr = getPointsFromRange(point, range);
  for (let i = 0; i < arr.length; ++i) {
    let curCell = currentLevel.field.pointToCell(arr[i]);
    curCell.removeLayer('darkness');
    redrawCell(curCell);
  }
}

function redrawDarkness(prev, cur) {
  // some error occured, pig can see thole field
  if (currentLevel.pig.visibilityRange == 0)
    return;

  addDarkness(prev, currentLevel.pig.visibilityRange);
  removeDarkness(cur, currentLevel.pig.visibilityRange);
}

function animateTurningLightsOff(point, range)
{
  //let arr = getPointsFromRange(point, 1000);

}

