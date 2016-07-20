'use strict';

function $(id) { return document.getElementById(id); }

function checkKey(e) {
  e = e || window.event;
 
 // its 'q' for 'quit' from editing wolf's trajectory
  if (e.keyCode == 81)
    editor.finishWolf();
}

// need carrots for compatibility with other non-levelEditor modules
var Carrots;
var currentLevel;
var editor;
const FIELD_MAX_WIDTH = 30;
const FIELD_MAX_HEIGHT = 20;

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
  
  for (let i = 0; i < BACKGROUNDS.length; ++i) {
    let option = document.createElement('option');
    option.text = BACKGROUNDS[i];
    $('fieldBackground').add(option);
  }
  
  generateField(); 

  //$('buttonCompleteRedraw').onclick = () => editor.completeFieldRedraw(); 
  $('buttonShowJSON').setAttribute('onClick', 'showJSON()');
  $('buttonLoadFromJSON').setAttribute('onClick', 'loadFromJSON()');
  
  document.onkeydown = checkKey;
}

function generateField() {
  let height = parseInt($('fieldHeight').value);
  let width = parseInt($('fieldWidth').value);
  let background = $('fieldBackground').value;
  
  if (isNaN(height) || isNaN(width) || height < 1 ||
    height > FIELD_MAX_HEIGHT || width < 1 || width > FIELD_MAX_WIDTH) {
      alert('Wrong field size! Max height = ' + FIELD_MAX_HEIGHT + ' Max width = ' + FIELD_MAX_WIDTH);
      return;
    } 

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
