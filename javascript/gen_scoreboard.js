window.onload = function() {
  let db = new DB();
  if (db.auth() !== "ok") {
    $("#popupN").show();
  } else {
    db.getLeaderBoard(25, function(usersScores) {
      for (let i = 0; i < usersScores.length; i++) {
        console.log(usersScores[i].score);
        addTableRow(i + 1, usersScores[i].username, usersScores[i].score);
      }
    });
  }
}

function addTableRow(id, username, score) {
  let tableRow = document.createElement('tr');
  let idCell = document.createElement('td');
  idCell.innerText = id;

  let userCell = document.createElement('td');
  userCell.innerText = username;
  let scoreCell = document.createElement('td');
  scoreCell.innerText = score;
  tableRow.appendChild(idCell);
  tableRow.appendChild(userCell);
  tableRow.appendChild(scoreCell);
  document.getElementById('scoreboard').appendChild(tableRow);
}