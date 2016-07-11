window.onload = function () {
  for (let i = 0; i < 4; i++) {
    let newRow = document.createElement("tr");
    for (let j = 0; j < 8; j++) {
      let newCell = document.createElement("td");
      newCell.className = "table-cell";
      newRow.appendChild(newCell);
    }
    document.getElementById("mainTable").appendChild(newRow);
  }
}