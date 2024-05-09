class Rabbit extends Phaser.Scene {
    constructor() {
        super("rabbitScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        // Create variables to hold constant values for sprite locations
        this.bodyX = 90;
        this.bodyY = 500;

        //rabbit scene 
        //rabbit sprite alternates assets when walking 
        //can shoot carrots 
        //has health points that decrease when interacting with enemy 
        this.stance = 'walk'; 
        this.moveSpeed = 5;
        //make array to manage carrots 
        this.carrots = []
        this.counter = 0;
        this.animationSpeed = 10; 
        this.health = 5;   
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Shape Characters"
        // https://kenney.nl/assets/shape-characters
        this.load.setPath("./assets/");
        // body
        this.load.image("walking", "bunny2_walk1.png");
        this.load.image("normal", "bunny2_walk2.png"); 
        this.load.image("carrot", "carrot.png"); 
        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Gallery Shooter Game :D</h2>'
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        // Create the main body sprite
        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "walking");
        my.sprite.stance = this.add.sprite(this.bodyX, this.bodyY, "normal"); 
        my.sprite.stance.visible = false;
        //shoot bullet on click
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
         
    }

    update() {
        //my.sprite.walking.visible = true; 
        // Since update is called multiple times/second, this.counter acts like
        // a timer, increasing once per clock tick
        //this.counter++;

        //give the rabbit a running motion
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

        // Shooting carrots when space is pressed
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            let carrot = this.physics.add.sprite(this.my.sprite.body.x, this.my.sprite.body.y, 'carrot');
            carrot.setVelocityX(300); //move the carrot across the screen
            this.carrots.push(carrot);  // Add the carrot to the carrots array for management
        }
    }
}