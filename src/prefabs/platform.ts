// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";

export default class Platform extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene, x?: number, y?: number) {
        super(scene, x ?? 0, y ?? 0);

        // leftEdge
        const leftEdge = scene.add.image(0, 0, "world_7_tileset", 722);
        leftEdge.setOrigin(0, 0);
        this.add(leftEdge);

        // middle1
        const middle1 = scene.add.image(16, 0, "world_7_tileset", 723);
        middle1.setOrigin(0, 0);
        this.add(middle1);

        // middle2
        const middle2 = scene.add.image(32, 0, "world_7_tileset", 723);
        middle2.setOrigin(0, 0);
        this.add(middle2);

        // middle3
        const middle3 = scene.add.image(48, 0, "world_7_tileset", 723);
        middle3.setOrigin(0, 0);
        this.add(middle3);

        // middle4
        const middle4 = scene.add.image(64, 0, "world_7_tileset", 723);
        middle4.setOrigin(0, 0);
        this.add(middle4);

        // rightEdge
        const rightEdge = scene.add.image(80, 0, "world_7_tileset", 724);
        rightEdge.setOrigin(0, 0);
        this.add(rightEdge);

        // this (components)
        scene.add.existing(this);

        /* START-USER-CTR-CODE */
        // Add physics to the platform container
        scene.physics.add.existing(this, true); // true makes it static
        
        // Adjust the physics body size to match the platform
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(this.numTiles * this.tileWidth, 16);
        body.setOffset(0, 0);
        
        // Set depth to ensure visibility
        this.setDepth(15);
        /* END-USER-CTR-CODE */
    }

    public numTiles: number = 6;
    public tileWidth: number = 16;
    declare public body: Phaser.Physics.Arcade.Body;

    /* START-USER-CODE */

    // This method will be called by the Phaser Editor when creating the object
    static preload(_scene: Phaser.Scene): void {
        // Preload assets if needed
    }

    // This method will be called by the Phaser Editor when the object is created
    static create(scene: Phaser.Scene, x: number, y: number, numTiles: number = 6): Platform {
        const platform = new Platform(scene, x, y);
        
        if (numTiles !== 6) {
            platform.updatePlatformSize(numTiles);
        }
        
        return platform;
    }
    
    // Update the platform size based on the number of tiles
    updatePlatformSize(numTiles: number): void {
        this.numTiles = numTiles;
        
        // Remove all existing tiles
        this.removeAll(true);
        
        // Create new tiles based on the updated number
        for (let i = 0; i < numTiles; i++) {
            // Use the middle tile (723) for most tiles, but use edge tiles (722, 724) for the ends
            let tileFrame = 723; // Middle tile
            if (i === 0) tileFrame = 722; // Left edge
            if (i === numTiles - 1) tileFrame = 724; // Right edge
            
            const tile = this.scene.add.image(i * this.tileWidth, 0, "world_7_tileset", tileFrame);
            tile.setOrigin(0, 0);
            this.add(tile);
        }
        
        // Update the physics body size
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(numTiles * this.tileWidth, 16);
    }
    
    // Method to get the width of the platform
    getWidth(): number {
        return this.numTiles * this.tileWidth;
    }
    
    // Method to get the height of the platform
    getHeight(): number {
        return 16; // The height of a single tile
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
