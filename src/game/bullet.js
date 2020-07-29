import Phaser from '../lib/phaser.js'

export default class Bullet extends Phaser.GameObjects.Sprite {

    /**
    * @param {Phaser.Scene} scene
    * @param {number} x 
    * @param {number} y 
    * @param {string} texture
    */
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
    }

    fire(player, x, y) {
        this.lifespan = 1000;
        this.setDepth(1)
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(player.angle);
        this.setPosition(x, y);
        this.scene.physics.velocityFromAngle(player.angle - 90, player.body.speed+1000, this.body.velocity);
    }

    update(time, delta) {
        this.lifespan -= delta;
        
        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}