class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('player', 'bunny2_walk1.png');
        this.load.image('enemy', 'spikeMan_stand.png');
        this.load.image('enemy2', 'flyMan_still_fly.png');
        this.load.image('boss', 'sun1.png');
        this.load.image('carrot', 'carrot.png');
    }

    create() {
        this.player = this.physics.add.sprite(100, 530, 'player');
        this.player.health = 5;
        this.player.maxHealth = 5;

        this.healthBars = this.createHealthBars();

        this.enemies = this.physics.add.group();
        this.enemies2 = this.physics.add.group();
        this.carrots = this.physics.add.group();
        this.boss = this.physics.add.group();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.collider(this.player, this.enemies2, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.collider(this.carrots, this.enemies, this.handleCarrotEnemyCollision, null, this);
        this.physics.add.collider(this.carrots, this.enemies2, this.handleCarrotEnemyCollision, null, this);
        
        this.physics.add.collider(this.carrots, this.boss, this.handleCarrotBossCollision, null, this);

        this.roundsCount = 0;
        this.scheduleNextRound();
    }

    createHealthBars() {
        const bars = [];
        for (let i = 0; i < this.player.maxHealth; i++) {
            let x = 10 + i * (35 + 10);
            let healthRect = this.add.graphics({ fillStyle: { color: 0xff0000 } });
            healthRect.fillRect(x, 20, 35, 20);
            bars.push(healthRect);
        }
        return bars;
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

    shootCarrot() {
        const carrot = this.carrots.create(this.player.x + 20, this.player.y - 20, 'carrot');
        carrot.setVelocityX(1000);
    }

    moveEnemies() {
        this.enemies.children.iterate(enemy => {
            this.physics.moveToObject(enemy, this.player, 300);
        });
        this.enemies2.children.iterate(enemy => {
            this.physics.moveToObject(enemy, this.player, 300);
        });
    }

    moveBoss() {
        this.boss.children.iterate(boss => {
            this.physics.moveToObject(boss, this.player, 150);
        });
    }

    endGame(win) {
        this.physics.pause();
        const message = win ? 'You Win!' : 'Game Over';
        this.add.text(this.game.config.width / 2, this.game.config.height / 2, message, { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);
    }

    scheduleNextRound() {
        if (this.roundsCount < 1) {
            this.time.delayedCall(1000, this.spawnEnemies, [], this);
            this.time.delayedCall(2000, this.spawnMoreEnemies, [], this);
            this.time.delayedCall(3000, this.scheduleNextRound, [], this);
            this.roundsCount++;
        } else if (this.roundsCount === 1) {
            this.time.delayedCall(1000, this.spawnBoss, [], this);
        }
    }

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

    spawnBoss() {
        if (this.boss.countActive(true) === 0 && this.allEnemiesDefeated()) {
            const x = this.game.config.width - 100;
            const y = 450;
            const boss = this.boss.create(x, y, 'boss');
            boss.health = 15;
            boss.setScale(2);
            boss.setVelocityX(-200); // Enter the screen slowly
        }
    }

    allEnemiesDefeated() {
        return this.enemies.countActive(true) === 0 && this.enemies2.countActive(true) === 0;
    }

    handlePlayerEnemyCollision(player, enemy) {
        player.health -= 1;
        enemy.health -= 1;
        player.setVelocity(0);
        if (enemy.health <= 0) {
            enemy.destroy();
        }
        if(enemy == boss){
            player.destroy(); 
            player.health = 0; 
        }
        this.updateHealthBar();
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

    updateHealthBar() {
        this.healthBars.forEach((bar, index) => {
            bar.setVisible(index < this.player.health);
        });
    }
}
