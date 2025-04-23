
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
// No imports needed
/* END-USER-IMPORTS */

export default class MainScene extends Phaser.Scene {

	constructor() {
		super("MainScene");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// _1
		const _1 = this.add.tileSprite(300, 0, 576, 324, "1");
		_1.setOrigin(0.5, 0);

		// _2
		const _2 = this.add.tileSprite(300, 0, 576, 324, "2");
		_2.setOrigin(0.5, 0);

		// _3
		const _3 = this.add.tileSprite(300, 0, 576, 324, "3");
		_3.setOrigin(0.5, 0);

		// _4
		const _4 = this.add.tileSprite(300, 0, 576, 324, "4");
		_4.setOrigin(0.5, 0);

		// main_overlay
		const main_overlay = this.add.image(300, 0, "main overlay");
		main_overlay.setOrigin(0.5, -0.3);

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Property declarations
	private bg1!: Phaser.GameObjects.Image;
	private bg1Dup!: Phaser.GameObjects.Image;
	private bg2!: Phaser.GameObjects.Image;
	private bg2Dup!: Phaser.GameObjects.Image;
	private bg3!: Phaser.GameObjects.Image;
	private bg3Dup!: Phaser.GameObjects.Image;
	private bg4!: Phaser.GameObjects.Image;
	private bg4Dup!: Phaser.GameObjects.Image;
	private robot!: Phaser.GameObjects.Sprite;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private leftButton!: Phaser.GameObjects.Rectangle;
	private rightButton!: Phaser.GameObjects.Rectangle;
	private jumpButton!: Phaser.GameObjects.Rectangle;
	private dashButton!: Phaser.GameObjects.Rectangle;
	private isMobile: boolean = true;
	private speed: number = 200; // Default movement speed

	create() {

		// Get scene dimensions (assuming default or set elsewhere)
		const width = this.scale.width;
		const height = this.scale.height;

		// Create background layers using regular images instead of tileSprites
		// Each layer needs two images side by side for seamless scrolling

		// Layer 1 (farthest)
		this.bg1 = this.add.image(0, 0, "1").setOrigin(0, 0).setScrollFactor(0);
		this.bg1Dup = this.add.image(width, 0, "1").setOrigin(0, 0).setScrollFactor(0);

		// Layer 2
		this.bg2 = this.add.image(0, 0, "2").setOrigin(0, 0).setScrollFactor(0);
		this.bg2Dup = this.add.image(width, 0, "2").setOrigin(0, 0).setScrollFactor(0);

		// Layer 3
		this.bg3 = this.add.image(0, 0, "3").setOrigin(0, 0).setScrollFactor(0);
		this.bg3Dup = this.add.image(width, 0, "3").setOrigin(0, 0).setScrollFactor(0);

		// Layer 4 (closest)
		this.bg4 = this.add.image(0, 0, "4").setOrigin(0, 0).setScrollFactor(0);
		this.bg4Dup = this.add.image(width, 0, "4").setOrigin(0, 0).setScrollFactor(0);

		// Scale all backgrounds to fit the screen height without stretching
		const bgScale = height / this.bg1.height;

		[this.bg1, this.bg1Dup, this.bg2, this.bg2Dup,
		 this.bg3, this.bg3Dup, this.bg4, this.bg4Dup].forEach(bg => {
			bg.setScale(bgScale);
		});

		// Add the main overlay and scale it to fit the screen
		const main_overlay = this.add.image(width / 2, height / 2, "main overlay");
		main_overlay.setOrigin(0.5, 0.5);
		
		// Calculate scale to fit the screen width
		const scaleX = width / main_overlay.width;
		const scaleY = height / main_overlay.height;
		const scale = Math.max(scaleX, scaleY); // Use the larger scale to ensure full coverage
		
		main_overlay.setScale(scale);
		main_overlay.setDepth(1); // Set a lower depth for the overlay
		
		// Add the running robot
		// Using the keys found in asset-pack.json and animation.json
		this.robot = this.add.sprite(width / 2, height - 100, "robo2run-Sheet[32height32wide]");
		this.robot.play("robot running", true);
		this.robot.setScale(2); // Make the robot bigger and more visible
		this.robot.setDepth(20); // Set a higher depth for the robot

		// Create a platform using the world_7_tileset
		const platformX = width / 2 - 48;
		const platformY = height - 50;
		const tileWidth = 16;
		const numTiles = 6;
		
		// Create a container for the platform
		const platformContainer = this.add.container(platformX, platformY);
		
		// Add tiles to the container
		for (let i = 0; i < numTiles; i++) {
			// Use the middle tile (723) for most tiles, but use edge tiles (722, 724) for the ends
			let tileFrame = 723; // Middle tile
			if (i === 0) tileFrame = 722; // Left edge
			if (i === numTiles - 1) tileFrame = 724; // Right edge
			
			const tile = this.add.image(i * tileWidth, 0, "world_7_tileset", tileFrame);
			tile.setOrigin(0, 0);
			platformContainer.add(tile);
		}
		
		// Add physics to the platform container
		this.physics.add.existing(platformContainer, true); // true makes it static
		
		// Adjust the physics body size to match the platform
		const platformBody = platformContainer.body as Phaser.Physics.Arcade.Body;
		platformBody.setSize(numTiles * tileWidth, 16);
		platformBody.setOffset(0, 0);
		
		// Set platform depth to be above the overlay
		platformContainer.setDepth(15);
		
		// Add physics to the robot
		this.physics.add.existing(this.robot);
		const robotBody = this.robot.body as Phaser.Physics.Arcade.Body;
		robotBody.setCollideWorldBounds(true);
		
		// Add collision between robot and platform
		this.physics.add.collider(this.robot, platformContainer);

		// Set up keyboard controls
		this.cursors = this.input.keyboard?.createCursorKeys() || {} as Phaser.Types.Input.Keyboard.CursorKeys;

		// Always enable mobile controls for all devices
		this.isMobile = true;

		// Add instructions text
		const instructions = this.add.text(16, 16, 'Use arrow keys or on-screen buttons to control the robot', {
			fontSize: '18px',
			color: '#ffffff',
			backgroundColor: '#000000',
			padding: { x: 10, y: 5 }
		});
		instructions.setScrollFactor(0);
		instructions.setDepth(30); // Set a high depth for UI elements

		// Create mobile controls for all devices
		this.createMobileControls();
	}

	// Create mobile touch controls
	createMobileControls() {
		const width = this.scale.width;
		const height = this.scale.height;

		// Create semi-transparent buttons
		const buttonColor = 0x000000;
		const buttonAlpha = 0.5; // Increased opacity for better visibility
		const buttonSize = 80;

		// Create a container for the controls at the bottom of the screen
		const controlsY = height - buttonSize/2;

		// Left button (bottom left)
		this.leftButton = this.add.rectangle(buttonSize/2, controlsY, buttonSize, buttonSize, buttonColor, buttonAlpha)
			.setInteractive()
			.setScrollFactor(0)
			.setDepth(30); // Set a high depth for UI elements

		// Right button (to the right of left button)
		this.rightButton = this.add.rectangle(buttonSize*1.75, controlsY, buttonSize, buttonSize, buttonColor, buttonAlpha)
			.setInteractive()
			.setScrollFactor(0)
			.setDepth(30); // Set a high depth for UI elements

		// Jump button (bottom right)
		this.jumpButton = this.add.rectangle(width - buttonSize*1.75, controlsY, buttonSize, buttonSize, buttonColor, buttonAlpha)
			.setInteractive()
			.setScrollFactor(0)
			.setDepth(30); // Set a high depth for UI elements

		// Dash button (to the left of jump button)
		this.dashButton = this.add.rectangle(width - buttonSize/2, controlsY, buttonSize, buttonSize, buttonColor, buttonAlpha)
			.setInteractive()
			.setScrollFactor(0)
			.setDepth(30); // Set a high depth for UI elements

		// Add button labels with white text for better visibility
		const textStyle = { fontSize: '32px', color: '#FFFFFF' };
		this.add.text(buttonSize/2, controlsY, "←", textStyle).setOrigin(0.5).setScrollFactor(0).setDepth(31);
		this.add.text(buttonSize*1.75, controlsY, "→", textStyle).setOrigin(0.5).setScrollFactor(0).setDepth(31);
		this.add.text(width - buttonSize*1.75, controlsY, "↑", textStyle).setOrigin(0.5).setScrollFactor(0).setDepth(31);
		this.add.text(width - buttonSize/2, controlsY, "D", textStyle).setOrigin(0.5).setScrollFactor(0).setDepth(31);

		// Add a semi-transparent background for the controls
		this.add.rectangle(width/2, controlsY, width, buttonSize, 0x000000, 0.2)
			.setScrollFactor(0)
			.setDepth(29); // Place behind the buttons but above the overlay
	}

	// Helper methods to check if mobile buttons are pressed
	leftButtonPressed() {
		return this.isMobile && this.input.activePointer.isDown && this.leftButton.getBounds().contains(this.input.activePointer.x, this.input.activePointer.y);
	}

	rightButtonPressed() {
		return this.isMobile && this.input.activePointer.isDown && this.rightButton.getBounds().contains(this.input.activePointer.x, this.input.activePointer.y);
	}

	jumpButtonPressed() {
		return this.isMobile && this.input.activePointer.isDown && this.jumpButton.getBounds().contains(this.input.activePointer.x, this.input.activePointer.y);
	}

	dashButtonPressed() {
		return this.isMobile && this.input.activePointer.isDown && this.dashButton.getBounds().contains(this.input.activePointer.x, this.input.activePointer.y);
	}

	update() {
		// Handle keyboard and touch input for robot movement
		if (this.cursors.left?.isDown || this.leftButtonPressed()) {
			this.robot.x -= this.speed * (this.game.loop.delta / 1000);
			this.robot.setFlipX(true); // Flip sprite when moving left
			this.robot.play("robot running", true);
		} else if (this.cursors.right?.isDown || this.rightButtonPressed()) {
			this.robot.x += this.speed * (this.game.loop.delta / 1000);
			this.robot.setFlipX(false); // Normal orientation when moving right
			this.robot.play("robot running", true);
		} else if (this.cursors.up?.isDown || this.jumpButtonPressed()) {
			// Jump animation
			this.robot.play("robot jumping", true);
		} else if (this.cursors.down?.isDown || this.dashButtonPressed()) {
			// Dash animation
			this.robot.play("robot dash", true);
		} else {
			// If no keys are pressed, keep the running animation but don't move
			if (this.robot.anims.currentAnim && this.robot.anims.currentAnim.key !== "robot running") {
				this.robot.play("robot running", true);
			}
		}

		// Keep the robot within the screen bounds
		if (this.robot.x < 0) this.robot.x = 0;
		if (this.robot.x > this.scale.width) this.robot.x = this.scale.width;

		// Implement custom parallax scrolling with the paired images
		// Only scroll when moving to avoid constant scrolling
		const scrollSpeed = (this.cursors.right?.isDown || this.rightButtonPressed() ? 1 :
							(this.cursors.left?.isDown || this.leftButtonPressed() ? -1 : 0));

		// Update background positions for parallax effect
		this.updateParallaxBackground(scrollSpeed);
	}

	// Custom method to handle parallax scrolling with paired images
	updateParallaxBackground(scrollSpeed: number) {
		const width = this.scale.width;
		
		// Different speeds for each layer
		const speeds = [0.5, 1.0, 1.5, 2.0];

		// Update each layer with its own speed
		this.updateBackgroundPair(this.bg1, this.bg1Dup, speeds[0] * scrollSpeed, width);
		this.updateBackgroundPair(this.bg2, this.bg2Dup, speeds[1] * scrollSpeed, width);
		this.updateBackgroundPair(this.bg3, this.bg3Dup, speeds[2] * scrollSpeed, width);
		this.updateBackgroundPair(this.bg4, this.bg4Dup, speeds[3] * scrollSpeed, width);
	}

	// Helper method to update a pair of background images
	updateBackgroundPair(bg: Phaser.GameObjects.Image, bgDup: Phaser.GameObjects.Image, speed: number, width: number) {
		// Move both images by the speed
		bg.x -= speed;
		bgDup.x -= speed;

		// If the first image has moved completely off screen to the left, place it to the right of the second image
		if (bg.x <= -width) {
			bg.x = bgDup.x + width;
		}

		// If the second image has moved completely off screen to the left, place it to the right of the first image
		if (bgDup.x <= -width) {
			bgDup.x = bg.x + width;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
