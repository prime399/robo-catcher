// You can write more code here

/* START OF COMPILED CODE */

import Player from "../prefabs/player";
import Platform from "../prefabs/platform";
/* START-USER-IMPORTS */
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
		const _1 = this.add.tileSprite(280, 0, 576, 324, "1");
		_1.setOrigin(0.5, 0);
		_1.visible = false; // Hide the tileSprite background

		// _2
		const _2 = this.add.tileSprite(280, 0, 576, 324, "2");
		_2.setOrigin(0.5, 0);
		_2.visible = false; // Hide the tileSprite background

		// _3
		const _3 = this.add.tileSprite(280, 0, 576, 324, "3");
		_3.visible = false; // Hide the tileSprite background
		_3.setOrigin(0.5, 0);

		// _4
		const _4 = this.add.tileSprite(280, 0, 576, 324, "4");
		_4.setOrigin(0.5, 0);
		_4.visible = false; // Hide the tileSprite background

		// main_overlay
		const main_overlay = this.add.image(280, 0, "main overlay");
		main_overlay.setOrigin(0.5, -0.3);
		
		// Store reference to the main overlay for later use
		this.mainOverlay = main_overlay;

		// player
		const playerInstance = new Player(this, 10, 272);
		this.add.existing(playerInstance);
		playerInstance.scaleX = 1.5;
		playerInstance.scaleY = 1.5;
		playerInstance.setOrigin(0.5, 0.5);
		this.player = playerInstance as Player;

		// mainPlatform
		const mainPlatform = new Platform(this, 350, 390);
		this.add.existing(mainPlatform);

		// mainPlatform (prefab fields)
		mainPlatform.numTiles = 6;
		// Removed setScale(1.9) - Scaling is handled internally by the prefab now
		this.mainPlatform = mainPlatform as Platform;

		// We're now creating ground in setupWorldObjects instead
		// No ground creation here

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
	private player!: Player;
	private mainPlatform!: Platform;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private leftButton!: Phaser.GameObjects.Rectangle;
	private rightButton!: Phaser.GameObjects.Rectangle;
	private jumpButton!: Phaser.GameObjects.Rectangle;
	private dashButton!: Phaser.GameObjects.Rectangle;
	private isMobile: boolean = true;
	private mainOverlay!: Phaser.GameObjects.Image;
	private groundInfoText!: Phaser.GameObjects.Text;
	private worldObjects: any[] = [];
	private mainGround!: Phaser.GameObjects.Rectangle;

	// Check if device is mobile
	isMobileDevice(): boolean {
		return (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
			(window.innerWidth <= 800 && window.innerHeight <= 1200)
		);
	}

	create() {
		// Configure for fullscreen on mobile
		this.setupFullscreen();

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

		// Call editorCreate to create the player and platforms from the scene file
		this.editorCreate();

		// Create a physics group for all static world objects
		this.worldObjects = [];

		// Add physics to the player if not already added
		if (!this.player.body) {
			this.physics.add.existing(this.player);
			const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
			playerBody.setCollideWorldBounds(true);

			// Adjust physics body size to match the scaled sprite
			// The player sprite is 32x32 with scale of 1.0
			const scaledWidth = 16;  // Half width for better collision
			const scaledHeight = 32;
			playerBody.setSize(scaledWidth, scaledHeight);
			playerBody.setOffset((32 - scaledWidth) / 2, 0);
		}

		// Add physics to platforms if needed
		if (this.mainPlatform) {
			// Make sure physics are added if not already
			if (!this.mainPlatform.body) {
				this.physics.add.existing(this.mainPlatform, true); // true makes it static
			}

			// Removed manual body resizing - Prefab handles its own body size based on internal scaling
		}

		// Set up world borders and other collision objects AFTER physics have been added to player and platforms
		this.setupWorldObjects();

		// Make sure the main overlay is properly positioned and scaled
		// This ensures proper scaling even if the scene file changes
		this.mainOverlay.setPosition(width / 2, height / 2);
		this.mainOverlay.setOrigin(0.5, 0.5);
		const overlayScaleX = width / this.mainOverlay.width;
		const overlayScaleY = height / this.mainOverlay.height;
		const overlayScale = Math.max(overlayScaleX, overlayScaleY); 
		this.mainOverlay.setScale(overlayScale);
		this.mainOverlay.setDepth(1);

		// Add directly a simple collider without callback parameters to avoid TypeScript warnings
		this.physics.add.collider(this.player, this.worldObjects);

		// Update debug info with a proper display
		this.groundInfoText = this.add.text(16, 50, 'Ground info will update...', {
			fontSize: '14px',
			color: '#ffffff',
			backgroundColor: '#000000',
			padding: { x: 10, y: 5 }
		});
		this.groundInfoText.setScrollFactor(0);
		this.groundInfoText.setDepth(30);

		// Set up keyboard controls
		this.cursors = this.input.keyboard?.createCursorKeys() || {} as Phaser.Types.Input.Keyboard.CursorKeys;
		
		// Configure the arcade physics world with stronger gravity
		this.physics.world.gravity.y = 1000;
		this.physics.world.setBounds(0, 0, width, height);
		
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

	// Set up the world objects including ground, borders, and obstacles
	setupWorldObjects() {
		const width = this.scale.width;
		const height = this.scale.height;

		// Add thin borders on the left and right edges covering full screen height
		const borderThickness = 2;
		this.addBorder(0, 0, borderThickness, height); // Left border
		this.addBorder(width - borderThickness, 0, borderThickness, height); // Right border
		
		// Create main ground explicitly with the exact same properties as the original one
		// This ensures it's properly set up in our new system
		const mainGround = this.addGround(0, 440, 300, 20, 0x00ff00);
		// Store it for reference if needed
		this.mainGround = mainGround;
		
		// No longer need to handle old ground
		
		// Add mainPlatform to the world objects group if it exists
		if (this.mainPlatform && this.mainPlatform.body) {
			// The mainPlatform already has physics, so we just need to add it to our group
			this.worldObjects.push(this.mainPlatform);
		}
		
		// Add additional platforms (adjust positions as needed)
		this.addGround(200, 350, 250, 20); // Platform 1
		this.addGround(500, 250, 200, 20); // Platform 2
		
		// Add some obstacle boxes
		this.addBox(300, 300, 50, 50);
		this.addBox(450, 200, 60, 60);
		this.addBox(600, 400, 40, 80);
	}

	// Helper method to add a ground/platform with robust physics
	addGround(x: number, y: number, width: number, height: number, color: number = 0x00ff00) {
		// Create a rectangle representing the ground
		const ground = this.add.rectangle(x, y, width, height, color).setOrigin(0, 0);
		
		// Add physics to the ground BEFORE adding to the group
		this.physics.add.existing(ground, true); // true makes it static
		
		// Get the physics body to adjust properties
		const body = ground.body as Phaser.Physics.Arcade.StaticBody;
		
		// Make sure the physics body matches the visual size
		body.setSize(width, height);
		
		// Enable collision only on the top surface for platforms
		body.checkCollision.down = false;
		body.checkCollision.up = true;
		body.checkCollision.left = false;
		body.checkCollision.right = false;
		body.immovable = true;
		
		// Add it to the world objects group 
		this.worldObjects.push(ground);
		
		// Make it semi-transparent for better visualization
		ground.setAlpha(0.7);
		
		// Store the dimensions for debugging
		ground.setData('width', width);
		ground.setData('height', height);
		
		// Set a high depth to ensure visibility
		ground.setDepth(10);
		
		return ground;
	}
	
	// Helper method to add a border
	addBorder(x: number, y: number, width: number, height: number, color: number = 0xff0000) {
		// Create a rectangle representing the border
		const border = this.add.rectangle(x, y, width, height, color).setOrigin(0, 0);
		
		// Add physics to the border BEFORE adding to the group
		this.physics.add.existing(border, true);
		
		// Add it to the world objects group
		this.worldObjects.push(border);
		
		// Make it semi-transparent for better visualization
		border.setAlpha(0.5);
		
		// Set a high depth to ensure visibility
		border.setDepth(10);
		
		return border;
	}
	
	// Helper method to add a box obstacle
	addBox(x: number, y: number, width: number, height: number, color: number = 0x0000ff) {
		// Create a rectangle representing the box
		const box = this.add.rectangle(x, y, width, height, color).setOrigin(0, 0);
		
		// Add physics to the box BEFORE adding to the group
		this.physics.add.existing(box, true); // true makes it static

		// Get the physics body to adjust properties
		const body = box.body as Phaser.Physics.Arcade.StaticBody;

		// Make sure the physics body matches the visual size
		body.setSize(width, height);

		// Enable collision only on the top surface for boxes
		body.checkCollision.down = false;
		body.checkCollision.up = true;
		body.checkCollision.left = false;
		body.checkCollision.right = false;
		body.immovable = true;
		
		// Add it to the world objects group
		this.worldObjects.push(box);
		
		// Make it semi-transparent for better visualization
		box.setAlpha(0.7);
		
		// Set a high depth to ensure visibility
		box.setDepth(10);
		
		return box;
	}

	// Set up fullscreen mode, especially for mobile
	setupFullscreen() {
		// Get scale manager
		const scaleManager = this.scale;

		// Lock orientation to landscape for mobile devices
		if (this.isMobileDevice()) {
			// Set to full screen mode for mobile by default
			if (scaleManager.isFullscreen === false) {
				// For mobile, go fullscreen automatically
				this.requestFullscreen();
			}

			// Add fullscreen event listener
			this.scale.on('enterfullscreen', () => {
				this.adjustForFullscreen();
			});

			this.scale.on('leavefullscreen', () => {
			});

			// Add orientation change event listener
			window.addEventListener('orientationchange', () => {
				this.adjustForFullscreen();
			});
		}

		// Add fullscreen toggle button for non-auto fullscreen devices
		const fsButton = this.add.rectangle(this.scale.width - 40, 40, 50, 50, 0x000000, 0.5)
			.setScrollFactor(0)
			.setDepth(31)
			.setInteractive();
		
		// Add fs icon
		this.add.text(this.scale.width - 40, 40, "FS", {
			fontSize: '20px',
			color: '#ffffff'
		}).setOrigin(0.5).setScrollFactor(0).setDepth(32);

		// Set up click event for fullscreen toggle
		fsButton.on('pointerdown', () => {
			this.toggleFullscreen();
		});
	}

	// Request fullscreen mode
	requestFullscreen() {
		if (!this.scale.isFullscreen) {
			this.scale.startFullscreen();
		}
	}

	// Toggle fullscreen mode
	toggleFullscreen() {
		if (this.scale.isFullscreen) {
			this.scale.stopFullscreen();
		} else {
			this.scale.startFullscreen();
		}
	}

	// Adjust game elements for fullscreen
	adjustForFullscreen() {
		// Resize game view if needed
		const width = window.innerWidth;
		const height = window.innerHeight;
		
		// Adjust game objects for new screen size if necessary
		if (this.mainOverlay) {
			this.mainOverlay.setPosition(width / 2, height / 2);
			const overlayScaleX = width / this.mainOverlay.width;
			const overlayScaleY = height / this.mainOverlay.height;
			const overlayScale = Math.max(overlayScaleX, overlayScaleY); 
			this.mainOverlay.setScale(overlayScale);
		}
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
		// Update the player with the current input state
		this.player.update(
			this.cursors,
			this.leftButtonPressed(),
			this.rightButtonPressed(),
			this.jumpButtonPressed(),
			this.dashButtonPressed()
		);

		// Implement custom parallax scrolling with the paired images
		// Only scroll when moving to avoid constant scrolling
		const scrollSpeed = (this.cursors.right?.isDown || this.rightButtonPressed() ? 1 :
							(this.cursors.left?.isDown || this.leftButtonPressed() ? -1 : 0));

		// Update background positions for parallax effect
		this.updateParallaxBackground(scrollSpeed);
		
		// Update ground position info text for easy debugging/adjustment
		if (this.groundInfoText && this.mainGround) {
			this.groundInfoText.setText(`Ground: ${Math.round(this.mainGround.x)}, ${Math.round(this.mainGround.y)} - ${this.mainGround.width}x${this.mainGround.height}`);
		}
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
