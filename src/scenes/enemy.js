class Enemy extends Phaser.Scene {
    constructor() {
        super("enemyScene");
        this.my = {sprite: {}};

        this.bodyX = 900;  // Initial position on the right side of the screen
        this.bodyY = 520;
        this.stance = 'walk'; 
        this.moveSpeed = 2;  // Speed of movement to the left
        this.counter = 0;
        this.animationSpeed = 10; 
        this.health = 1;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("enemy_jump", "spikeMan_jump.png"); 
        this.load.image("enemy_walking", "spikeMan_stand.png");
    }
    
    create() {
        let my = this.my;
        // Create the sprite for walking and set it as the main body sprite
        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "enemy_walking");
        // Create the sprite for jumping and set it as the alternate stance
        my.sprite.stance = this.add.sprite(this.bodyX, this.bodyY, "enemy_jump");
        my.sprite.stance.visible = false;  // Initially hide the jump sprite
    }

    update() {
        this.counter++;

        // Toggle between stances
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
        if (this.my.sprite.body.x < -this.my.sprite.body.width) {  // Check if sprite moves off screen left
            this.my.sprite.body.x = this.sys.game.config.width + this.my.sprite.body.width;  // Place it off-screen on the right
            this.my.sprite.stance.x = this.sys.game.config.width + this.my.sprite.stance.width;
        }
    }
    //collision detection
    hitByCarrot(){
        this.health -=1;
        if (this.health <= 0) {
            this.my.sprite.body.destroy(); // Or destroy if you prefer
            this.my.sprite.visible = false;
        }
    }

}
