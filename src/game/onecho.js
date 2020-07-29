import Phaser from '../lib/phaser.js'

export default class Onecho extends Phaser.Physics.Arcade.Image {

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
    }

    init(scene, texture, player) {
        this.setCircle(110)
        this.ball = scene.physics.add.image(0, 0, texture);
        this.ball.setDataEnabled();
        this.ball.setAngle(0);
        this.ball.data.set('distance', 115);
        this.ball.setCircle(30);
        scene.physics.add.collider(this.ball, player, null, null, this);
        console.log(this.x, this.y, this.ball.angle, this.ball.data.get('distance'))
        this.ball.setPosition(this.x + Math.sin(this.ball.angle) * this.ball.data.get('distance'), this.y + Math.cos(this.ball.angle) * this.ball.data.get('distance'));
    }

    update() {
        this.setRotation(this.ball.angle)
        this.ball.setAngle(Phaser.Math.Angle.Wrap(this.ball.angle + 0.04))
        this.ball.setPosition(this.x + Math.sin(this.ball.angle) * this.ball.data.get('distance'), this.y + Math.cos(this.ball.angle) * this.ball.data.get('distance'));
    }
}