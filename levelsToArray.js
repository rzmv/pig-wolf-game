// exmaple:: node.js levelsToArray.js mylevels .txt 0 5 globalLevels.js

'use strict';

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