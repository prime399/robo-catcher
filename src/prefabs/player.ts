// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";

export default class Player extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
        super(scene, x ?? 0, y ?? 0, texture || "robo2run-Sheet[32height32wide]", frame ?? 0);

        // Don't set default scale here, let the scene files control it
        // this.scaleX = 2;
        // this.scaleY = 2;

        // this (components)
        scene.add.existing(this);

        /* START-USER-CTR-CODE */
        // Add physics to the player
        scene.physics.add.existing(this);
        
        // Set up physics body
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setSize(16, 32); // Adjust hitbox size
        
        // Start with running animation
        this.play("robot running", true);
        
        // Set depth to ensure visibility
        this.setDepth(20);
        /* END-USER-CTR-CODE */
    }

    public speed: number = 200;
    declare public body: Phaser.Physics.Arcade.Body;

    /* START-USER-CODE */

    // This method will be called by the Phaser Editor when creating the object
    static preload(_scene: Phaser.Scene): void {
        // Preload assets if needed
    }

    // This method will be called by the Phaser Editor when the object is created
    static create(scene: Phaser.Scene, x: number, y: number, speed: number = 200): Player {
        const player = new Player(scene, x, y);
        player.speed = speed;
        return player;
    }
    
    // Update method to handle player movement
    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, leftButtonPressed: boolean = false, rightButtonPressed: boolean = false, jumpButtonPressed: boolean = false, dashButtonPressed: boolean = false): void {
        // Handle keyboard and touch input for robot movement
        if (cursors.left?.isDown || leftButtonPressed) {
            this.x -= this.speed * (this.scene.game.loop.delta / 1000);
            this.setFlipX(true); // Flip sprite when moving left
            this.play("robot running", true);
        } else if (cursors.right?.isDown || rightButtonPressed) {
            this.x += this.speed * (this.scene.game.loop.delta / 1000);
            this.setFlipX(false); // Normal orientation when moving right
            this.play("robot running", true);
        } else if (cursors.up?.isDown || jumpButtonPressed) {
            // Jump animation
            this.play("robot jumping", true);
        } else if (cursors.down?.isDown || dashButtonPressed) {
            // Dash animation
            this.play("robot dash", true);
        } else {
            // If no keys are pressed, keep the running animation but don't move
            if (this.anims.currentAnim && this.anims.currentAnim.key !== "robot running") {
                this.play("robot running", true);
            }
        }
        
        // Keep the robot within the screen bounds
        if (this.x < 0) this.x = 0;
        if (this.x > this.scene.scale.width) this.x = this.scene.scale.width;
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here