import Phaser from '../lib/phaser.js'

export default class Office extends Phaser.Physics.Arcade.Image {

    vx=Phaser.Math.Between(-200,200);
    vy=Phaser.Math.Between(-200,200);

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
    }

    init(){
        this.vx=this.vx>0?this.vx+100:this.vx-100;
        this.vy=this.vy>0?this.vy+100:this.vy-100;
        this.angularV=1+Math.random()*3;
        this.setCircle(110)
        this.setVelocity(this.vx,this.vy);
        return this;
    }

    update(){
        this.setAngle(this.angle+this.angularV);
    }
}