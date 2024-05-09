class Enemy extends Phaser.Scene {
    constructor() {
        super("enemyScene");
        this.my = {sprite: {}};

        this.bodyX = 900; // Initial position on the right side of the screen
        this.bodyY = 520;
        this.stance = 'walk';
        this.moveSpeed = 2;
        this.counter = 0;
        this.animationSpeed = 10;
        this.health = 1;
        this.maxAppearances = 5;
        this.healthText = null; // Text object for displaying health
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("enemy_jump", "spikeMan_jump.png");
        this.load.image("enemy_walking", "spikeMan_stand.png");
    }

    create() {
        this.my.sprite.body = this.physics.add.sprite(this.bodyX, this.bodyY, "enemy_walking");
        this.my.sprite.stance = this.add.sprite(this.bodyX, this.bodyY, "enemy_jump");
        this.my.sprite.stance.visible = false;

        // Create health text display
        this.healthText = this.add.text(this.my.sprite.body.x - 20, this.my.sprite.body.y - 30, 'Health: ' + this.health, {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
    }

    update() {
        this.moveAndAnimate();

        // Update the position of the health text to follow the enemy
        this.healthText.x = this.my.sprite.body.x;
        this.healthText.y = this.my.sprite.body.y - 30;
    }

    moveAndAnimate() {
        this.counter++;

        if (this.counter % this.animationSpeed === 0) {
            if (this.stance === 'walk') {
                this.my.sprite.stance.visible = true;
                this.my.sprite.body.visible = false;
                this.stance = 'enemy_jump';
            } else {
                this.my.sprite.body.visible = true;
                this.my.sprite.stance.visible = false;
                this.stance = 'walk';
            }
        }

        // Move sprite across the screen to the left
        this.my.sprite.body.x -= this.moveSpeed;
        this.my.sprite.stance.x -= this.moveSpeed;

        // Reset position if it goes off screen to the left
        if (this.my.sprite.body.x < -this.my.sprite.body.width) {
            this.resetEnemyPosition();
        }
    }

    resetEnemyPosition() {
        if (this.appearanceCount < this.maxAppearances) {
            this.my.sprite.body.x = this.sys.game.config.width + this.my.sprite.body.width;
            this.my.sprite.stance.x = this.sys.game.config.width + this.my.sprite.stance.width;
            this.appearanceCount++;
        } else {
            // Once maximum appearances are reached, stop spawning
            this.my.sprite.body.setActive(false).setVisible(false);
            this.my.sprite.stance.setActive(false).setVisible(false);
            this.healthText.setVisible(false); // Hide health text
        }
    }

    onCollisionWithRabbit(enemy, rabbit) {
        this.decreaseHealth();
        rabbit.scene.decreaseHealth(); 
    }

    decreaseHealth() {
        this.health -= 1;
        this.healthText.setText('Health: ' + this.health); // Update health display
        if (this.health <= 0) {
            this.my.sprite.body.destroy();
            this.my.sprite.stance.destroy();
            this.healthText.destroy(); // Destroy the health text display
        }
    }
}
