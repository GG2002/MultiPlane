import Phaser from '../lib/phaser.js'

export default class Office extends Phaser.Physics.Arcade.Image {

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
    }

    init(){
        this.angularV=1+Math.random()*3;
        this.setCircle(110)
    }

    update(){
        this.setAngle(this.angle+this.angularV);
    }
}