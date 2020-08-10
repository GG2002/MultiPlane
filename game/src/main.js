import Phaser from './lib/phaser.js'

import Game from './scenes/Game.js'

import GameOver from './scenes/GameOver.js'

import Welcome from './scenes/Welcome.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: window.screen.width,
    height: window.screen.height,
    scene: [Welcome,Game, GameOver],
    physics: {
        default: 'arcade',
        arcade:{
            debug:true
        }
    }
})
