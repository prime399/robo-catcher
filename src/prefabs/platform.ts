
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Platform extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		/* START-USER-CTR-CODE */
		this.createPlatform(scene);
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Create the platform tiles
	createPlatform(scene: Phaser.Scene) {
		const tileWidth = 16;
		const numTiles = 6; // Number of tiles for the platform
		
		// Create the platform tiles using the world_7_tileset
		for (let i = 0; i < numTiles; i++) {
			// Use the middle tile (723) for most tiles, but use edge tiles (722, 724) for the ends
			let tileFrame = 723; // Middle tile
			if (i === 0) tileFrame = 722; // Left edge
			if (i === numTiles - 1) tileFrame = 724; // Right edge
			
			const tile = scene.add.image(i * tileWidth, 0, "world_7_tileset", tileFrame);
			tile.setOrigin(0, 0);
			this.add(tile);
		}
		
		// Add physics to the platform container
		scene.physics.add.existing(this, true); // true makes it static
		
		// Adjust the physics body size to match the platform
		const body = this.body as Phaser.Physics.Arcade.Body;
		body.setSize(numTiles * tileWidth, 16);
		body.setOffset(0, 0);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
