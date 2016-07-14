'use strict';

function $(id) { return document.getElementById(id); }

function checkKey(e) {
  e = e || window.event;
  /*let dir = keyToDirection(e.keyCode);
  if (dir.direction != ''){
    currentLevel.pig.tryMove(dir);
   // ++globalSteps;
   // $('steps-output').innerHTML = globalSteps;
  }
 */

 // its 'q' for 'quit' from editing wolf's trajectory
 if (e.keyCode == 81)
  editor.finishWolf();
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

  $('buttonCompleteRedraw').onclick = () => editor.completeFieldRedraw(); 
  $('buttonShowJSON').setAttribute('onClick', 'showJSON()');
  $('buttonLoadFromJSON').setAttribute('onClick', 'loadFromJSON()');
  document.onkeydown = checkKey;
}

function generateField() {
  let height = $('fieldlHeight').value;
  let width = $('fieldWidth').value;
  let background = $('fieldBackground').value;
  
  currentLevel.field = new Field(height, width, background);
  editor.makeFieldCellsClickable();
  showField();
}

function showJSON() {
  $('JSONTextArea').value = currentLevel.saveToJSON();  
  alert('SAVED TO JSON, LOOK AT THE TEXTAREA BELOW');
}

function loadFromJSON() {
  currentLevel.loadFromJSON($('JSONTextArea').value);
  editor = new Editor(currentLevel);
  showField();
  alert('LOADED FROM JSON');
}
