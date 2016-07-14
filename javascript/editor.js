'use strict';

class Editor {
  constructor(level) {
    this.level = level;
    
    for (let i = 0; i < level.field.height; ++i)
      for (let j = 0; j < level.field.width; ++j)
        level.field.cells[i][j].tableCell.onclick = () => this.addSelectedItem(Point(i, j));
    
    
    this.pushBackgrounds();
    let backgroundsTable = this.createTableFromArray(this.arrayBackgrounds, 'table-backgrounds', 'pickBackground');
    document.body.appendChild(backgroundsTable);

    this.currentItemName = 'background';
    this.currentItemIndex = 1;
  }

  pushBackgrounds() {
    alert('pushBackgrounds');
    this.arrayBackgrounds = [];
    this.arrayBackgrounds.push('grass');
    this.arrayBackgrounds.push('ground');
    this.arrayBackgrounds.push('wood');
  }

  createTableFromArray(arr, tableId, pickFuncName) {
    let table = document.createElement('table');
    table.id = tableId;
    
    let curRow = document.createElement('tr');
    for (let i = 0; i < arr.length; ++i) {
      let curCol = document.createElement('td');
      curCol.innerHTML = arr[i];
      
      curCol.onclick = () => this[pickFuncName](i);
      curRow.appendChild(curCol);  
    }
    table.appendChild(curRow);

    return table;
  }

  pickBackground(index) {
    alert(index);
    this.currentItemName = 'background';
   
    alert('listen ' + this.currentItemIndex);
    this.currentItemIndex = index;
    
    alert('listen ' + this.currentItemIndex);
  }

  addSelectedItem(point) {
    if (this.currentItemName == 'background') {
      alert('add ' + this.currentItemName + ' ' + this.currentItemIndex);

      let curCell = this.level.field.pointToCell(point);
      let curName = this.arrayBackgrounds[this.currentItemIndex];
      curCell.addToLayer('background', curName);
      redrawCell(curCell);
    }
  }
}
