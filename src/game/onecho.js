import Phaser from '../lib/phaser.js'

export default class Onecho extends Phaser.Physics.Arcade.Image {

    vx=Phaser.Math.Between(-200,200);
    vy=Phaser.Math.Between(-200,200);
    scale=Phaser.Math.Between(0.7,1.2);
    distance=130;

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
    }

    init(scene, texture, player) {
        this.vx=this.vx>0?this.vx+100:this.vx-100;
        this.vy=this.vy>0?this.vy+100:this.vy-100;
        // this.setScale(this.scale);
        this.setCircle(110*this.scale)
        this.ball = scene.physics.add.image(0, 0, texture);
        this.ball.setDataEnabled();
        this.ball.setAngle(0);
        this.ball.data.set('distance', this.distance*this.scale);
        this.ball.setCircle(40*this.scale);

        scene.physics.add.collider(this.ball, player, null, null, this);
        this.ball.setPosition(this.x + Math.sin(this.ball.angle) * this.ball.data.get('distance'), this.y + Math.cos(this.ball.angle) * this.ball.data.get('distance'));
        this.setVelocity(this.vx,this.vy);
    }

    update() {
        this.setRotation(this.ball.angle)
        this.ball.setAngle(Phaser.Math.Angle.Wrap(this.ball.angle + 0.04))
        this.ball.setPosition(this.x + Math.sin(this.ball.angle) * this.ball.data.get('distance'), this.y + Math.cos(this.ball.angle) * this.ball.data.get('distance'));
    }
}