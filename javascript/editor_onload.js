'use strict';

function checkKey(e) {
  e = e || window.event;
  let dir = keyToDirection(e.keyCode);
  if (dir.direction != ''){
    currentLevel.pig.tryMove(dir);
   // ++globalSteps;
   // $('steps-output').innerHTML = globalSteps;
  }
}

var currentLevel;
var editor;

function showField() {
  let el = $('mainDiv');
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }

  $('mainDiv').appendChild(currentLevel.field.table)
  initialDraw();
}

window.onload = function(){
  let f = new Field(5, 5);
  let p = new Pig(Point(0, 0));
   
  currentLevel = new Level(f, p, []);    
  showField();

  editor = new Editor(currentLevel);
}

function generateField() {
  let height = $('levelHeight').value;
  let width = $('levelWidth').value;
  
  currentLevel.field = new Field(height, width);
  showField();
}

function level() {
  globalField = new Field(10, 10);
  //document.getElementById('mainDiv').appendChild(globalField.table);

  globalField.changeCell(Point(5, 5), 'grass', [{'itemName':'wall'}]);
  
  globalField.changeCell(Point(8, 3), 'grass', [{'itemName':'food'}]);

  globalField.changeCell(Point(1, 7), 'grass', [{'itemName':'door'}, {'itemName':'food'}]);

  globalField.changeCell(Point(0, 8), 'wood');

  globalField.changeCell(Point(0, 9), 'wood', [{'itemName':'food'}, {'itemName':'food'}, {'itemName':'lamp'}]);
  globalField.changeCell(Point(9, 0), 'grass', [{'itemName':'snowflake'}, {'itemName':'button', 'doorPosition':Point(1, 7)}]);
  
  globalField.changeCell(Point(3, 3), 'grass', [{'itemName':'snowflake'}]);
  globalField.changeCell(Point(9, 9), 'grass', [{'itemName':'fire'}]);

  globalField.changeCell(Point(9, 8), 'grass', [{'itemName':'food'}, {'itemName':'snowflake'}, {'itemName':'blackButton'}]);

  document.onkeydown = checkKey;
}
