'use strict';

class Level {
  constructor(field, pig, wolves = []) {
    this.field = field;
    this.pig = pig;
    this.wolves = wolves;
    this.init();
  }

  init() {
    this.points = 0;
    // !!! add this.maxPoints = all carrots on the field
    for (let i = 0; i < this.wolves.length; ++i)
      this.wolves[i].addTrajectoryLayerToField(this.field);
  }

  loadFromFile(fileName) {
    
  }

  showJSON(fileName) {
    let level = {
      'field': this.field,
      'pig': this.pig,
      'wolves': this.wolves,
    };

    let textArea = document.createElement('textarea');
    textArea.id = 'JSONTextArea';
    textArea.appendChild(document.createTextNode(JSON.stringify(level)));
    textArea.setAttribute('rows', 100);
    textArea.setAttribute('cols', 100);

    document.body.appendChild(textArea);

    //output.write(JSON.stringify(level));
  }
}
