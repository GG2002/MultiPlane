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
        this.load.image('bg', 'assets/231.png');
        this.load.image('plane', 'assets/planeH.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('onecho_large', 'assets/onecho_large.png');
        this.load.image('onecho_small', 'assets/onecho_small.png');
        this.load.image('media_inside', 'assets/media_inside.png');
        this.load.image('media_out', 'assets/media_out.png');
        this.load.image('office', 'assets/office.png');
        this.load.audio('fire', 'assets/sfx/ship_fire.wav');
        this.load.audio('bgm', 'assets/sfx/TechWorldUnite.wav');
        this.load.audio('explosion', 'assets/sfx/explosion01.wav');
    }

    create() {
        let bgm = this.sound.add('bgm');
        let loopMarker = { name: 'loop', config: { loop: true } };
        bgm.addMarker(loopMarker);
        // bgm.play('loop');
        let enemies = this.physics.add.group({
            classType: Enemy
        })
        this.ws = new WebSocket("ws://59.110.40.182:2002");
        // this.ws = new WebSocket("ws://127.0.0.1:2347");
        // this.ws = new WebSocket("ws://127.0.0.1:2000");
        this.ws.onopen = function () {
        };
        this.ws.onmessage = function (e) {
            const { x, y, angle, name, fire } = JSON.parse(e.data);
            let enemyExisted = false;

            enemies.children.iterate(child => {
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
                let enemy = enemies.get(x, y, 'plane');
                enemy.init(angle, name);
            }
        };
        // let enemy = enemies.get(0, 100, 'plane');
        // enemy.setDepth(2)
        // enemy.setCollideWorldBounds(true);
        // enemy.setCircle(40);
        // enemy.setAngle(180)
        // enemy.fire = true
        this.enemies = enemies;

        this.cameras.main.setBounds(-4096, -4096, 8192, 8192);
        this.physics.world.setBounds(-4096, -4096, 8192, 8192);
        for (let i = -4096; i < 4096; i += 300) {
            for (let j = -4096; j < 4096; j += 300) {
                this.add.image(i, j, 'bg').setOrigin(0);
            }
        }


        this.player = this.physics.add.image(0, 500, 'plane');
        this.player.setDepth(2)
        this.player.setCollideWorldBounds(true);
        this.player.setCircle(40)

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
            maxSize: 20,
            runChildUpdate: true,
        })

        this.office = this.physics.add.group({
            classType: Office,
            maxSize: 20,
            runChildUpdate: true,
        })

        this.media = this.physics.add.group({
            classType: Media,
            maxSize: 20,
            runChildUpdate: true,
        })

        this.onecho.get(0, 0, 'onecho_large').init(this, 'onecho_small', this.player);
        this.office.get(400, 500, 'office').init();
        this.media.get(-400, 700, 'media_out').init(this, 'media_inside', this.player);

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(0.5);

        this.text = this.add.text(32, 32).setScrollFactor(0).setFontSize(60).setColor('#000');;
        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.graphics = this.add.graphics()

        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.collider(this.enemyBullets, this.player, this.hittedByEnemy, null, this);
        this.physics.add.collider(this.onecho, this.player, this.hittedByBarrier, null, this);
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

        this.player.setVelocity(0);

        //鼠标导航灰机
        if (pointer.isDown) {

            //检测光标是否移动，未移动则保持加速度，移动则更新
            if (this.player.data.get('sx') == pointer.worldX && this.player.data.get('sy') == pointer.worldY) {
                this.ax = this.player.data.get('ax');
                this.ay = this.player.data.get('ay');
                this.vx = this.player.data.get('vx') + this.ax;
                this.vy = this.player.data.get('vy') + this.ay;
                this.maxVelocity = this.player.data.get('maxVelocity');
            } else {
                let dx = pointer.worldX - this.player.x;
                let dy = pointer.worldY - this.player.y;
                let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
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
            }
            this.player.data.set('vx', this.vx);
            this.player.data.set('vy', this.vy);

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

            this.graphics.clear()
            this.graphics.lineStyle(2, 0xff0000)
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
                'this.player angle:' + Math.cos(this.angle),
                'this.player vx:' + this.player.body.velocity.x,
                'this.player vy:' + this.player.body.velocity.y,
                'x: ' + pointer.worldX,
                'y: ' + pointer.worldY,
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
                this.ws.send(JSON.stringify({
                    'x': this.player.x,
                    'y': this.player.y,
                    'angle': this.angle,
                    'fire': this.fire
                }))
                this.player.data.set('sendCoordinate', time + 60)
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

    hittedByBarrier(barrier, player) {
        console.log(arguments)
    }
}