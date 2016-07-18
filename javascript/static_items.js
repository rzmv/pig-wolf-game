'use strict';

class StaticItem {
  constructor(name, image, className = '', passable = true) {
    this.name = name;
    this.image = image;
    this.visible = true;
    this.passable = passable;
    this.doorPosition = null;
    this.className = className;
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
    super('wall', 'images/brick-tile-150-sew.jpg' , 'layer-item-wall', false);
  }

  // !!! wolf can pass through wall
  // maybe later we need to turn-off this ability
  // on the other hand it's all on level-designer desires
}

class ItemFood extends StaticItem {
  constructor() {
    super('food', 'images/carrot.svg', 'layer-item-food');
  }

  nextState() {
    incrementPoints();
    return new ItemEmpty();
  }
}

class ItemDoor extends StaticItem {
  constructor() {
    super('door', 'images/door.svg', 'layer-item-door', false);
  }
}

class ItemButton extends StaticItem {
  constructor(doorPosition) {
    super('button', 'images/lock.svg', 'layer-item-button');
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
    super('snowflake', 'images/snowflake.svg', 'layer-item-fire-snow');
  }

  nextState() {
    currentLevel.freezeWolves();
    return this;
  }
}

class ItemFire extends StaticItem {
  constructor() {
    super('fire', 'images/fire.svg', 'layer-item-fire-snow');
  }

  nextState() {
    currentLevel.defrostWolves();
    return this;
  }
}

class ItemBlackButton extends StaticItem {
  constructor() {
    super('blackButton', 'images/black-marble.jpg', 'layer-item-map');
    this.visibilityRange = 1;
  }

  nextState() {
    currentLevel.turnLightsOff(this.visibilityRange);
    return this;
  }
}

class ItemLamp extends StaticItem {
  constructor() {
    super('lamp', 'images/lamp.svg', 'layer-item-map');
  }

  nextState() {
    currentLevel.turnLightsOn();
    return this;
  }
}
