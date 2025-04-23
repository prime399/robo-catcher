// You can write more code here

/* START OF COMPILED CODE */

import playerPrefab from "../prefabs/player";
import platformPrefab from "../prefabs/platform";
/* START-USER-IMPORTS */
import Platform from "../prefabs/platform";
import Player from "../prefabs/player";
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
		const playerInstance = new playerPrefab(this, 10, 272);
		this.add.existing(playerInstance);
		playerInstance.scaleX = 1.5;
		playerInstance.scaleY = 1.5;
		playerInstance.setOrigin(0.5, 0.5);
		this.player = playerInstance as Player;

		// mainPlatform
		const mainPlatform = new platformPrefab(this, 350, 390);
		this.add.existing(mainPlatform);

		// mainPlatform (prefab fields)
		mainPlatform.numTiles = 6;
		mainPlatform.setScale(1.9); // Apply 1.5 scale to match with player visually
		this.mainPlatform = mainPlatform as Platform;

		// ground
		const ground = this.add.rectangle(100, 445, 350, 20, 0x00ff00);
		this.ground = ground;

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
	private ground!: Phaser.GameObjects.Rectangle;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private leftButton!: Phaser.GameObjects.Rectangle;
	private rightButton!: Phaser.GameObjects.Rectangle;
	private jumpButton!: Phaser.GameObjects.Rectangle;
	private dashButton!: Phaser.GameObjects.Rectangle;
	private isMobile: boolean = true;
	private mainOverlay!: Phaser.GameObjects.Image;
	// private speed: number = 200; // Default movement speed
	private groundInfoText!: Phaser.GameObjects.Text;

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

		// Make sure the main overlay is properly positioned and scaled
		// This ensures proper scaling even if the scene file changes
		this.mainOverlay.setPosition(width / 2, height / 2);
		this.mainOverlay.setOrigin(0.5, 0.5);
		const overlayScaleX = width / this.mainOverlay.width;
		const overlayScaleY = height / this.mainOverlay.height;
		const overlayScale = Math.max(overlayScaleX, overlayScaleY); 
		this.mainOverlay.setScale(overlayScale);
		this.mainOverlay.setDepth(1);

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

			// After ensuring physics is added, now we can safely access the body
			const platformBody = this.mainPlatform.body as Phaser.Physics.Arcade.StaticBody;
			// Apply scale factor to physics body
			const platformScale = 1.5; // same as visual scale
			platformBody.setSize(
				this.mainPlatform.getWidth() * platformScale, 
				this.mainPlatform.getHeight() * platformScale
			);
		}

		// Add physics to the ground object
		if (this.ground) {
			this.physics.add.existing(this.ground, true); // true makes it static
			// Set the depth to ensure the ground is visible
			this.ground.setDepth(10);
			// Add alpha to make it semi-transparent for visual adjustment
			this.ground.setAlpha(0.7);
		}

		// Add collider for the player and main platform
		this.physics.add.collider(this.player, this.mainPlatform);
		
		// Add collider for the player and ground
		this.physics.add.collider(this.player, this.ground);

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

		// Add text to show ground position for debugging
		const groundInfoText = this.add.text(16, 50, `Ground: ${this.ground.x}, ${this.ground.y} - ${this.ground.width}x${this.ground.height}`, {
			fontSize: '14px',
			color: '#ffffff',
			backgroundColor: '#000000',
			padding: { x: 10, y: 5 }
		});
		groundInfoText.setScrollFactor(0);
		groundInfoText.setDepth(30);
		this.groundInfoText = groundInfoText;

		// Create mobile controls for all devices
		this.createMobileControls();
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
		if (this.groundInfoText) {
			this.groundInfoText.setText(`Ground: ${Math.round(this.ground.x)}, ${Math.round(this.ground.y)} - ${this.ground.width}x${this.ground.height}`);
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
