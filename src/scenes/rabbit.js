class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");

        // Player Variables
        this.player = { sprite: null, stance: null, health: 5, carrots: null, counter: 0 };
        this.playerX = 90;
        this.playerY = 500;

        // Enemy Variables
        this.enemies = [];
        this.moveSpeed = 2;
        this.maxEnemyAppearances = 5; 
        // Controls
        this.spaceKey = null;

        // Health Text
        this.healthText = null;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("walking", "bunny2_walk1.png");
        this.load.image("normal", "bunny2_walk2.png");
        this.load.image("carrot", "carrot.png");
        this.load.image("enemy_jump", "spikeMan_jump.png");
        this.load.image("enemy_walking", "spikeMan_stand.png");
    }

    create() {
        this.player.sprite = this.physics.add.sprite(this.playerX, this.playerY, "walking");
        this.player.stance = this.add.sprite(this.playerX, this.playerY, "normal");
        this.player.stance.visible = false;

        this.player.carrots = this.physics.add.group();

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.healthText = this.add.text(10, 10, 'Health: ' + this.player.health, { fontSize: '20px', fill: '#fff' });

        this.initializeEnemies();
    }

    initializeEnemies() {
        for (let i = 0; i < this.maxEnemyAppearances; i++) {
            let enemy = this.physics.add.sprite(900 + i * 100, 520, "enemy_walking");
            let enemyStance = this.add.sprite(900 + i * 100, 520, "enemy_jump");
            enemyStance.visible = false;
            this.enemies.push({ sprite: enemy, stance: enemyStance, health: 1, counter: 0 });

            this.physics.add.collider(this.player.sprite, enemy, this.handlePlayerEnemyCollision, null, this);
            this.physics.add.collider(this.player.carrots, enemy, this.handleCarrotHit, null, this);
        }
    }

    update() {
        this.handlePlayerInput();
        this.enemies.forEach(enemy => this.moveAndAnimateEnemy(enemy));
        this.animatePlayer();
    }

    handlePlayerInput() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.shootCarrot();
        }
    }

    shootCarrot() {
        let carrot = this.player.carrots.create(this.player.sprite.x, this.player.sprite.y, 'carrot');
        carrot.setVelocityX(1000);
    }

    moveAndAnimateEnemy(enemy) {
        enemy.counter++;

        if (enemy.counter % 5 === 0) {
            enemy.stance.visible = !enemy.stance.visible;
            enemy.sprite.visible = !enemy.stance.visible;
        }

        enemy.sprite.x -= this.moveSpeed;
        enemy.stance.x = enemy.sprite.x;

        if (enemy.sprite.x < -enemy.sprite.width) {
            enemy.sprite.x = this.sys.game.config.width + enemy.sprite.width;
        }
    }

    animatePlayer() {
        this.player.counter++;

        if (this.player.counter % 5 === 0) {
            this.player.stance.visible = !this.player.stance.visible;
            this.player.sprite.visible = !this.player.stance.visible;
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        this.decreaseHealth();
    }

    handleCarrotHit(carrot, enemy) {
        carrot.destroy();
        enemy.health -= 1;
        if (enemy.health <= 0) {
            enemy.sprite.destroy();
            enemy.stance.destroy();
            enemy.destroy();
        }
    }

    decreaseHealth() {
        this.player.health -= 1;
        this.healthText.setText('Health: ' + this.player.health);
        if (this.player.health <= 0) {
            this.player.sprite.destroy();
            this.endGame();
        }
    }

    endGame() {
        this.physics.pause();
        this.add.text(400, 300, 'Game Over', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);
    }
}
