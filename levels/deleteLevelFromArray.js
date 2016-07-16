'use strict';

let fs = require('fs');

let levelsFile = fs.readFileSync('LEVELS.js', 'utf8');
let sqrBracketPos = levelsFile.indexOf('[');
let levels = JSON.parse(levelsFile.substring(sqrBracketPos));

if (process.argv[2] == 'all')
  levels = [];
else {
  let index = process.argv[2];

  if (index < 1 && index > levels.length)
    console.log('ERROR! Type a number from 1 to ' + levels.length);
  else
    levels.splice(index - 1, 1);
}

fs.writeFileSync('LEVELS.js', 'var LEVELS = ' + JSON.stringify(levels));
