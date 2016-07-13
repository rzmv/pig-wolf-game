'use strict';

function drawCell(cell) {
  let stItem = cell.staticItem;
  
  for (let i = 0; i < 4; ++i)
    cell.tableCellAddress.innerHTML += stItem.visible ? ('<img src = ' + stItem.image + ' width="45" height = "45">') : '';
}

function drawUnit(unit) {
  let pos = unit.position();
  $('mainTable').rows[pos.row].cells[pos.col].innerHTML = '<img src = ' + unit.image + ' width="45" height = "45">';
}

function getHTMLImgByImage(image, cssClass) {
  if (image === '') {
    return '';
  }
  return '<img src = ' + image + ' class = ' + cssClass + ' width="45" height = "45">';
}

function redrawCell(cell) {
  alert('here');
  let tableCell = cell.tableCell;
  tableCell.innerHTML = getHTMLImgByImage(cell.layers[0], "layer-background");
  
  alert(tableCell.innerHTML);

  for (let i = 0; i < cell.layers[1].length; ++i) {
    tableCell.innerHTML += getHTMLImgByImage(cell.layers[1][i], "layer-trajectory");
  }
  tableCell.innerHTML += getHTMLImgByImage(cell.layers[2], "layer-staticItem");
  tableCell.innerHTML += getHTMLImgByImage(cell.layers[3], "layers-unit");
}

function animateMovement(unit, func, direction) {
  let pos = unit.position();
  let cell = globalField.pointToCell(pos);

  alert('animateMovement');

  cell.leave(unit);


  redrawCell(cell);
  // update unit's coordinates
  unit[func](direction);
 
  pos = unit.position();
  cell = globalField.pointToCell(pos);
  cell.visit(unit);
  redrawCell(cell);
  //alert(unit.name);
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
