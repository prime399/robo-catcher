// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
// Import any additional modules or components if needed
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	 create() {
	   this.editorCreate();
	   // Level scene initialization code can go here
	 }

  update() {
    // Add any update logic here if needed
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
