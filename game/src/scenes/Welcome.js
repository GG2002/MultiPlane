import Phaser from '../lib/phaser.js'


export default class Game extends Phaser.Scene {
    constructor(){
        super('welcome')
    }
    preload(){
        this.load.image('bg', 'assets/18.jpg');
        this.load.image('plane', 'assets/planeH.png');
        this.load.image('anchor', 'assets/anchor.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('onecho_large', 'assets/onecho_large.png');
        this.load.image('onecho_small', 'assets/onecho_small.png');
        this.load.image('media_inside', 'assets/media_inside.png');
        this.load.image('media_out', 'assets/media_out.png');
        this.load.image('office', 'assets/office.png');
        this.load.spritesheet('workshop', 'assets/yan.png', { frameWidth: 216, frameHeight: 220 });
        this.load.spritesheet('editor', 'assets/editor.png', { frameWidth: 222.355, frameHeight: 125 });
        this.load.image('editor1', 'assets/Scene1.gif');
        this.load.audio('fire', 'assets/sfx/ship_fire.wav');
        // this.load.audio('bgm', 'assets/sfx/TechWorldUnite.wav');
        this.load.audio('explosion', 'assets/sfx/explosion01.wav');
    }
    create(){
        const width =this.scale.width
        const height =this.scale.height
        
        this.add.text(width * 0.5,height * 0.5,'Game Over',{
            fontSize:48
        })
        .setOrigin(0.5)

        this.input.keyboard.once('keydown_SPACE',()=>{
            this.scene.start('game')
        })
    }
}