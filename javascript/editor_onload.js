'use strict';

function $(id) { return document.getElementById(id); }

function checkKey(e) {
  e = e || window.event;
 
 // its 'q' for 'quit' from editing wolf's trajectory
  if (e.keyCode == 81)
    editor.finishWolf();
}

// need carrots for compatibility with other non-levels-editor modules
var Carrots;
var currentLevel;
var editor;

function showField() {
  let el = $('mainDiv');
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }

  el.appendChild(currentLevel.field.table);
  initialDraw();
}

window.onload = function() {
  $('fieldHeight').value = 5;
  $('fieldWidth').value = 5;
  $('fieldBackground').value = 'grass';
  
  generateField(); 

  $('buttonCompleteRedraw').onclick = () => editor.completeFieldRedraw(); 
  $('buttonShowJSON').setAttribute('onClick', 'showJSON()');
  $('buttonLoadFromJSON').setAttribute('onClick', 'loadFromJSON()');
  document.onkeydown = checkKey;
}

function generateField() {
  let height = $('fieldHeight').value;
  let width = $('fieldWidth').value;
  let background = $('fieldBackground').value;
  
  let f = new Field(height, width, background);
  let p = new Pig(Point(0, 0));

  currentLevel = new Level(f, p, []); 
  editor = new Editor(currentLevel);
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
