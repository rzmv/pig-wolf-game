'use strict';

var globalPoints = 0;
var globalSteps = 0;
var currentLevel;
var Carrots = 0;
var ResultScore = 0;

const isRealGame = true;

function checkKey(e) {
  e = e || window.event;

  // key 'r' is reload
  if (e.keyCode == 82)
    document.getElementById('level').onclick(); 

  // key 'j' is for toogle button
  if (e.keyCode == 74)
    currentLevel.field.toogleDoorByButton(currentLevel.pig.position());

  let dir = keyToDirection(e.keyCode);
  if (dir.direction != '')
    currentLevel.pig.tryMove(dir);
}

window.onload = function() {
  for(let i = 0; i < LEVELS.length; i++){
     let curBtn = document.createElement('button');
     curBtn.onclick = () => level(i);
     curBtn.innerHTML = 'level ' + (i + 1);     
     curBtn.className = "btn waves-effect waves-light";
     document.getElementById('levelDiv').appendChild(curBtn);
  }
}    


function level(index) {
  document.getElementById('steps-output').innerHTML = 0;
  document.getElementById('points-output').innerHTML = 0;
  globalSteps = 0;
  globalPoints = 0;
  $("#levelDiv").hide();
  $("#gameDiv").show();
  $(".centerDiv").hide();

  document.getElementById('level').onclick = () => level(index);
  document.getElementById('nextlevel').onclick = () => level(index + 1);

  var table = document.getElementById('mainDiv');  
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  currentLevel = new Level();
  currentLevel.loadFromJSON(LEVELS[index]);

  $("#mainDiv").css({"width" : 6 * currentLevel.field.width  + "vmin",
                     "height": 6 * currentLevel.field.height + "vmin"}); //TODO: get width/height dynamically

  document.getElementById('mainDiv').appendChild(currentLevel.field.table);

  initialDraw();

  document.onkeydown = checkKey;
}

function goToLevels() {
  document.getElementById("menu").style="display:none";
  document.getElementById("levels").style="display:block";
}

function winToMenu() {
  $("#win").hide();
  $("#levelDiv").show();   
}

function loseToMenu() {
  $("#scoreDiv").hide();
  $("#levelDiv").show();
}
  
function menuToScoreboard() {
  location.href="scoreboard.html";
}

function submitResult() {
  let db = new DB();
  let inputUN = document.getElementById("username").value;
  let score   = document.getElementById("userScore").innerText;
  if (inputUN === "") {
    $('#username').focus();
  } else {
    if (inputUN !== Username) {
      Username = inputUN;
      UsersResultID = db.genResultID();
    }
    db.auth();
    db.setData(Username, score, UsersResultID);
    popUpShow();
  }

}

function welToLevels() {
  $("#welcomeDiv").hide();
  $("#levelDiv").show();
}

function toLevel() {
  $("#welGameBtn").hide();
  $("#gameDiv").hide();
  $("#scoreDiv").hide();
  $("#win").hide();
  $(".centerDiv").show();
  $("#levelDiv").show();
}