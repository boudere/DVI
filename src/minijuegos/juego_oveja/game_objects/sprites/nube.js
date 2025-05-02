import GamesGameObjects from "/src/minijuegos/games_game_objects.js";
 
 class Nube extends GamesGameObjects {
     constructor(scene, x, y, distancia, num=null) {
         let NUBE_IMG = 'nube';
         
         let data_info = {
             "cerca": {
                 "x": 0,
                 "y": 0.35,
                 "nubes": [3, 5],
                 "velocity": 100
             },
             "media": {
                 "x": 0,
                 "y": 0.18,
                 "nubes": [1, 2],
                 "velocity": 80
             },
             "lejos": {
                 "x": 0,
                 "y": 0.08,
                 "nubes": [1, 2, 4],
                 "velocity": 50
             }
         };
 
         num = num || Phaser.Math.RND.pick(data_info[distancia].nubes);
         NUBE_IMG += num;
         super(scene, x, y * data_info[distancia].y, NUBE_IMG);
         this.data_info = data_info;
         this.distancia = distancia;
         this.body.setAllowGravity(false);
     }
 
     enter() {
         super.enter();
 
         this.setVelocityX(this.data_info[this.distancia].velocity * -1);
     }
 
     exit() {
         super.exit();
     }
 
     _update(time, delta) {
         super._update(time, delta);
     }
 
     _set_event(event) {
         super._set_event(event);
     }
 
     _remove_event(event) {
         super._remove_event(event);
     }
 
     _set_colliders(size_x = 0.8, size_y = 0.8) {}
 }
 
 export default Nube;