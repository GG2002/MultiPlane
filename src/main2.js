var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: window.screen.width,
    height: window.screen.height,
    // height: 864,
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
console.log(window.screen, window.screen.availHeight - window.outerHeight + window.innerHeight)
var player;
var graphics;
var cursors;
var text;
var moveCam = false;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('bg','assets/bg_layer1.png');
    this.load.image('bg_head1', 'assets/bg_layer2.png');
    this.load.image('bg_head2', 'assets/bg_layer3.png');
    this.load.image('bg_head3', 'assets/bg_layer4.png');
    this.load.image('block', 'assets/planeH.png');
}

function create() {
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    this.cameras.main.setBounds(-4096, -4096, 8192, 8192);
    this.physics.world.setBounds(-4096, -4096, 8192, 8192);

    this.add.image(-4096, -4096, 'bg_head1').setOrigin(0);
    this.add.image(-2048, -4096, 'bg_head1').setOrigin(0);
    this.add.image(0, -4096, 'bg_head1').setOrigin(0);
    this.add.image(2048, -4096, 'bg_head1').setOrigin(0);
    this.add.image(-4096, -2048, 'bg_head2').setOrigin(0);
    this.add.image(-2048, -2048, 'bg_head2').setOrigin(0);
    this.add.image(0, -2048, 'bg_head2').setOrigin(0);
    this.add.image(2048, -2048, 'bg_head2').setOrigin(0);
    this.add.image(-4096, 0, 'bg_head3').setOrigin(0);
    this.add.image(-2048, 0, 'bg_head3').setOrigin(0);
    this.add.image(0, 0, 'bg_head3').setOrigin(0);
    this.add.image(2048, 0, 'bg_head3').setOrigin(0);
    this.add.image(-4096, 2048, 'bg').setOrigin(0);
    this.add.image(-2048, 2048, 'bg').setOrigin(0);
    this.add.image(0, 2048, 'bg').setOrigin(0);
    this.add.image(2048, 2048, 'bg').setOrigin(0);

    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(0, 0, 'block');

    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player, true);

    this.cameras.main.setDeadzone(50, 50);
    this.cameras.main.setZoom(0.5);

    if (this.cameras.main.deadzone) {
        graphics = this.add.graphics().setScrollFactor(0);
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRect(200, 200, this.cameras.main.deadzone.width, this.cameras.main.deadzone.height);
    }

    text = this.add.text(32, 32).setScrollFactor(0).setFontSize(60).setColor('#fff');;
}

function update() {
    var cam = this.cameras.main;
    var pointer = this.input.activePointer;

    if (cam.deadzone) {
        text.setText([
            'ScrollX: ' + cam.scrollX,
            'ScrollY: ' + cam.scrollY,
            'MidX: ' + cam.midPoint.x,
            'MidY: ' + cam.midPoint.y,
            'player x:' + player.x,
            'player y:' + player.y,
            'player angle:' + player.angle,
            'x: ' + pointer.worldX,
            'y: ' + pointer.worldY,
            'isDown: ' + pointer.isDown,
            'rightButtonDown: ' + pointer.rightButtonDown()
        ]);
    }
    else {
        text.setText([
            'ScrollX: ' + cam.scrollX,
            'ScrollY: ' + cam.scrollY,
            'MidX: ' + cam.midPoint.x,
            'MidY: ' + cam.midPoint.y
        ]);
    }

    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-300);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(300);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-300);
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(300);
    }

    if (pointer.isDown) {
        let ax = pointer.worldX - player.x
        let ay = pointer.worldY - player.y
        if (ax < 0) {
            let angle = 180 * (Math.atan(ay / ax) / Math.PI) - 90
            player.setVelocityX(ax);
            player.setVelocityY(ay);
            player.setAngle(angle)
        } else {
            let angle = 180 * (Math.atan(ay / ax) / Math.PI) + 90
            player.setVelocityX(ax);
            player.setVelocityY(ay);
            player.setAngle(angle)
        }

    }
}
