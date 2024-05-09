class Rabbit extends Phaser.Scene {
    constructor() {
        super("rabbitScene");
        this.my = {sprite: {}};

        this.bodyX = 90;
        this.bodyY = 500;
        this.stance = 'walk'; 
        this.carrots = [];
        this.counter = 0;
        this.animationSpeed = 10;
        this.health = 5;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("walking", "bunny2_walk1.png");
        this.load.image("normal", "bunny2_walk2.png");
        this.load.image("carrot", "carrot.png");
    }

    create() {
        this.my.sprite.body = this.physics.add.sprite(this.bodyX, this.bodyY, "walking");
        this.my.sprite.stance = this.add.sprite(this.bodyX, this.bodyY, "normal");
        this.my.sprite.stance.visible = false;

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.healthText = this.add.text(10, 10, 'Health: ' + this.health, { fontSize: '20px', fill: '#fff' });

        let enemyScene = this.scene.get('enemyScene');  // Assumed enemyScene is properly initialized and accessible
        this.physics.add.collider(this.my.sprite.body, enemyScene.my.sprite.body, this.handleContact, null, this);
    }

    update() {
        this.counter++;

        if (this.counter % this.animationSpeed == 0) {
            if (this.stance === 'walk') {
                this.my.sprite.stance.visible = true;
                this.my.sprite.body.visible = false;
                this.stance = 'normal'; // Change stance to normal
            } else {
                this.my.sprite.body.visible = true;
                this.my.sprite.stance.visible = false;
                this.stance = 'walk'; // Change stance to walk
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.shootCarrot();
        }
    }

    shootCarrot() {
        let carrot = this.physics.add.sprite(this.my.sprite.body.x, this.my.sprite.body.y, 'carrot');
        carrot.setVelocityX(300);
        this.carrots.push(carrot);
    }

    handleContact() {
        this.decreaseHealth();
    }

    decreaseHealth() {
        this.health -= 1;
        this.healthText.setText('Health: ' + this.health);
        if (this.health <= 0) {
            this.my.sprite.visible = false; // Hide the sprite
            this.endGame(); // Call end game scenario
        }
    }

    endGame() {
        this.physics.pause(); // Stop physics to prevent further movement/collision
        this.add.text(400, 300, 'Game Over', { fontSize: '40px', fill: '#fff' }).setOrigin(0.5);
    }
}
 