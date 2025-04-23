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
        // Set hitbox size
        body.setSize(20, 24); // Wider (20px), lower half height (24px)
        // Set initial offset for idle animation (48px height)
        body.setOffset(6, 24);
        
        // Start with idle animation
        this.play("robo idle", true);
        
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
    
    // Update method to handle player movement
    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, leftButtonPressed: boolean = false, rightButtonPressed: boolean = false, jumpButtonPressed: boolean = false, dashButtonPressed: boolean = false): void {

        // Declare variables ONCE
        let targetAnimKey: string | null = "robo idle"; // Default to idle
        let targetOffsetY: number = 24; // Default offset for idle (48px frame)
        const onGround = this.body.blocked.down;

        // Horizontal Movement & Animation
        if (cursors.left?.isDown || leftButtonPressed) {
            this.body.setVelocityX(-this.speed);
            this.setFlipX(true);
            if (onGround) { // Only run anim if on ground
                 targetAnimKey = "robot running";
                 targetOffsetY = 8; // Offset for 32px frame
            }
        } else if (cursors.right?.isDown || rightButtonPressed) {
            this.body.setVelocityX(this.speed);
            this.setFlipX(false);
             if (onGround) { // Only run anim if on ground
                 targetAnimKey = "robot running";
                 targetOffsetY = 8; // Offset for 32px frame
             }
        } else {
            // Idle state (if on ground)
            this.body.setVelocityX(0);
            if (onGround) {
                targetAnimKey = "robo idle";
                targetOffsetY = 24; // Offset for 48px frame
            }
        }

        // Jump Logic
        if ((cursors.up?.isDown || jumpButtonPressed) && onGround) {
            this.body.setVelocityY(-this.jumpPower);
            // Jump animation will be set below if airborne
        }

        // Dash Logic & Animation (Overrides other ground animations)
        if (cursors.down?.isDown || dashButtonPressed) {
             targetAnimKey = "robot dash";
             targetOffsetY = 8; // Offset for 32px frame
             // Optional: Add dash velocity logic here if needed
        }

        // Airborne Animation (Overrides ground/idle anims if not dashing)
        if (!onGround && targetAnimKey !== "robot dash") {
            targetAnimKey = "robot jumping";
            targetOffsetY = 24; // Offset for 48px frame
        }

        // Change animation and offset only if needed
        if (targetAnimKey && this.anims.currentAnim?.key !== targetAnimKey) {
            // Set offset BEFORE playing animation
            this.body.setOffset(6, targetOffsetY); // Use determined offset
            this.play(targetAnimKey, true);
        }

        // Removed manual bounds checking - Handled by physics world bounds now
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here