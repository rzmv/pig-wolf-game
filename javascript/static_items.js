'use strict';

class StaticItem {
  constructor(name, image, passable = true) {
    this.name = name;
    this.image = image;
    this.visible = true;
    this.passable = passable;
    this.doorPosition = null;
  }

  // return new StaticItem, after pig has visited the cell
  // ItemEmpty can't change state
  nextState() {
    return new ItemEmpty();  
  }

  toogleVisibility() {
    //this.visible = !this.visible;
    return this;  
  }
}

class ItemEmpty extends StaticItem {
  constructor() {
    super('empty', '');
   // this.visible = false;
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
  constructor(doorPosition) {
    super('button', 'images/lock.svg');
    this.doorPosition = doorPosition;
  }

  // !!! ~ image source changes to pressed button 
  nextState() {
    this.image = 'images/unlock.svg';
    
    let cellDoor = currentLevel.field.pointToCell(this.doorPosition);
    cellDoor.openDoor();
    redrawCell(cellDoor);
    return this;
  }

  toogleVisibility() {
    return this;
  }
}

class ItemSnowflake extends StaticItem {
  constructor() {
    super('snowflake', 'images/snowflake.svg');
  }

  nextState() {
    currentLevel.freezeWolves();
    return this;
  }
}

class ItemFire extends StaticItem {
  constructor() {
    super('fire', 'images/fire.svg');
  }

  nextState() {
    currentLevel.defrostWolves();
    return this;
  }
}

class ItemDarkness extends StaticItem {
  constructor() {
    super('darkness', 'images/black.svg');
    this.visibilityRange = 1;
  }

  nextState() {
    currentLevel.turnLightsOff(this.visibilityRange);
    return this;
  }
}

class ItemLamp extends StaticItem {
  constructor() {
    super('lamp', 'images/lamp.svg');
  }

  nextState() {
    currentLevel.turnLightsOn();
    return this;
  }
}
