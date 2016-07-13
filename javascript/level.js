'use strict';

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                return rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}

var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

function loadFile() {
    reader.open('get', 'test.txt', true); 
    reader.onreadystatechange = displayContents;
    reader.send(null);
}

function displayContents() {
    if(reader.readyState==4) {
        var el = document.getElementById('main');
        el.innerHTML = reader.responseText;
    }
}


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

  saveToFile(fileName) {
    let level = {
      'field': this.field,
      'pig': this.pig,
      'wolves': this.wolves,
    }
    
    loadFile();
    alert(reader.responseText);

    var fr = new FileReader();
    let s;
    fr.onload = function () {s = this.result; };
    alert(s);

    alert('before making');
    //let s = readTextFile("C:/" + fileName);
    //makeTextFile('123jsonqwerty');
    //alert('success ' + s);
    
    //output.write(JSON.stringify(level));
  }
}
