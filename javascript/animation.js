'use strict';

function getTrajectoryAddress(trajectory) {
  return 'images/trajectory_' + trajectory + '.svg';
}

function getBackgroundAddress(background) {
  if (background == 'wood')
    return 'images/wood.jpg';
  return 'images/' + background + '.svg';
}

function getDarknessAddress(darkness) {
  if (darkness === '')
    return '';
  return 'images/black.svg';
}

function getArrowAddress(arrow) {
  if (arrow === '')
    return '';
  
  //return 'images/crossarrow_' + arrow + '.svg';

  switch (arrow) {
    case 'up': return 'images/wolf_ears.svg';
    case 'left': return 'images/wolf_nose.svg';
    case 'down': return 'images/wolf_teeth.svg';
    case 'right': return 'images/wolf_nape.svg';
  }
}

function getHTMLImgByImage(image, cssClass = '') {
  if (image === '') {
    return '';
  }                                                   
  return '<img src = "' + image + '" class = "' + cssClass + '">';
}

function drawUnit(unit) {
  let cell = currentLevel.field.pointToCell(unit.position());
  cell.visit(unit);
}

function redrawCell(cell) {
  let tableCell = cell.tableCell;
  tableCell.innerHTML = cell.getLayersHTMLString();
}

let cellsToRedraw = [];

function animateMovement(unit, func, direction) {
  let prev = unit.position();
  let cell = currentLevel.field.pointToCell(prev);
  let lights = currentLevel.lights;

  cell.leave(unit);
  cellsToRedraw.push(cell);

  // update unit's coordinates
  unit[func](direction);
 
  let cur = unit.position();
  cell = currentLevel.field.pointToCell(cur);
  cell.visit(unit);
  cellsToRedraw.push(cell);

  if (!lights && unit.name == 'pig')
    redrawDarkness(prev, cur);
}

function movePlayer(direction) {
  cellsToRedraw = [];

  // first move wolves, then pig, this order is important for freezing wolves
  for (let i = 0; i < currentLevel.wolves.length; ++i)
    animateMovement(currentLevel.wolves[i], 'move');
  
  animateMovement(currentLevel.pig, 'move', direction);

  for (let i = 0; i < cellsToRedraw.length; ++i)
    redrawCell(cellsToRedraw[i]);
}

function initialDraw() {
  drawUnit(currentLevel.pig);

  for (let i = 0; i < currentLevel.wolves.length; ++i)
    drawUnit(currentLevel.wolves[i]);

  for (let i = 0; i < currentLevel.field.height; ++i)
    for (let j = 0; j < currentLevel.field.width; ++j)
      redrawCell(currentLevel.field.pointToCell(Point(i, j)));
}

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
  let arr = getPointsFromRange(point, 1000);
  
  let rec = function (i) {

    // point distance to the point with Black-Button
    if (i >= 0 && pointsDistance(point, arr[i]) > range) {
      
      // point distance to the current pig's position
      // need this check because pig can move, while we are drawing darkness 
      if (pointsDistance(currentLevel.pig.position(), arr[i]) > range) {
        let curCell = currentLevel.field.pointToCell(arr[i]);
        curCell.addToLayer('darkness', 'darkness');
        redrawCell(curCell);
      }

      setTimeout(() => rec(i - 1), 10);
    }
  }
  
  rec(arr.length - 1);
}

function animateTurningLightsOn(point, range)
{ 
  let arr = getPointsFromRange(point, 1000);
  
  let i;
  for (i = 0; i < arr.length; ++i)
    if (pointsDistance(point, arr[i]) > range - 1)
      break;

  let rec = function (i) {
    if (i < arr.length) {
      let curCell = currentLevel.field.pointToCell(arr[i]);
      curCell.removeLayer('darkness');
      redrawCell(curCell);
      setTimeout(() => rec(i + 1), 10);
    }
  }

  rec(i);
}
