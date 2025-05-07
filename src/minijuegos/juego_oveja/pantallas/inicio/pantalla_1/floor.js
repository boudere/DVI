import GamesGameObjects from "/src/minijuegos/games_game_objects.js";

class FloortPantalla1 extends GamesGameObjects {
  constructor(scene, x, y, texture, scalex, scaley) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.setOrigin(0.5, 0.5);
    this.setScale(scalex, scaley);
    this.setDepth(1);
    
    this.setImmovable(true);
    this.body.setAllowGravity(false);

    this.scene.add.existing(this);
  }
}

export default FloortPantalla1;