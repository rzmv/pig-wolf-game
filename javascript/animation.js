'use strict';

function animateMovement(unit, func, direction)
{
  $('mainTable').rows[unit.position().row].cells[unit.position().col].innerHTML = '';
  unit[func](direction);
  $('mainTable').rows[unit.position().row].cells[unit.position().col].innerHTML = unit.text;              
}

function movePlayer(direction)
{
  animateMovement(globalPig, 'move', direction);
  for (let i = 0; i < globalWolves.length; ++i)
    animateMovement(globalWolves[i], 'move');     
}