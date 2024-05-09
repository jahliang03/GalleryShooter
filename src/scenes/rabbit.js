class Player extends Phaser.Scene {
    constructor() {
        super("rabbitScene");
        this.player = {sprite: {}};

        this.bodyX = 90;
        this.bodyY = 500;
        this.stance = 'walk'; 
        this.carrots = [];
        this.counter = 0;
        this.animationSpeed = 5;
        this.health = 5;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("walking", "bunny2_walk1.png");
        this.load.image("normal", "bunny2_walk2.png");
        this.load.image("carrot", "carrot.png");

    }

    create() {
        this.player.sprite.body = this.physics.add.sprite(this.bodyX, this.bodyY, "walking");
        this.player.sprite.stance = this.add.sprite(this.bodyX, this.bodyY, "normal");
        this.player.sprite.stance.visible = false;

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.healthText = this.add.text(10, 10, 'Health: ' + this.health, { fontSize: '20px', fill: '#fff' });

        let enemyScene = this.scene.get('enemyScene');  // Assumed enemyScene is properly initialized and accessible
        //this.physics.add.collider(this.player.sprite.body, enemyScene.player.sprite.body, this.handleContact, null, this);
    }

    update() {
        this.counter++;

        if (this.counter % this.animationSpeed == 0) {
            if (this.stance === 'walk') {
                this.player.sprite.stance.visible = true;
                this.player.sprite.body.visible = false;
                this.stance = 'normal'; // Change stance to normal
            } else {
                this.player.sprite.body.visible = true;
                this.player.sprite.stance.visible = false;
                this.stance = 'walk'; // Change stance to walk
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.shootCarrot();
        }
    }

    shootCarrot() {
        let carrot = this.physics.add.sprite(this.player.sprite.body.x, this.player.sprite.body.y, 'carrot');
        carrot.setVelocityX(1000);
        this.carrots.push(carrot);
    }

    handleContact() {
        this.decreaseHealth();
    }

    decreaseHealth() {
        this.health -= 1;
        this.healthText.setText('Health: ' + this.health);
        if (this.health <= 0) {
            this.player.sprite.visible = false; // Hide the sprite
            this.endGame(); // Call end game scenario
        }
    }

    endGame() {
        this.physics.pause(); // Stop physics to prevent further movement/collision
        this.add.text(400, 300, 'Game Over', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);
    }
}