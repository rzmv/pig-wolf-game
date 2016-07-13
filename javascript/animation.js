'use strict';
/*
function drawCell(cell) {
  let stItem = cell.staticItem;
  
  for (let i = 0; i < 4; ++i)
    cell.tableCellAddress.innerHTML += stItem.visible ? ('<img src = ' + stItem.image + ' width="50" height = "50">') : '';
}
*/

function drawUnit(unit) {
  let pos = unit.position();
  let cell = globalField.pointToCell(pos);
  cell.layers[3] = unit.image;
}

function getHTMLImgByImage(image, cssClass) {
  if (image === '') {
    return '';
  }
  return '<img src = ' + image + ' class = ' + cssClass + ' width="54" height = "49">';
}

function redrawCell(cell) {
  let tableCell = cell.tableCell;
  tableCell.innerHTML = getHTMLImgByImage(cell.layers[0], "layer-background");
  for (let i = 0; i < cell.layers[1].length; ++i) {
    tableCell.innerHTML += getHTMLImgByImage(cell.layers[1][i], "layer-trajectory");
  }
  tableCell.innerHTML += getHTMLImgByImage(cell.layers[2], "layer-staticItem");
  tableCell.innerHTML += getHTMLImgByImage(cell.layers[3], "layers-unit");
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
