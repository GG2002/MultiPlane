import Phaser from '../lib/phaser.js'

import Bullet from '../game/bullet.js';

import Enemy from '../game/enemy.js';

import Onecho from '../game/onecho.js';

import Office from '../game/office.js';

import Media from '../game/media.js';

export default class Game extends Phaser.Scene {

    MAXVELOCITY = 600;
    MINVELOCITY = 400;
    ACCELERATE = 300;

    ws;
    player;
    planeFire;
    graphics;

    cursors;
    fireKey;
    text;
    moveCam = false;

    ax = 0;
    ay = 0;
    vx = 0;
    vy = 0;
    angle = 0;
    maxVelocity = 0;
    fire = false;

    bullets;

    constructor() {
        super('game')
    }

    preload() {
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

    create() {
        // let bgm = this.sound.add('bgm');
        // let loopMarker = { name: 'loop', config: { loop: true } };
        // bgm.addMarker(loopMarker);
        // bgm.play('loop');
        this.enemies = this.physics.add.group({
            classType: Enemy
        })
        this.ws = new WebSocket("ws://59.110.40.182:2002");
        // this.ws = new WebSocket("ws://127.0.0.1:2002");
        // this.ws = new WebSocket("ws://127.0.0.1:2000");
        this.ws.onopen = function () {
        };
        this.ws.onmessage = e => {
            let reader = new FileReader();
            reader.onload = () => {
                let buffer = new Float32Array(reader.result);
                const [x, y, angle, fire, name] = buffer;
                // console.log(buffer);
                let enemyExisted = false;

                this.enemies.children.iterate(child => {
                    if (child != null) {
                        const enemy = child;
                        if (enemy.name == name) {
                            enemyExisted = true;
                            enemy.change(x, y, angle);
                            enemy.fire = fire;
                        }
                    }
                })
                if (!enemyExisted) {
                    let enemy = this.enemies.get(x, y, 'plane');
                    enemy.init(angle, name);
                }
            }
            reader.readAsArrayBuffer(e.data);
            // console.info(reader.result)
            // const { x, y, angle, name, fire } = JSON.parse(e.data);

        };
        // let enemy = enemies.get(0, 100, 'plane');
        // enemy.setDepth(2)
        // enemy.setCollideWorldBounds(true);
        // enemy.setCircle(40);
        // enemy.setAngle(180)
        // enemy.fire = true


        this.cameras.main.setBounds(-4096, -4096, 8192, 8192);
        this.physics.world.setBounds(-4096, -4096, 8192, 8192);
        for (let i = -4096; i < 4096; i += 1024) {
            for (let j = -4096; j < 4096; j += 1024) {
                this.add.image(i, j, 'bg').setOrigin(0);
            }
        }


        this.player = this.physics.add.image(0, 500, 'plane');
        this.player.setDepth(2)
        this.player.setCircle(40)
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(1);

        // console.log(enemy, this.player)
        this.player.setDataEnabled()
        this.player.data.set('ax', 0)
        this.player.data.set('ay', 0)
        this.player.data.set('vx', 0)
        this.player.data.set('vy', 0)
        this.player.data.set('sx', 0)
        this.player.data.set('sy', 0)
        this.player.data.set('lastFired', 0)
        this.player.data.set('sendCoordinate', 0)


        this.bullets = this.physics.add.group({
            classType: Bullet,
            // maxSize:30,
            runChildUpdate: true
        })

        this.enemyBullets = this.physics.add.group({
            classType: Bullet,
            // maxSize:30,
            runChildUpdate: true
        })

        this.onecho = this.physics.add.group({
            classType: Onecho,
            maxSize: 5,
            runChildUpdate: true,
        })

        this.office = this.physics.add.group({
            classType: Office,
            maxSize: 10,
            runChildUpdate: true,
        })

        this.media = this.physics.add.group({
            classType: Media,
            maxSize: 20,
            runChildUpdate: true,
        })


        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('workshop', { start: 0, end: 3 }),
            frameRate: 24,
            repeat: -1,
        })
        let workshop = this.physics.add.sprite(100, 500, 'workshop');
        workshop.anims.play('fly');
        workshop.setVelocity(200, -200);

        this.anims.create({
            key: 'cat',
            frames: this.anims.generateFrameNumbers('editor', { start: 0, end: 33 }),
            frameRate: 24,
            repeat: -1,
        })
        let editor = this.physics.add.sprite(100, 600, 'editor');
        editor.anims.play('cat');
        // editor.setVelocity(300,0)
        editor.setScale(1.5)

        this.anchor = this.physics.add.image(0, 0, 'anchor');
        this.anchor.setScale(0.015, 0.015);
        this.anchor.setDepth(3);
        this.anchor.setDataEnabled();
        this.anchor.data.set('angle', 0);
        this.anchor.data.set('cx', 0);
        this.anchor.data.set('cy', 0);

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(0.5);

        this.text = this.add.text(32, 32).setScrollFactor(0).setFontSize(60).setColor('#fff');;
        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.graphics = this.add.graphics()

        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.bullets, this.office, this.hitEnemy, null, this);
        this.physics.add.overlap(this.bullets, this.onecho, this.hitEnemy, null, this);
        this.physics.add.overlap(this.enemyBullets, this.player, this.hittedByEnemy, null, this);
        this.physics.add.overlap(this.enemyBullets, this.office, this.hittedByEnemy, null, this);
        this.physics.add.overlap(this.enemyBullets, this.onecho, this.hittedByEnemy, null, this);
        this.physics.add.collider(this.onecho, this.player, this.hittedByBarrier, null, this);
        this.physics.add.collider(this.office, this.player, this.hittedByBarrier, null, this);


        // this.onecho.get(0, 0, 'onecho_large').init(this, 'onecho_small', this.player);
        for (let i = 0; i < this.onecho.maxSize; i++) {
            let onecho = this.onecho.get(Phaser.Math.Between(-0, 0), Phaser.Math.Between(-0, 0), 'onecho_large').init(this, 'onecho_small', this.player);
            this.physics.add.collider(onecho.ball, this.player, this.hittedByBarrierBall, null, this);
        }
        for (let i = 0; i < this.office.maxSize; i++) {
            this.office.get(Phaser.Math.Between(-0, 0), Phaser.Math.Between(-0, 0), 'office').init();
        }
        this.media.get(-400, 700, 'media_out').init(this, 'media_inside', this.player);

    }

    update(time, delta) {
        const cam = this.cameras.main;
        const pointer = this.input.activePointer;

        this.bullets.children.iterate(child => {
            const bullet = child;
            if (bullet != undefined) {
                if (!bullet.visible) {
                    this.physics.world.disableBody(bullet.body);
                    this.bullets.remove(bullet);
                }
            }
        })
        this.enemyBullets.children.iterate(child => {
            const bullet = child;
            if (bullet != null) {
                if (!bullet.visible) {
                    this.physics.world.disableBody(bullet.body);
                    this.enemyBullets.remove(bullet);
                }
            }
        })
        this.onecho.children.iterate(child => {
            let onecho = child;
            if (Math.abs(onecho.x) > 4096) {
                onecho.setPosition(Phaser.Math.Between(-4096, 4096), onecho.y > 0 ? -4096 : 4096);
            }
            if (Math.abs(onecho.y) > 4096) {
                onecho.setPosition(onecho.x > 0 ? -4096 : 4096, Phaser.Math.Between(-4096, 4096));
            }
            if (!onecho.visible) {
                onecho.setPosition(Phaser.Math.Between(-4096, 4096), onecho.y > 0 ? -4096 : 4096);
            }
        })
        this.office.children.iterate(child => {
            let office = child;
            if (Math.abs(office.x) > 4096) {
                office.setPosition(Phaser.Math.Between(-4096, 4096), office.y > 0 ? -4096 : 4096);
            }
            if (Math.abs(office.y) > 4096) {
                office.setPosition(office.x > 0 ? -4096 : 4096, Phaser.Math.Between(-4096, 4096));
            }
            if (!office.visible) {
                office.setPosition(Phaser.Math.Between(-4096, 4096), office.y > 0 ? -4096 : 4096);
            }
        })

        this.player.setVelocity(0);

        //鼠标导航灰机
        // if (pointer.isDown) 
        {
            let dx, dy, d, px, py;
            //检测光标是否移动，未移动则由相机的相对坐标求得光标的坐标，移动则更新光标的坐标
            if (this.player.data.get('sx') == pointer.worldX && this.player.data.get('sy') == pointer.worldY) {
                px = this.anchor.data.get('cx') + cam.midPoint.x;
                py = this.anchor.data.get('cy') + cam.midPoint.y;
            } else {
                px = pointer.worldX;
                py = pointer.worldY;
                this.anchor.data.set('cx', px - cam.midPoint.x);
                this.anchor.data.set('cy', py - cam.midPoint.y);
            }
            dx = px - this.player.x;
            dy = py - this.player.y;
            d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            this.maxVelocity = d * 1.5 > this.MAXVELOCITY ? this.MAXVELOCITY : d * 1.5
            if (this.maxVelocity < this.player.data.get('maxVelocity')) {
                this.maxVelocity = this.maxVelocity > this.MINVELOCITY ? this.maxVelocity : this.MINVELOCITY;
            }
            this.ax = dx / this.ACCELERATE;
            this.ay = dy / this.ACCELERATE;
            this.vx = this.player.data.get('vx') + this.ax;
            this.vy = this.player.data.get('vy') + this.ay;
            this.player.data.set('ax', this.ax);
            this.player.data.set('ay', this.ay);
            this.player.data.set('sx', pointer.worldX);
            this.player.data.set('sy', pointer.worldY);
            this.player.data.set('maxVelocity', this.maxVelocity)
            this.player.data.set('vx', this.vx);
            this.player.data.set('vy', this.vy);
            this.anchor.setPosition(px, py);
            this.anchor.setAngle(this.anchor.data.get('angle') + 10);
            this.anchor.data.set('angle', this.anchor.angle);

            // //检测灰机速度
            let v = Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
            let cos = this.vx / v;
            let sin = this.vy / v;
            if ((this.vx > 0 && this.vx > this.maxVelocity * cos) || (this.vy > 0 && this.vy > this.maxVelocity * sin)) {
                this.player.data.set('vx', this.maxVelocity * cos)
                this.player.data.set('vy', this.maxVelocity * sin)
            }
            if ((this.vx < 0 && this.vx < this.maxVelocity * cos) || (this.vy < 0 && this.vy < this.maxVelocity * sin)) {
                this.player.data.set('vx', this.maxVelocity * cos)
                this.player.data.set('vy', this.maxVelocity * sin)
            }

            //更新灰机角度
            if (this.ax < 0) {
                this.angle = 180 * (Math.atan(this.ay / this.ax) / Math.PI) - 90;
            } else {
                this.angle = 180 * (Math.atan(this.ay / this.ax) / Math.PI) + 90;
            }

            //更新灰机角度速度
            this.player.setVelocityX(this.vx);
            this.player.setVelocityY(this.vy);
            this.player.setAngle(this.angle);
            if (Math.abs(this.player.x) >= Math.abs(this.physics.world.bounds.x) - 44) {
                console.log(1);
                if (this.player.x < 0) {
                    this.player.data.set('vx', this.vx > 0 ? this.vx : -0.7 * this.vx);
                } else {
                    this.player.data.set('vx', this.vx < 0 ? this.vx : -0.7 * this.vx);
                }
            }
            if (Math.abs(this.player.y) >= Math.abs(this.physics.world.bounds.y) - 44) {
                if (this.player.y < 0) {
                    this.player.data.set('vy', this.vy > 0 ? this.vy : -0.7 * this.vy);
                } else {
                    this.player.data.set('vy', this.vy < 0 ? this.vy : -0.7 * this.vy);
                }
            }

            this.graphics.clear()
            this.graphics.lineStyle(4, 0xff0000)
            this.graphics.lineBetween(this.player.x, this.player.y, this.player.x + this.ax * this.ACCELERATE, this.player.y + this.ay * this.ACCELERATE)
        }

        {
            this.text.setText([
                // 'ScrollX: ' + cam.scrollX,
                // 'ScrollY: ' + cam.scrollY,
                // 'MidX: ' + cam.midPoint.x,
                // 'MidY: ' + cam.midPoint.y,
                'this.player x:' + this.player.x,
                'this.player y:' + this.player.y,
                'this.world boundx' + this.physics.world.bounds.x,
                // 'this.player angle:' + this.angle,
                // 'this.player vangle' + Phaser.Math.RadToDeg(Math.atan(this.player.body.velocity.y / this.player.body.velocity.x)),
                'this.player vx:' + this.player.body.velocity.x,
                'this.player vy:' + this.player.body.velocity.y,
                'this.player speed:' + this.player.body.speed,
                // 'x: ' + pointer.worldX,
                // 'y: ' + pointer.worldY,
                // 'isDown: ' + pointer.isDown,
                // 'rightButtonDown: ' + pointer.rightButtonDown()
            ]);
        }

        this.fire = false;
        if (this.fireKey.isDown && time > this.player.data.get('lastFired')) {

            this.bullets.get(0, 0, 'bullet').fire(this.player, this.player.x - 27 * Math.cos(Phaser.Math.DegToRad(this.angle)), this.player.y - 27 * Math.sin(Phaser.Math.DegToRad(this.angle)))
            this.sound.play('fire')
            this.bullets.get(0, 0, 'bullet').fire(this.player, this.player.x + 27 * Math.cos(Phaser.Math.DegToRad(this.angle)), this.player.y + 27 * Math.sin(Phaser.Math.DegToRad(this.angle)))
            this.sound.play('fire')
            this.player.data.set('lastFired', time + 200);
            this.fire = true;
        }
        this.enemies.children.iterate(child => {
            if (child != null) {
                let enemy = child;
                if (enemy.fire) {
                    this.enemyBullets.get(0, 0, 'bullet').fire(enemy, enemy.x - 27 * Math.cos(Phaser.Math.DegToRad(enemy.angle)), enemy.y - 27 * Math.sin(Phaser.Math.DegToRad(enemy.angle)))
                    this.enemyBullets.get(0, 0, 'bullet').fire(enemy, enemy.x + 27 * Math.cos(Phaser.Math.DegToRad(enemy.angle)), enemy.y + 27 * Math.sin(Phaser.Math.DegToRad(enemy.angle)))
                }
                enemy.fire = false;
            }
        })


        if (this.ws.readyState == 1) {
            if (this.fire || time > this.player.data.get('sendCoordinate')) {
                let buffer = new ArrayBuffer(16);
                let msg = new Float32Array(buffer);
                msg[0] = this.player.x;
                msg[1] = this.player.y;
                msg[2] = this.angle;
                msg[3] = this.fire;
                // let msg=new Blob([JSON.stringify({
                //     'x': this.player.x,
                //     'y': this.player.y,
                //     'angle': this.angle,
                //     'fire': this.fire
                // })]);
                this.ws.send(msg);
                // console.log(msg);
                this.player.data.set('sendCoordinate', time + 10)
            }
        }

    }

    hitEnemy(bullet, enemy) {
        this.sound.play('explosion')
        this.bullets.killAndHide(bullet);
        this.physics.world.disableBody(bullet.body)
    }

    hittedByEnemy(player, bullet) {
        this.sound.play('explosion')
        this.enemyBullets.killAndHide(bullet);
        this.physics.world.disableBody(bullet.body);
    }

    hittedByBarrierBall(ball, player) {
        this.hittedByCircle(player, ball);
    }

    hittedByBarrier(player, barrier) {
        barrier.setVelocity(barrier.vx, barrier.vy);
        this.hittedByCircle(player, barrier);
    }

    hittedByCircle(player, barrier) {
        let dx = player.x - barrier.x;
        let dy = player.y - barrier.y;
        let vx = player.data.get('vx');
        let vy = player.data.get('vy');
        let angle1 = this.v_acrtan(vx, vy);
        let angle2 = this.d_arctan(dx, dy);
        let speed = player.body.speed;
        let vBounce = Math.abs(1.7 * speed * Math.cos(angle1 - angle2));

        vBounce = vBounce > 200 ? vBounce : 200;

        if (vx < 0) {
            player.data.set('vx', vx + Math.abs(vBounce * Math.cos(angle2)));
        } else {
            player.data.set('vx', vx - Math.abs(vBounce * Math.cos(angle2)));
        }
        if (vy < 0) {
            player.data.set('vy', vy + Math.abs(vBounce * Math.sin(Math.abs(angle2))));
        } else {
            player.data.set('vy', vy - Math.abs(vBounce * Math.sin(Math.abs(angle2))));
        }
        player.setVelocity(vx - vBounce * Math.cos(angle2), vy - vBounce * Math.sin(Math.abs(angle2)));
    }

    d_arctan(dx, dy) {
        let angle;
        if (dx > 0) {
            angle = Math.atan(dy / dx) + Math.PI;
        } else {
            angle = Math.atan(dy / dx);
        }
        return angle < Math.PI ? angle : angle - 2 * Math.PI;
    }

    v_acrtan(vx, vy) {
        let angle;
        if (vx > 0) {
            angle = Math.atan(vy / vx);
        } else {
            angle = Math.atan(vy / vx);
            angle = angle > 0 ? angle - Math.PI : angle + Math.PI;
        }
        return angle;
    }
}