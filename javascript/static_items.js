'use strict';

class StaticItem {
  constructor(name, image, passable = true) {
    this.name = name;
    this.image = image;
    this.visible = true;
    this.passable = passable;
  }

  // return new StaticItem, after pig has visited the cell
  // ItemEmpty can't change state
  nextState() {
    return new ItemEmpty();  
  }

  toogleVisibility() {
    this.visible = !this.visible;
    return this;  
  }
}

class ItemEmpty extends StaticItem {
  constructor() {
    super('empty', '');
    this.visible = false;
  }

  nextState() {
    return this;
  }

  toogleVisibility() {
    return this;
  }
}

class ItemWall extends StaticItem {
  constructor() {
    super('wall', 'images/wall.svg' , false);
  }

  // !!! wolf can pass through wall
  // maybe later we need to turn-off this ability
}

class ItemFood extends StaticItem {
  constructor() {
    super('food', 'images/carrot.svg');
  }

  nextState() {
    incrementPoints();
    return new ItemEmpty();
  }
}

class ItemDoor extends StaticItem {
  constructor() {
    super('door', 'images/door.svg', false);
  }
}

class ItemButton extends StaticItem {
  constructor(cellDoor) {
    super('button', 'images/Button.svg');
    this.cellDoor = cellDoor;
  }

  // !!! ~ image source changes to pressed button 
  nextState() {
    this.image = 'images/Button.svg';
    this.cellDoor.visit(globalPig);
    return this;
  }

  toogleVisibility() {
    return this;
  }
}
