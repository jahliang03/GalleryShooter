class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        //load all assets used
        this.load.setPath("./assets/");
        this.load.image('player', 'bunny2_walk1.png');
        this.load.image('enemy', 'spikeMan_stand.png');
        this.load.image('enemy2', 'flyMan_still_fly.png');
        this.load.image('boss', 'sun1.png');
        this.load.image('carrot', 'carrot.png');
        this.load.audio('shoot', 'footstep_carpet_001.ogg');
    }

    create() {

        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Bunny Shooter<br>space bar - shoot // red enemy - 1 shot<br>flying enemy - 3 shots // sun boss - 15 shots</h2>'
        
        // create ground     
        this.floor = this.add.rectangle(0, this.game.config.height - 20, this.game.config.width * 2, 40, 0x50C878);
        this.physics.add.existing(this.floor, true);
        
        // initialize player sprite
        this.player = this.physics.add.sprite(100, 530, 'player');
        this.player.health = 5;
        this.player.maxHealth = 5;

        //create health bar
        this.healthBars = this.createHealthBars();
        this.healthLabel = this.add.text(52, 20, 'Health:', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        // enemy mobs
        this.enemies = this.physics.add.group();
        this.enemies2 = this.physics.add.group();

        // create carrots for shooting
        this.carrots = this.physics.add.group();
        this.shootSound = this.sound.add('shoot', { volume: 0.5 });

        //create final boss
        this.boss = this.physics.add.group();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // adding collision logic and physics
        this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.collider(this.player, this.enemies2, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.collider(this.carrots, this.enemies, this.handleCarrotEnemyCollision, null, this);
        this.physics.add.collider(this.carrots, this.enemies2, this.handleCarrotEnemyCollision, null, this);
        this.physics.add.collider(this.carrots, this.boss, this.handleCarrotBossCollision, null, this);

        this.roundsCount = 0;
        this.scheduleNextRound();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.shootCarrot();
        }

        this.moveEnemies();
        this.moveBoss();
        
        if (this.player.health <= 0) {
            this.endGame(false);
        }
    }

    // create and update health bar
    createHealthBars() {
        const bars = [];
        for (let i = 0; i < this.player.maxHealth; i++) {
            let x = 10 + i * (35 + 10);
            let healthRect = this.add.graphics({ fillStyle: { color: 0xB667FF } });
            healthRect.fillRect(x, 35, 35, 30);
            bars.push(healthRect);
        }
        return bars;
    }

    updateHealthBar() {
        this.healthBars.forEach((bar, index) => {
            bar.setVisible(index < this.player.health);
        });
    }

    // game conditions to end game
    endGame(win) {
        this.physics.pause();
        const message = win ? 'You Win!' : 'Game Over';
        const text = this.add.text(this.game.config.width / 2, this.game.config.height / 2, message, { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);
    
        // restart button
        const restartButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 60, 'Restart', { fontSize: '32px', fill: '#0f0' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.restart()); // Restart the scene on click
    
        // hover effect for button
        restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#ff0'}));
        restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#0f0'}));
    }

    shootCarrot() {
        const carrot = this.carrots.create(this.player.x + 20, this.player.y - 20, 'carrot');
        carrot.setVelocityX(1000);
        this.shootSound.play(); 
    }

    // enemy related functions 

    spawnEnemies() {
        const numEnemies = Phaser.Math.Between(1, 3);
        for (let i = 0; i < numEnemies; i++) {
            const x = this.game.config.width - i * 100;  // spawn off-screen to the right
            const y = 550;
            const enemy = this.enemies.create(x, y, 'enemy');
            enemy.health = 1;
        }
    }

    spawnMoreEnemies() {
        const numEnemies2 = Phaser.Math.Between(1, 2);
        for (let i = 0; i < numEnemies2; i++) {
            const x = this.game.config.width - i * 100;  // spawn off-screen to the right
            const y = 520;
            const enemy2 = this.enemies2.create(x, y, 'enemy2');
            enemy2.health = 3;
        }
    }
    //functions to move enemies 
    moveEnemies() {
        this.enemies.children.iterate(enemy => {
            this.physics.moveToObject(enemy, this.player, 300);
        });
        this.enemies2.children.iterate(enemy => {
            this.physics.moveToObject(enemy, this.player, 300);
        });
    }

    scheduleNextRound() {
        if (this.roundsCount < 10) {
            this.time.delayedCall(1000, this.spawnEnemies, [], this);
            this.time.delayedCall(2000, this.spawnMoreEnemies, [], this);
            this.time.delayedCall(3000, this.scheduleNextRound, [], this);
            this.roundsCount++;
        } else if (this.roundsCount === 10) {
            this.time.delayedCall(1000, this.spawnBoss, [], this);
        }
    }

    // boss related function 
    spawnBoss() {
        if (this.boss.countActive(true) === 0 && this.allEnemiesDefeated()) {
            const x = this.game.config.width - 100;
            const y = 450;
            const boss = this.boss.create(x, y, 'boss');
            boss.health = 15;
            boss.setScale(2);
            boss.setVelocityX(-200); // enter the screen slowly
        }
    }
    //check for all defeated mobs before boss spawn
    allEnemiesDefeated() {
        return this.enemies.countActive(true) === 0 && this.enemies2.countActive(true) === 0;
    }

    moveBoss() {
        this.boss.children.iterate(boss => {
            this.physics.moveToObject(boss, this.player, 150);
        });
    }

    //collision functions and logic 
    handlePlayerEnemyCollision(player, enemy) {
        player.health -= 1; // decrease player health by 1 on any enemy collision
        enemy.health -= 1; // decrease enemy health by 1 on collision
        player.setVelocity(0); // stops the player's movement on collision
    
        if (enemy.health <= 0) {
            enemy.destroy(); // sestroys enemy if its health is 0 or less
        }
    
        // Check if the enemy is a boss
        if (this.boss.contains(enemy)) {
            if (this.boss.health <= 0) {
                player.health = 0;
                this.endGame(true); // end game as a win if boss is defeated
            }
        }
        this.updateHealthBar(); // update the visual health bar
        if (player.health <= 0) {
            this.endGame(false); // end the game as a loss if player health is 0 or less
        }
    }
    
    handleCarrotEnemyCollision(carrot, enemy) {
        carrot.destroy();
        enemy.health -= 1;
        if (enemy.health <= 0) {
            enemy.destroy();
        }
    }

    handleCarrotBossCollision(carrot, boss) {
        carrot.destroy();
        boss.health -= 1;
        if (boss.health <= 0) {
            boss.destroy();
            this.endGame(true);
        }
    }
}