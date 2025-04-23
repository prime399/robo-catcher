// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Platform extends Phaser.GameObjects.Container { // Renamed to Platform

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		// leftEdge
		const leftEdge = scene.add.image(0, 0, "world_7_tileset", 722);
		leftEdge.scaleX = 1.5;
		leftEdge.scaleY = 1.5;
		leftEdge.setOrigin(0, 0);
		this.add(leftEdge);

		// middle1
		const middle1 = scene.add.image(16, 0, "world_7_tileset", 723);
		middle1.scaleX = 1.5;
		middle1.scaleY = 1.5;
		middle1.setOrigin(0, 0);
		this.add(middle1);

		// middle2
		const middle2 = scene.add.image(32, 0, "world_7_tileset", 723);
		middle2.scaleX = 1.5;
		middle2.scaleY = 1.5;
		middle2.setOrigin(0, 0);
		this.add(middle2);

		// middle3
		const middle3 = scene.add.image(48, 0, "world_7_tileset", 723);
		middle3.scaleX = 1.5;
		middle3.scaleY = 1.5;
		middle3.setOrigin(0, 0);
		this.add(middle3);

		// middle4
		const middle4 = scene.add.image(64, 0, "world_7_tileset", 723);
		middle4.scaleX = 1.5;
		middle4.scaleY = 1.5;
		middle4.setOrigin(0, 0);
		this.add(middle4);

		// rightEdge
		const rightEdge = scene.add.image(80, 0, "world_7_tileset", 724);
		rightEdge.scaleX = 1.5;
		rightEdge.scaleY = 1.5;
		rightEdge.setOrigin(0, 0);
		this.add(rightEdge);

		/* START-USER-CTR-CODE */
        // Add physics to the platform container
        scene.physics.add.existing(this, true); // true makes it static

        // Adjust the physics body size to match the platform
        const body = this.body as Phaser.Physics.Arcade.Body;
        // Use scaled tile dimensions for physics body
        const scaledTileWidth = this.tileWidth * 1.5;
        const scaledTileHeight = 16 * 1.5; // Assuming original tile height was 16
        body.setSize(this.numTiles * scaledTileWidth, scaledTileHeight);
        body.setOffset(0, 0); // Offset remains 0 relative to container
        // Set depth to ensure visibility
        this.setDepth(15);
        /* END-USER-CTR-CODE */
	}

	public numTiles: number = 6;
	private tileWidth: number = 16; // Define base tile width

	/* START-USER-CODE */

    // This method will be called by the Phaser Editor when creating the object
    static preload(_scene: Phaser.Scene): void {
        // Preload assets if needed
    }

    // This method will be called by the Phaser Editor when the object is created
    // Use Platform (PascalCase) for class name and return type
    static create(scene: Phaser.Scene, x: number, y: number, numTiles: number = 6): Platform {
        // Use platformInstance (camelCase) for variable name
        const platformInstance = new Platform(scene, x, y);

        if (numTiles !== 6) {
            // Use platformInstance here too
            platformInstance.updatePlatformSize(numTiles);
        }

        return platformInstance; // Return the instance
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
            // Apply scaling to individual tiles
            tile.scaleX = 1.5;
            tile.scaleY = 1.5;
            tile.setOrigin(0, 0);
            this.add(tile);
        }

        // Update the physics body size
        const body = this.body as Phaser.Physics.Arcade.Body;
        // Use scaled tile dimensions for physics body
        const scaledTileWidth = this.tileWidth * 1.5;
        const scaledTileHeight = 16 * 1.5; // Assuming original tile height was 16
        body.setSize(numTiles * scaledTileWidth, scaledTileHeight);
        body.updateFromGameObject(); // Update body position/size based on container changes
    }

    // Method to get the width of the platform (returns visual width)
    getWidth(): number {
        // Return visual width based on scaled tiles
        return this.numTiles * this.tileWidth * 1.5;
    }

    // Method to get the height of the platform (returns visual height)
    getHeight(): number {
        // Return visual height based on scaled tiles
        return 16 * 1.5;
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
