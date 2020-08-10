import Phaser from '../lib/phaser.js'

export default class Media extends Phaser.Physics.Arcade.Image {

    last = false;
    hitCheck = false;

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
    }

    init(scene, texture, player) {
        this.eye = scene.physics.add.image(this.x, this.y, texture);
        // scene.physics.add.overlap(this, this.eye, this.hitBound, null, this);
        // this.eye.setVelocity(player.x - this.x, player.y - this.y);
        // this.eye.setVelocity(Phaser.Math.Between(-10, 10), Phaser.Math.Between(-500, 500));
        // this.eye.setRotation(-Math.atan((player.x - this.x)/ (player.y - this.y)));

        // scene.graphics = scene.add.graphics();

        scene.curve = new Phaser.Curves.Spline([164, 446, 274, 542, 412, 457, 522, 541, 664, 464]);

        scene.graphics.lineStyle(1, 0x000000, 1);

        scene.curve.draw(scene.graphics, 64);
    
        scene.graphics.fillStyle(0x00ff00, 1);

        this.eye2=scene.add.follower(scene.curve,50,400,texture);

        this.eye2.startFollow(4000);
        // scene.tweens.add({
        //     targets: this.follower,
        //     t: 1,
        //     ease: 'Sine.easeInOut',
        //     duration: 40000,
        //     yoyo: true,
        //     repeat: -1
        // });
    }

    update(time, delta) {
        if (time > this.last) {
            this.last = time + 100;
            this.hitCheck = true;
        } else {
            this.hitCheck = false;
        }

    }

    hitBound(out, inside) {
        if (this.hitCheck) {
            if (Math.abs(out.x - inside.x) > 10 || Math.abs(out.y - inside.y) > 20) {
                this.setEyeVelocity(inside);
                console.log(1)
            }
        }
        // console.log(out.x, inside.x, out.y, inside.y);
    }

    setEyeVelocity(eye) {
        // if (eye.body.velocity.x && eye.body.velocity.y) {
        //     this.eye.setVelocity(Phaser.Math.Between(-10, 0), Phaser.Math.Between(-10, 0));
        // } else if (eye.body.velocity.x) {
        //     this.eye.setVelocity(Phaser.Math.Between(-10, 0), Phaser.Math.Between(0, 10));
        // } else if (eye.body.velocity.y) {
        //     this.eye.setVelocity(Phaser.Math.Between(0, 10), Phaser.Math.Between(-10, 0));
        // } else {
        //     this.eye.setVelocity(Phaser.Math.Between(0, 10), Phaser.Math.Between(0, 10));
        // }
        eye.setVelocity(-eye.body.velocity.x * Math.random() * 2, -eye.body.velocity.y * Math.random() * 2)
    }
}