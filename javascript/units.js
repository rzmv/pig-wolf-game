'use strict';
const point = require('./cells').point;

const initialHealth = 3;
const initialMana = 10;
const initialSpeed = 1;

class Unit {
  constructor(position, speed) {
    this.position = position;
    this.speed = speed || initialSpeed;
  }

  tryMove(position) {
    // TODO: check for movement correctness
    if (true)
      move(position);    
  }

  move(position) {
    this.position = position;      
  }
}

class Pig extends Unit {
  constructor(position, speed, health, mana) {
    super(position, speed);
    this.health = health || initialHealth;
    this.mana = mana || initialMana;
  }

}

class Wolf extends Unit {
  constructor(position, speed, trajectory) {
    super(position, speed);
    this.trajectory = trajectory;
  }
}

/*
// DEBUG
let defaultPig = new Pig(point(0, 0));
console.log(defaultPig);

console.log(new Pig(point(2, 5), 50));

console.log(new Wolf(point(100, 100), 2, [point(100, 100), point(100, 101)])); 
*/
