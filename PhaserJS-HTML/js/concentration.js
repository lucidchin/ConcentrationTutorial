"use strict"

var Concentration = function () {
    var topLayer;
    var cards;
    var bigCard;
    var showAllCard;
    var btnTexture;
    var graphics;
    var appTitleText;
    var alertBox;
    var helpBox;
};

Concentration.prototype = {

    // The preload function then will call all of the previously defined functions:
    preload: function () {
        this.load.image("background", "images/greenfeltsmall.jpg");
        this.load.image("cardBack", "images/PlayingCardBack.png");
        this.load.image("helpIcon", "images/info_icon.png");
        this.load.image("helpBG", "images/help_bg.png");
        this.load.image("alertBG", "images/dialog_bg.png");
        this.load.image("btnContinue", "images/btn_continue.png");

        // Custom button texture
        this.btnTexture = new Phaser.Graphics()
            .beginFill(0x000000, 0.5)
            .drawRoundedRect(0, 0, 250, 60, 10)
            .endFill()
            .beginFill(0xdddddd, 1)
            .drawRoundedRect(3, 3, 244, 54, 10)
            .endFill()
            .generateTexture();

        // Load card images
        this.load.image("Ben_Carson","images/Ben_Carson.png");
        this.load.image("Bernie_Sanders","images/Bernie_Sanders.png");
        this.load.image("Bobby_Jindal","images/Bobby_Jindal.png");
        this.load.image("Carly_Fiorina","images/Carly_Fiorina.png");
        this.load.image("Chris_Christie","images/Chris_Christie.png");
        this.load.image("Donald_Trump","images/Donald_Trump.png");
        this.load.image("George_Pataki","images/George_Pataki.png");
        this.load.image("Hillary_Clinton","images/Hillary_Clinton.png");
        this.load.image("Jeb_Bush","images/Jeb_Bush.png");
        this.load.image("Jim_Gilmore","images/Jim_Gilmore.png");
        this.load.image("Jim_Webb","images/Jim_Webb.png");
        this.load.image("John_Kasich","images/John_Kasich.png");
        this.load.image("Lawrence_Lessig","images/Lawrence_Lessig.png");
        this.load.image("Lindsey_Graham","images/Lindsey_Graham.png");
        this.load.image("Marco_Rubio","images/Marco_Rubio.png");
        this.load.image("Martin_OMalley","images/Martin_OMalley.png");
        this.load.image("Mike_Huckabee","images/Mike_Huckabee.png");
        this.load.image("Rand_Paul","images/Rand_Paul.png");
        this.load.image("Rick_Perry","images/Rick_Perry.png");
        this.load.image("Rick_Santorum","images/Rick_Santorum.png");
        this.load.image("Scott_Walker","images/Scott_Walker.png");
        this.load.image("Ted_Cruz","images/Ted_Cruz.png");
    },
    
    create: function() {
        // Add our game background.
        this.add.image(0, 0, "background");

        this.initializeVariables();
        this.showMenus();

        // We setup two groups to act as layers. This is prevent
        // Z-Order issues, since the order in which items are added will
        // determine the order they appear on the screen.
        this.cards = this.game.add.group();
        this.topLayer = this.game.add.group();

        // Setup the initial game.
        this.resetGrid();
        this.showGrid();
        this.showAll();

        // Setup our reusable sprites, like the big card, and alert boxes
        this.setupReusableSprites();
    },

    /**
     *  Initialize our game variables.
     * 
     */
    initializeVariables: function() {
        level = 1;
        baselevel = 1;
        maxlevel = 10;

        if (navigator.userAgent.indexOf("iPad") > 0) { ipad = true; }
        else { ipad = false; }

        fontstring = "MarkerFelt-Wide";
        fontcolor = "black";

        screenwidth = this.game.world.width;
        screenheight = this.game.world.height;

        fontsize = 24;
        barheight = 60;
        buttonsize = 60;
        picWidth = 60;
        picHeight = 100;

        if (ipad) { picWidth = 2 * picWidth; picHeight = 2 * picHeight; }

        appTitle = "Match the 2016 Candidates";
        imageArray = ["Ben_Carson",
                      "Bernie_Sanders",
                      "Bobby_Jindal",
                      "Carly_Fiorina",
                      "Chris_Christie",
                      "Donald_Trump",
                      "George_Pataki",
                      "Hillary_Clinton",
                      "Jeb_Bush",
                      "Jim_Gilmore",
                      "Jim_Webb",
                      "John_Kasich",
                      "Lawrence_Lessig",
                      "Lindsey_Graham",
                      "Marco_Rubio",
                      "Martin_OMalley",
                      "Mike_Huckabee",
                      "Rand_Paul",
                      "Rick_Perry",
                      "Rick_Santorum",
                      "Scott_Walker",
                      "Ted_Cruz"];
    },

    /**
     * Resets our grid and revealed arrays based upon the level we 
     * are playing at.
     * 
     */
    resetGrid: function() {
        lastChoice = -1;
        numMoves = 0;
        gridArray = [];
        revealedArray = [];

        switch (level) {
            case 1:
                gridsize = 4;
                maxcolumn = 2;
                break;
            case 2:
                gridsize = 6;
                maxcolumn = 3;
                break;
            case 3:
                gridsize = 8;
                maxcolumn = 4;
                break;
            case 4:
                gridsize = 12;
                maxcolumn = 4;
                break;
            case 5:
                gridsize = 16;
                maxcolumn = 4;
                break;
            case 6:
                gridsize = 20;
                maxcolumn = 5;
                break;
            case 7:
                gridsize = 24;
                maxcolumn = 6;
                break;
            case 8:
                gridsize = 30;
                maxcolumn = 6;
                break;
            case 9:
                gridsize = 36;
                maxcolumn = 6;
                break;
            case 10:
                gridsize = 42;
                maxcolumn = 7;
                break;
            case 11:
                gridsize = 48;
                maxcolumn = 8;
                break;
        }

        // Setup Random Starting point in array
        var ctroffset = Math.floor((Math.random() * imageArray.length));

        // reset our revealed and grid array
        for (var ctr = 0; ctr < gridsize; ctr++) {
            revealedArray[ctr] = 0;
            gridArray[ctr] = "";
        }

        for (var ctr = 0; ctr < gridsize / 2; ctr++) {

            var fixedctr = ctr + ctroffset;

            if (fixedctr >= imageArray.length) {
                fixedctr = ctr + ctroffset - imageArray.length;
            }

            var object = imageArray[fixedctr];
            //console.log("ctroffset: " + ctroffset + ", fixedctr: " + fixedctr + ", " + object);

            var pos1 = Math.floor((Math.random() * gridsize));
            var notFree = true;

            // Place current object into first position. 
            while (notFree) {
                if (gridArray[pos1] === "") {
                    notFree = false;
                    gridArray[pos1] = object;
                }
                else {
                    pos1++;
                    if (pos1 >= gridsize) {
                        pos1 = 0;
                    }
                }
            }

            // place current object into second position.
            var pos2 = Math.floor((Math.random() * gridsize));
            notFree = true;
            while (notFree) {
                if (gridArray[pos2] === "") {
                    notFree = false;
                    gridArray[pos2] = object;
                }
                else {
                    pos2++;
                    if (pos2 >= gridsize) {
                        pos2 = 0;
                    }
                }
            }
        }

        // --- NEW FOR PHASER VERSION ---
        // Create our cards group to hold our card sprites
        if (typeof this.cards !== "undefined" && this.cards.length > 0) {
            this.destroyCards();
        }

        //cards = this.game.add.group();

        for (var i=0;i<gridsize;i++) {
            var card = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "cardBack");
            card.customParams = { "id" : i, "name": gridArray[i] };
            card.width = picWidth;
            card.height = picHeight;
            card.inputEnabled = true;
            card.input.pixelPerfectClick = true;
            card.events.onInputUp.add(this.choseButton, this);
            this.cards.add(card);
        }

        
    },

    /**
     *  We build our top menu bar, and place our text and button into it.
     * 
     */
    showMenus: function() {
        // Draw our box for the menu bar
        this.graphics = this.game.add.graphics(0, 0);
	    this.graphics.beginFill(0x000000, 1);
        this.graphics.drawRect(0,0,game.width,80);
	    this.graphics.endFill();

        // add help button
        this.game.add.button(20,20,"helpIcon",this.showHelp,this,0);

        // add app title
        this.appTitleText = this.game.add.text(this.game.world.centerX, 40, "", { font: "18pt MarkerFelt-Wide", fill: "#ffffff", align: "center" });
        this.appTitleText.setText(appTitle);
        this.appTitleText.anchor.setTo(0.5, 0.5);
    },

    /**
     * Shows our grid of cards. This function does some calculations to determine
     * how many cards can be placed onto our stage, and at what size to fit all 
     * the required cards for our level.
     * 
     */
    showGrid: function() {
        maxrow = gridsize/maxcolumn;
        picWidth = screenwidth / (maxcolumn + 1);
        picHeight = picWidth * 4/3;
        
        var xspacing = (screenwidth - maxcolumn * picWidth)/maxcolumn;
        var ymargin = xspacing;
        
        var column = 0;
        var row = 0;
        var i = 0;
        var offset;
        
        offset = (screenwidth - (maxcolumn*buttonsize))/(1+maxcolumn);
        
        while (i < gridArray.length) {
            var thisImage = gridArray[i];
        
            var card = this.cards.getChildAt(i);
            
            if (revealedArray[i] === 1) {
                card.loadTexture(thisImage);
            }
            else {
                card.loadTexture("cardBack");
            }

            // Size and position the card
            card.x = (xspacing/2+column*(picWidth+xspacing));
            card.y = (row*(picHeight+ymargin)+ymargin)+60;
            card.width = picWidth;
            card.height = picHeight;

            column++;

            if (column >= maxcolumn) {
                column=0;
                row++;
            }
            i++;
        }
    },

    /**
     *  Handles the click event on our card. 
     *
     */
    choseButton: function (card, event) {
        var choice = parseInt(card.customParams.id);
        var chosenImage = card.customParams.name;
        var done = false;

        // update the titlebar
        var cardName = chosenImage.replace("_", " ");
        this.appTitleText.setText(appTitle + ":\n" + cardName);

        if (revealedArray[choice] !== 1) {
            numMoves++;
            revealedArray[choice] = 1;
            this.showGrid();

            if (lastChoice === -1) {
                lastChoice = choice;
            }
            else {
                if (!(lastChoice === choice) &&
                    (gridArray[lastChoice] === gridArray[choice])) {
                        lastChoice = -1;
                        done = true;
                        for (var tmpctr = 0; tmpctr < revealedArray.length; tmpctr++) {
                            if (revealedArray[tmpctr] === 0) {
                                done = false;
                            }
                        }
                        if (done) {
                            if (level < maxlevel) {
                                level++;
                            }
                            this.appTitleText.setText(appTitle); 
                            this.showDone();
                        }
                }
                else { // reset revealed
                    this.showGrid();
                    revealedArray[choice] = 0;
                    revealedArray[lastChoice] = 0;
                }
                lastChoice = -1;  
            }
        }

        // briefly show selected card in a big view. We destroy the card after .5 seconds.
        /*
        bigCard = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, chosenImage);
        bigCard.anchor.setTo(0.5, 0.5);
        bigCard.scale.setTo(2);
        window.setTimeout(function() {
            bigCard.destroy();
        }, 500);
        */
        this.bigCard.loadTexture(chosenImage);
        this.bigCard.visible = true;
        this.timer.add(500, this.hideBigCard, this);
        this.timer.start();
        
    },

    /**
     * This function shows all the cards on the screen in a quick slideshow.
     * The Phaser version here uses a timer object to call the swapCard function.
     * Note the curCard variable, we set it to 0 and use it as a counter to know when
     * to stop.
     * 
     */
    showAll: function() {
        this.curCard = 0;
        this.timer = this.game.time.create(false);
        this.timer.add(100, this.swapCard, this);
        this.timer.start();
    },

    /**
     * Show our completed message alertbox.
     * 
     */
    showDone: function() {
        this.alertBox.visible = true;
    },

    /**
     *  When the "i" button in the toolbar is clicked, we show the help / level selction options.
     * 
     */
    showHelp: function() {
        this.helpBox.visible = true;
    },

    showAlert: function() {
        // I'm keeping this here, it was in the IOS version and was used to show 
        // alerts. We didn't need this in our Phaser implementation.
    },   

    didReceiveMemoryWarning: function() {
        // We also didn't need this, since memory and garbage collection is 
        // done for us by the Javascript engine.
    },




    // ========= New Functions added for Phaser version ========




    /**
     * We setup a series of sprite groups that are added to the topLayer group.
     * These sprite groups are to be reused, so they won't be discarded.
     * The 3 items setup here are the Big Card view, the Help Dialog box and the 
     * Alert Dialog box.
     * 
     */
    setupReusableSprites: function() {
        // Create our Big Card to use as a preview
        this.bigCard = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "cardBack");
        this.bigCard.anchor.setTo(0.5);
        this.bigCard.scale.setTo(2);
        this.bigCard.visible = false;
        this.topLayer.add(this.bigCard);

        this.setupHelpBox();
        this.setupAlertBox();
    },

    /**
     * Creaate the Help Dialog Box here.
     * 
     */
    setupHelpBox: function() {
        var txtHeader;
        var btnContinue;
        var txt;
        var headStyle = { font: "18pt MarkerFelt-Wide", fill: "#000000", align: "center" };
        var style={font: "30px MarkerFelt-Wide", fill: "#333333"};
        var btn;

        // create our dialog box
        this.helpBox = game.add.sprite(0, 0, "helpBG");

        // create header text
        txtHeader = this.game.add.text(this.game.world.centerX, 80, "Select a Level", headStyle);
        txtHeader.anchor.setTo(0.5);

        // create our Continue button
        txt = this.game.add.text(0,0,"Continue",style);
        txt.anchor.setTo(0.5);
        btnContinue = this.game.add.image(this.helpBox.centerX, this.helpBox.height-85, this.btnTexture);
        btnContinue.addChild(txt);
        btnContinue.anchor.setTo(0.5, 0.5);
        btnContinue.inputEnabled = true;
        btnContinue.input.useHandCursor = true;
        btnContinue.events.onInputUp.add(this.closeHelpBox, this);

        // Loop through and create out level buttons.
        for (var i = 1; i <= maxlevel; i++) {
            // Create Text for our button
            txt = this.game.add.text(0,0,i,style);
            txt.anchor.setTo(0.5);

            // Create the button, based upon the texture we generated.
            btn = this.game.add.image(this.world.centerX, (60 + (70 * i)), this.btnTexture);
            btn.anchor.setTo(0.5);
            btn.inputEnabled = true;
            btn.input.useHandCursor = true;
            btn.events.onInputUp.add(this.doLevelButtonAction, this);
            btn.id = i;
            
            // Add text to the button and then add button to alertbox.
            btn.addChild(txt);
            this.helpBox.addChild(btn);
        }

        // Add the objects to the alertBox so they are a single entity.
        this.helpBox.addChild(txtHeader);
        this.helpBox.addChild(btnContinue);
        this.helpBox.visible = false;
        this.topLayer.add(this.helpBox);
    },

    /**
     * Setup the Alert Dialog Box here.
     * 
     */
    setupAlertBox: function() {
        var alertMessage = "";
        var style = { font: "18pt MarkerFelt-Wide", fill: "#000000", align: "center" };
        var txtAlertMessage;
        var btnContinue;

        // Construct our message
        alertMessage = "SOLVED in " + numMoves + " MOVES!";
        if (level == maxlevel) { 
            alertMessage += "\n\nWell done! Try again!";
        }
        else { 
            alertMessage += "\n\nWell done!\n\nNow try again, at level " + level; 
        }

        // create our dialog box
        this.alertBox = game.add.sprite(game.world.centerX, game.world.centerY, "alertBG");
        this.alertBox.anchor.set(0.5);

        // create our text object to hold our message
        txtAlertMessage = this.game.add.text(0, -50, alertMessage, style);
        txtAlertMessage.anchor.setTo(0.5);
        
        // create our Continue button from a sprite we loaded.
        btnContinue = this.game.add.sprite(0, 130, "btnContinue");
        btnContinue.anchor.set(0.5);
        btnContinue.inputEnabled = true;
        btnContinue.input.useHandCursor = true;
        btnContinue.events.onInputUp.add(this.closeAlert, this);
        
        // Add the objects to the alertBox so they are a single entity.
        this.alertBox.addChild(txtAlertMessage);
        this.alertBox.addChild(btnContinue);
        this.alertBox.visible = false;
        this.topLayer.add(this.alertBox);
    },

    /**
     * Function that closes our alertbox.
     * 
     */
    hideBigCard: function() {
        this.bigCard.visible = false;
    },

    /**
     * We swap out the card by simply creating a new sprite in place of the old one.
     * The first thing we do is test if our bigCard object is a sprite, if it is we destroy it.
     * We then create a new bigCard with the image we want out of our imageArray. 
     * We then create a new timer to continue the process until we finish.
     * 
     */
    swapCard: function() {
        if (this.curCard < imageArray.length) {
            if (typeof this.showAllCard !== "undefined") {
                this.showAllCard.destroy();
            }

            this.showAllCard = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, imageArray[this.curCard]);
            this.showAllCard.anchor.setTo(0.5, 0.5);
            this.showAllCard.scale.setTo(1.5);
            
            this.curCard++;
            this.timer.add(100, this.swapCard, this);
        }
        else {
            this.showAllCard.destroy();
        }
    },

    closeHelpBox: function() {
        this.helpBox.visible = false;
    },

    /**
     * Close the alert box and reset the game.
     * 
     */
    closeAlert: function() {
        this.alertBox.visible = false;
        this.resetGrid();
        this.showGrid();
    },

    /**
     * Perform action based on level button selected.
     * 
     */
    doLevelButtonAction: function(e) {
        level = e.id;
        this.closeHelpBox();
        this.resetGrid();
        this.showGrid();
    },

    /**
     * Function used to go through all our cards and remove them from our stage.
     * We could have used a game.world.removeAll, but that would have also destroyed our
     * menu bar.
     * 
     */
    destroyCards: function() {
        while (this.cards.length > 0) {
            this.cards.children[0].destroy();
        }
    }
};