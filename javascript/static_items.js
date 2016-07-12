'use strict';

class StaticItem {
  constructor(name, text, passable = true) {
    this.name = name;
    this.text = text;
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
    super('wall', 'WALL', false);
  }

  // !!! wolf can pass through wall
  // maybe later we need to turn-off this ability
}

class ItemFood extends StaticItem {
  constructor() {
    super('food', 'FOOD');
  }

  nextState() {
    incrementPoints();
    return new ItemEmpty();
  }
}

class ItemButton extends StaticItem {
  constructor() {
    super('button', 'BUTTON');
  }

  // !!! ~ image source changes to pressed button 
  nextState() {
    this.text = 'PRESSED';
    return this;
  }

  toogleVisibility() {
    return this;
  }
}

class ItemDoor extends StaticItem {
  constructor() {
    super('door', 'DOOR', false);
  }
}
