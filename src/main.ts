import Phaser from "phaser";
import Level from "./scenes/Level";
import Preload from "./scenes/Preload";
import MainScene from "./scenes/MainScene";

class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.pack("pack", "/assets/preload-asset-pack.json"); // Use absolute path from root
  }

  create() {
    this.scene.start("Preload");
  }
}

window.addEventListener("load", function () {
  // Check if on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                  (window.innerWidth <= 800 && window.innerHeight <= 1200);
  
  // Create a game config with fullscreen support
  const gameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: "#2f2f2f",
    parent: "game-container",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 720,
      // Enable fullscreen
      fullscreenTarget: document.body,
      expandParent: true,
    },
    dom: {
      createContainer: true
    },
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 1000 }, // Increased gravity
        debug: true // Enabled physics debugging
      }
    },
    scene: [Boot, Preload, MainScene, Level],
  };

  // Create the game instance
  const game = new Phaser.Game(gameConfig);

  // Trigger fullscreen on the first user interaction using DOM event listener
  game.canvas.addEventListener('pointerdown', () => {
    if (!game.scale.isFullscreen) {
        game.scale.startFullscreen();
    }
  }, { once: true }); // Use { once: true } to automatically remove the listener after first trigger

  // Mobile optimizations
  if (isMobile) {
    // Add viewport meta tag for better mobile display
    const viewport = document.querySelector('meta[name=viewport]');
    if (!viewport) {
      const metaTag = document.createElement('meta');
      metaTag.name = 'viewport';
      metaTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(metaTag);
    } else {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }

    // Apply fullscreen styles to body and game container
    document.body.style.margin = '0px';
    document.body.style.padding = '0px';
    document.body.style.overflow = 'hidden';
  }

  game.scene.start("Boot");
});
