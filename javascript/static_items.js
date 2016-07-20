'use strict';

class StaticItem {
  constructor(name, image, className = '', passable = true) {
    this.name = name;
    this.image = image;
    this.visible = true;
    this.doorPosition = null;
    this.className = className;
    
    this._passable = passable;
    this.passable = () => this._passable;
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
}

class ItemFood extends StaticItem {
  constructor() {
    super('food', 'images/carrot.svg', 'layer-item-food');
  }

  nextState() {
    // we don't need to do this in editor game
    if (isRealGame)
      incrementPoints();
    return new ItemEmpty();
  }
}

class ItemDoor extends StaticItem {
  constructor() {
  // !!! TODO change image to door_opened
    super('door', 'images/door_closed.svg', 'layer-item-door', false);
    this.imagesArray = ['images/door_closed.svg', 'images/door_opened.svg'];
    this.passableArray = [false, true];
    this.currentArrayIndex = 0;
    
    this.passable = () => this.passableArray[this.currentArrayIndex];
  }

  toogle() {
    this.currentArrayIndex = (this.currentArrayIndex + 1) % 2;
    this.image = this.imagesArray[this.currentArrayIndex];    
  }

  nextState() {
    return this;
  }
}

class ItemButton extends StaticItem {
  constructor(doorPosition) {
    super('button', 'images/button_closed.svg', 'layer-item-button');
    this.doorPosition = doorPosition;
    this.imagesArray = ['images/button_closed.svg', 'images/button_opened.svg'];
    this.currentArrayIndex = 0;
  }

  // !!! image doesn't change to pressed button automatically 
  nextState() {
    return this;
  }

  toogleVisibility() {
    return this;
  }

  toogle(cellDoor, buttonItem) {
    // check if there is a wolf in cell with door
    if (cellDoor.layerUnit.length)
      return;

    this.currentArrayIndex = (this.currentArrayIndex + 1) % 2;
    this.image = this.imagesArray[this.currentArrayIndex];    
    
    buttonItem.toogle();
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
