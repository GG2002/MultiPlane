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

        this.graphics = scene.add.graphics();

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

        this.path = new Phaser.Curves.Path(50, 500);

        this.path.splineTo([164, 446, 274, 542, 412, 457, 522, 541, 664, 464]);

        this.path.lineTo(700, 300);

        this.path.lineTo(600, 350);

        this.path.ellipseTo(200, 100, 100, 250, false, 0);

        this.path.cubicBezierTo(222, 119, 308, 107, 208, 368);

        this.path.ellipseTo(60, 60, 0, 360, true);

        scene.tweens.add({
            targets: this.follower,
            t: 1,
            ease: 'Sine.easeInOut',
            duration: 40000,
            yoyo: true,
            repeat: -1
        });
    }

    update(time, delta) {
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);

        this.path.draw(this.graphics);

        this.path.getPoint(this.follower.t, this.follower.vec);

        this.graphics.fillStyle(0xff0000, 1);
        this.graphics.fillCircle(this.follower.vec.x, this.follower.vec.y, 12);

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