import Phaser from '../lib/phaser.js'

export default class Enemy extends Phaser.Physics.Arcade.Image {

    /**
    * @param {Phaser.Scene} scene
    * @param {number} x 
    * @param {number} y 
    * @param {string} texture
    */
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
    }

    change(x, y, angle) {
        this.setPosition(x, y);
        this.setAngle(angle);
    }

    init(angle,name) {
        this.setAngle(angle);
        this.setDepth(2)
        this.setCollideWorldBounds(true);
        this.setCircle(40);
        this.name = name;
    }

}