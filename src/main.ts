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
  const game = new Phaser.Game({
    width: 1280,
    height: 720,
    backgroundColor: "#2f2f2f",
    parent: "game-container",
    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    },
    pixelArt:true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 300 },
        debug: false
      }
    },
    scene: [Boot, Preload, MainScene, Level],
  });

  game.scene.start("Boot");
});
