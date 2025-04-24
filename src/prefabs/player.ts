// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";

export default class Player extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
        // Use rb2maskedall texture as default (32x32 sprite)
        super(scene, x ?? 0, y ?? 0, texture || "rb2maskedall", frame ?? 9);

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
        // Set hitbox size - consistent for all 32x32 sprites
        body.setSize(20, 24); // Wider (20px), lower half height (24px)
        // Set offset for 32x32 sprites
        body.setOffset(6, 8);
        
        // Start with idle animation
        this.play("robot idle", true);
        
        // Set depth to ensure visibility
        this.setDepth(20);
        /* END-USER-CTR-CODE */
    }

    public speed: number = 200;
    declare public body: Phaser.Physics.Arcade.Body;
    public jumpPower: number = 600; // Added jump power property
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
    
    // Keep track of current animation to avoid unnecessary changes
    private currentAnimation: string = "robot idle";
    
    // Update method to handle player movement
    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, leftButtonPressed: boolean = false, rightButtonPressed: boolean = false, jumpButtonPressed: boolean = false, dashButtonPressed: boolean = false): void {

        // Declare variables ONCE
        let targetAnimKey: string = "robot idle"; // Default to idle
        const onGround = this.body.blocked.down;

        // Horizontal Movement & Animation
        if (cursors.left?.isDown || leftButtonPressed) {
            this.body.setVelocityX(-this.speed);
            this.setFlipX(true);
            if (onGround) { // Only run anim if on ground
                 targetAnimKey = "robot running";
            }
        } else if (cursors.right?.isDown || rightButtonPressed) {
            this.body.setVelocityX(this.speed);
            this.setFlipX(false);
             if (onGround) { // Only run anim if on ground
                 targetAnimKey = "robot running";
             }
        } else {
            // Idle state (if on ground)
            this.body.setVelocityX(0);
            if (onGround) {
                targetAnimKey = "robot idle";
            } else {
                 // If not moving horizontally AND not on ground, default to jump/fall anim
                 targetAnimKey = "robot jumping";
            }
        }

        // Jump Logic
        if ((cursors.up?.isDown || jumpButtonPressed) && onGround) {
            this.body.setVelocityY(-this.jumpPower);
            targetAnimKey = "robot jumping"; // Set jump anim immediately
        }

        // Dash Logic & Animation (Overrides other ground animations)
        if (cursors.down?.isDown || dashButtonPressed) {
             targetAnimKey = "robot dash";
        }

        // Airborne Animation Check (redundant if handled above, but safe)
        if (!onGround && targetAnimKey !== "robot dash") {
            // Ensure jump anim is set if airborne, unless dashing
            targetAnimKey = "robot jumping";
        }

        // Only play a new animation if it's different from our tracked current animation
        if (this.currentAnimation !== targetAnimKey) {
            // Stop any current animation before starting a new one
            this.anims.stop();
            
            // Play the new animation and update our tracking variable
            this.play(targetAnimKey, true);
            this.currentAnimation = targetAnimKey;
        }

        // Removed manual bounds checking - Handled by physics world bounds now
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here