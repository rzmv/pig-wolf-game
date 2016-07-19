Level-editor
To create wolf, click on the field, there it'll appear. To create trajectory for him click
consequently on the cells, with common side. At the end press key 'q', there will be
a message "wolf created".

When you are playing in Level-editor, to return to initial state press the key 'i'.
You can stay at place by pressing 'z'.

All levels are stored in one array in file LEVELS.js
You may create your own level in Level-Editor
After you created a JSON-file with your level you may add it to the LEVELS-array

You need node.js to be installed
Run script addLevelToArray.js with parameters:
  file name(or path to file, if it is not in directory with the script)
  level index(1-based) - new level will take place of index (next levels will move by 1 to the end)

You may also pass string 'all' as second parameter, in that case you will add level to the end

Examples:
  node.exe addLevelToArray.js my-new-created-level.txt end
  will add level to the end

  node.exe addLevelToArray.js MY_LEVELS/my-level.json
  will do the same, but file is stored in folder MY_LEVELS

  node.exe addLevelToArray.js "C:\stuff\levels\latest-level.json" 7
  you will see your level on 7 position
  you may use full-path, no matter forward '/' or backward '\' slash

You can also delete levels
Run script deleteLevelFromArray.js with 1-based index as parameter
If you give program 'all' as parameter, it will delete all levels

Examples:
  node.exe deleteLevelFromArray.js 3
  node.exe deleteLevelFromArray.js all 