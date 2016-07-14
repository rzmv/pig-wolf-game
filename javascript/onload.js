'use strict';

/* FIXME: problems with modules (exactly function 'require')
 * that's why we need to include files in header
 * and pray for God they will be in right order
*/

//const units = require('./units');
//const Point = require('./utils').Point;

var globalPig;
var globalWolf, globalWolf2, globalWolf3;
var globalWolves = [];
var globalField = {};
var globalPoints = 0;
var globalSteps = 0;

var currentLevel;

function checkKey(e) {
  e = e || window.event;
  let dir = keyToDirection(e.keyCode);
  if (dir.direction != ''){
    currentLevel.pig.tryMove(dir);
   // ++globalSteps;
   // $('steps-output').innerHTML = globalSteps;
  }
}

window.onload = function(){
  document.getElementById("menu").style="display:block";
  document.getElementById("background").style="display:block";
}

function level() {
  $('steps-output').innerHTML = 0;
  $('points-output').innerHTML = 0;

  document.getElementById("levels").style="display:none";
  document.getElementById("background").style="display:none";

  var table = document.getElementById('mainDiv');

  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  globalField = new Field(10, 10);
  //document.getElementById('mainDiv').appendChild(globalField.table);

  globalField.changeCell(Point(5, 5), 'grass', [{'itemName':'wall'}]);
  globalField.changeCell(Point(5, 6), 'grass', [{'itemName':'wall'}]);
  globalField.changeCell(Point(6, 6), 'grass', [{'itemName':'wall'}]);
  globalField.changeCell(Point(7, 9), 'grass', [{'itemName':'wall'}]);

  globalField.changeCell(Point(8, 3), 'grass', [{'itemName':'food'}]);
  globalField.changeCell(Point(3, 8), 'grass', [{'itemName':'food'}]);
  globalField.changeCell(Point(2, 3), 'grass', [{'itemName':'food'}]);

  globalField.changeCell(Point(0, 7), 'ground', [{'itemName':'wall'}]);  
  globalField.changeCell(Point(1, 7), 'grass', [{'itemName':'door'}, {'itemName':'food'}]);
  globalField.changeCell(Point(2, 7), 'ground', [{'itemName':'wall'}]);
  globalField.changeCell(Point(2, 8), 'ground', [{'itemName':'wall'}]);
  globalField.changeCell(Point(2, 9), 'ground', [{'itemName':'wall'}]);

  globalField.changeCell(Point(0, 8), 'wood');
  globalField.changeCell(Point(0, 9), 'wood');
  globalField.changeCell(Point(1, 8), 'wood');
  globalField.changeCell(Point(1, 9), 'wood');

  globalField.changeCell(Point(0, 9), 'wood', [{'itemName':'food'}, {'itemName':'food'}, {'itemName':'lamp'}]);
  globalField.changeCell(Point(9, 0), 'grass', [{'itemName':'button', 'doorPosition':Point(1, 7)}]);
  
  globalField.changeCell(Point(3, 3), 'grass', [{'itemName':'snowflake'}]);
  globalField.changeCell(Point(9, 9), 'grass', [{'itemName':'fire'}]);

  globalField.changeCell(Point(9, 8), 'grass', [{'itemName':'darkness'}]);

  globalPig = new Pig(Point(1, 1));
  globalWolf = new Wolf(Point(2, 2), [Point(2, 2), Point(2, 3), Point (2, 4), Point(1, 4)]);
  globalWolf2 = new Wolf(Point(0, 0), [Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0)]);
  globalWolf3 = new Wolf(Point(8, 4), [Point(8, 2), Point(8, 3), Point(8, 4), Point(8, 5),
    Point(7, 5), Point(6, 5), Point(6, 6), Point(6, 7)]);

  globalWolves = [globalWolf, globalWolf2, globalWolf3];
  for (let i = 0; i < globalWolves.length; ++i)
    globalWolves[i].addTrajectoryLayerToField(globalField);

  //initialDraw();
  
  currentLevel = new Level(globalField, globalPig, globalWolves);
  let JSONLevel = currentLevel.showJSON();
  currentLevel.loadFromJSON(JSONLevel);
  
  document.getElementById('mainDiv').appendChild(currentLevel.field.table);
  currentLevel.showJSON();

  //alert(currentLevel.maxPoints);

  initialDraw();

  document.onkeydown = checkKey;
}

function goToLevels() {
  document.getElementById("menu").style="display:none";
  document.getElementById("levels").style="display:block";
}

function winToMenu() {
  document.getElementById("win").style="display:none";
  document.getElementById("menu").style="display:block";
}

function loseToMenu() {
  document.getElementById("lose").style="display:none";
  document.getElementById("menu").style="display:block";
}

function levelToMenu() {
  document.getElementById("levels").style="display:none";
  document.getElementById("menu").style="display:block";
}

function menuToScoreboard() {
  location.href='scoreboard.html';
}