class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('player', 'bunny2_walk1.png');
        this.load.image('enemy', 'spikeMan_stand.png');
        this.load.image('enemy2', 'flyMan_still_fly.png');
        this.load.image('carrot', 'carrot.png');
    }

    create() {
        this.player = this.physics.add.sprite(100, 530, 'player');
        this.player.health = 5;
        this.player.maxHealth = 5;

        this.healthBars = [];
        for (let i = 0; i < this.player.maxHealth; i++) {
            let x = 10 + i * (35 + 10);
            let healthRect = this.add.graphics({ fillStyle: { color: 0xff0000 } });
            healthRect.fillRect(x, 20, 35, 20);
            this.healthBars.push(healthRect);
        }

        this.enemies = this.physics.add.group();
        this.enemies2 = this.physics.add.group();

        this.carrots = this.physics.add.group();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.collider(this.player, this.enemies2, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.collider(this.carrots, this.enemies, this.handleCarrotEnemyCollision, null, this);
        this.physics.add.collider(this.carrots, this.enemies2, this.handleCarrotEnemyCollision, null, this);

        this.roundsCount = 0;
        this.scheduleNextRound();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            const carrot = this.carrots.create(this.player.x + 20, this.player.y - 20, 'carrot');
            carrot.setVelocityX(1000);
        }

        this.enemies.children.iterate(enemy => {
            this.physics.moveToObject(enemy, this.player, 200);
        });

        this.enemies2.children.iterate(enemy => {
            this.physics.moveToObject(enemy, this.player, 200);
        });

        if (this.player.health <= 0) {
            this.physics.pause();
            this.add.text(450, 300, 'Game Over', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);
        }
    }

    scheduleNextRound() {
        if (this.roundsCount < 10) {
            this.time.delayedCall(2000, this.spawnEnemies, [], this);
            this.time.delayedCall(3000, this.spawnMoreEnemies, [], this);
            // Schedule the next round call after a delay to ensure sequential rounds.
            this.time.delayedCall(3000, this.scheduleNextRound, [], this);
            this.roundsCount++;
        }
    }

    spawnEnemies() {
        const numEnemies = Phaser.Math.Between(1, 3);
        if (numEnemies > 0) { // Only spawn enemy2 if no enemy is present
            for (let i = 0; i < numEnemies; i++) {
                const x = 1000 + i * 100;
                const y = 550;
                const enemy = this.enemies.create(x, y, 'enemy');
                enemy.health = 1;
            }
        } else {
            this.spawnMoreEnemies();
        }
    }

    spawnMoreEnemies() {
        const numEnemies2 = Phaser.Math.Between(1, 2);
        for (let i = 0; i < numEnemies2; i++) {
            const x = 3000 + i * 100;
            const y = 520;
            const enemy2 = this.enemies2.create(x, y, 'enemy2');
            enemy2.health = 3;
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        player.health -= 1;
        enemy.health -= 1;
        player.setVelocity(0);
        if (enemy.health <= 0) {
            enemy.destroy();
        }
        this.updateHealthBar();
        if (player.health <= 0) {
            player.destroy();
        }
    }

    handleCarrotEnemyCollision(carrot, enemy) {
        carrot.destroy();
        enemy.health -= 1;
        if (enemy.health <= 0) {
            enemy.destroy();
        }
    }

    updateHealthBar() {
        this.healthBars.forEach((bar, index) => {
            bar.setVisible(index < this.player.health);
        });
    }
}
