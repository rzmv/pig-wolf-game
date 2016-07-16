// example node.exe addLevelToArray my-new-created-level.json

'use strict';

let newLevelFileName = process.argv[2];
let fs = require('fs');

let levelsFile = fs.readFileSync('LEVELS.js', 'utf8');
let sqrBracketPos = levelsFile.indexOf('[');
let levels = JSON.parse(levelsFile.substring(sqrBracketPos));

let newLevel = fs.readFileSync(newLevelFileName, 'utf8');

// user gave us 1-based index to insert level
if (process.argv[3] !== 'end') {
  let index = process.argv[3];
  index = Math.min(index, levels.length);
  index = Math.max(index, 1);

  levels.splice(index, 0, newLevel);
}  
else
  levels.push(newLevel);

fs.writeFileSync('LEVELS.js', 'var LEVELS = ' + JSON.stringify(levels));

//expample node.exe levelsToArray.js mylevels .txt 0 5 globalLevels.js
/*
let name = process.argv[2]
let ext = process.argv[3];
let bottom = process.argv[4]
let upper = process.argv[5];
let levelsFileName = process.argv[6];

let fs = require('fs');
let levels = [];

if (!levelsFileName)
  levelsFileName = 'LEVELS.js';
else
  levels = JSON.parse(fs.readFileSync(levelsFileName, 'utf8'));

for (let i = bottom; i <= upper; ++i) { 
  levels.push(fs.readFileSync(name + i + ext, 'utf8'));
}

fs.writeFileSync(levelsFileName, JSON.stringify(levels));
*/