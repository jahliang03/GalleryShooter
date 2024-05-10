"use strict";

// Game configuration
let config = {
    type: Phaser.CANVAS,
    parent: 'phaser-game',
    width: 1000,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Set to true to see physics boundaries
        }
    },
    scene: [MainScene]
};

window.onload = function() {
    const game = new Phaser.Game(config);
    game.scene.start('MainScene');
    //game.scene.start('enemyScene'); // Ensure it starts and runs in parallel
};