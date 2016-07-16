'use strict';

var globalPoints = 0;
var globalSteps = 0;
var currentLevel;
var Carrots = 0;
var ResultScore = 0;

function checkKey(e) {
  e = e || window.event;
  let dir = keyToDirection(e.keyCode);
  if (dir.direction != '')
    currentLevel.pig.tryMove(dir);
}

window.onload = function(){


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
  /*document.getElementById("levels").style="display:none";
  document.getElementById("background").style="display:none";*/
/*  document.getElementById("levels").style="display:none";
  document.getElementById("background").style="display:none";
  document.getElementById("win").style="display:none";*/

  document.getElementById('level').onclick = () => level(index);
  document.getElementById('nextlevel').onclick = () => level(index + 1);

  var table = document.getElementById('mainDiv');  
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  currentLevel = new Level();
  currentLevel.loadFromJSON(LEVELS[index]);
  //alert(currentLevel.field.table);    
  document.getElementById('mainDiv').appendChild(currentLevel.field.table);
  initialDraw();

  document.onkeydown = checkKey;
}

function goToLevels() {
  document.getElementById("menu").style="display:none";
  document.getElementById("levels").style="display:block";
}

function winToMenu() {
 /* document.getElementById("win").style="display:none";
  document.getElementById("menu").style="display:block";*/
  $("#win").hide();
  $("#levelDiv").show();   
}

function loseToMenu() {
  /*document.getElementById("lose").style="display:none";
  document.getElementById("menu").style="display:block";*/
  $("#scoreDiv").hide();
  $("#levelDiv").show();
  alert("ww");
}
  

function levelToMenu() {
  document.getElementById("levels").style="display:none";
  document.getElementById("menu").style="display:block";
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