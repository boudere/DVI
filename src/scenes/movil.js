import Button from "../objects/button.js";

export default class Movil extends Phaser.Scene {
	constructor() {
		
		super({ key: 'movil'});
	}

	preload (){
		this.canvas = this.sys.game.canvas;

		// fondo (IMPORTANTE! todo en minusculas y si hay varias palabras separar con guion bajo (esto ultimo no importa, solo es para que quede mas bonito))
		this.load.image('movil', './assets/img/pantallas/movil/movil.png');

		// boton de vuelta
		//this.load.image('goBackBox', './assets/images/escenarios/goBack2.png');

		// botones aplicaciones
		/*this.load.image('banco', './assets/images/movil/melonFlip.png');
		this.load.image('social', './assets/images/movil/circusicon.png');
		this.load.image('cierre', './assets/images/movil/twinbeeicon.png');

		// musiquita de fondo (IMPORTANTE! todo en minusculas y si hay varias palabras separar con guion bajo(esto ultimo no importa, solo es para que quede mas bonito))
		this.load.audio('movil_music', "./assets/sounds/bgm/dogs-and-cats/Dogs_and_Cats.mp3");*/

	}

	create (){

		/*this.music  = this.sound.add("movil_music", { loop: true });
		this.music.play();*/

		const scene = this // referencia a esta misma escena
		// pone el fondo
		let bg = this.add.image(0, 0, 'movil').setScale(1, 1).setOrigin(0, 0);
		bg.depth = -2;

		// boton de vuelta
		//let but1 = new Button(this, 100, 320, ' ', 2, 'goBackBox', { "ClickCallback": () => this.changeScene("Demo", scene) } );

		// boton de melon flip
		//let but2 = new Button(this, 300, 250, ' ', 2, 'melonflip', { "ClickCallback": () => this.changeScene("melonFlippeador", scene) }).setScale(0.75);
		//let but3 = new Button(this, 440, 230, ' ', 2, 'circusIcon', { "ClickCallback": () => {
			//this.scene.start('CircusBoot');
		//}}).setScale(0.20);
		// hay que hacer mil movidas para ajustsar el twinbee y me da pereza XD
		// let but4 = new Button(this, 600, 230, ' ', 2, 'twinbeeIcon', { "ClickCallback": () => {
		// 	this.scene.start('TwinbeeBoot');
		// }}).setScale(0.20);
		/*let dummy = this.add.text(-400,0, "", {
            fontFamily: 'arcade_classic',
            fontSize: 24,
        });*/
	}

	//Solo se utiliza para la música
	update() {
		if(!this.music.isPlaying) {
			this.music.play()
		}
	} 

	changeScene(newScene, escena){
		escena.scene.switch(newScene);
		this.music.pause();
	}
  }