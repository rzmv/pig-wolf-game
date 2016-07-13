window.onload = function() {
  let db = new DB();
  if (db.auth() !== "ok") {
    alert("Error. Please, refresh the page"); //TODO: replace alert with normal notification
  } else {
    db.getLeaderBoard(10, function(usersScores) {
      for (let i = 0; i < usersScores.length; i++) {
        addTableRow(usersScores[i].username, usersScores[i].score);
      }
    });
  }
}

function addTableRow(username, score) {
  let tableRow = document.createElement('tr');

  let userCell = document.createElement('td');
  userCell.innerText = username;
  tableRow.appendChild(userCell);

  let scoreCell = document.createElement('td');
  scoreCell.innerText = score;
  tableRow.appendChild(scoreCell);

  document.getElementById('scoreboard').appendChild(tableRow);
}