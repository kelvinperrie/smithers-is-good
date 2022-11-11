const synth = window.speechSynthesis;

let SmithersComputer = function() {
    var self = this;

    self.introTrack = "sounds/Long Hello.mp3";
    self.outroTrack = "sounds/Quite Good.mp3";
    self.name = null;

    self.burnsOpenImage = "images/burns-opened.png";
    self.burnsClosedImage = "images/burns-closed.png";
    self.backgroundImage = "images/background.png";

    self.introSound = null;
    self.outroSound = null;

    self.commandPrompt = null;

    self.TurnOn = function(name) {

        self.name = name;
        $(".login-prompt").hide();

        self.MakeImageStop();
        setTimeout(self.PlayIntro , 1000);

    };

    self.LogOut = function() {
        $("#command-container").hide();
        $(".login-prompt").show();
        $(".name-input").focus();
    }

    self.MakeImageTalk = function() {
        console.log("image start")
        $("#burns-image").attr({ src : self.burnsOpenImage });
    }
    self.MakeImageStop = function() {
        console.log("image stop")
        $("#burns-image").attr({ src : self.burnsClosedImage });
    }

    self.PlayIntro = function() {
        console.log("playing intro");
        self.MakeImageTalk();
        setTimeout(self.MakeImageStop , 500);
        self.introSound.play();

        // self.MakeImageTalk();
        // setTimeout(self.MakeImageStop , 1000);

        // const utterThis = new SpeechSynthesisUtterance("Hello");
        // synth.speak(utterThis);
        // self.SayName();
    }

    self.SayName = function() {
        
        self.MakeImageTalk();
        setTimeout(self.MakeImageStop , 500);

        const utterThis = new SpeechSynthesisUtterance(self.name);
        utterThis.addEventListener('end', (event) => {
            self.PlayOutro();
          });
        synth.speak(utterThis);
        
        //self.PlayOutro();
    }

    self.PlayOutro = function() {
        console.log("playing outro");
        self.outroSound.play();

        self.MakeImageTalk();
        // holy lols
        setTimeout(function() { 
            self.MakeImageStop(); 
            setTimeout(function() { 
                self.MakeImageTalk(); 
                setTimeout(function() { 
                    self.MakeImageTalk(); 
                    setTimeout(function() { 
                        self.MakeImageStop(); 
                        setTimeout(function() { 
                            self.MakeImageTalk(); 
                            setTimeout(function() { 
                                self.MakeImageStop(); 
                                setTimeout(function() { 
                                    self.MakeImageTalk(); 
                                    setTimeout(function() { 
                                        self.MakeImageStop(); 
                                        setTimeout(function() { 
                                            self.MakeImageTalk(); 
                                            setTimeout(function() { 
                                                self.MakeImageStop(); 
                                                
                                            }, 500);
                                        }, 300);
                                    }, 300);
                                }, 300);                                
                            }, 300);
                        }, 300);
                    }, 300);
                }, 300);
            }, 300);
        }, 100);

        // const utterThis = new SpeechSynthesisUtterance("You're quite good, at turning me on");
        // synth.speak(utterThis);
    }

    self.UpdateNameFromParam = function(nameFromParam) {
        self.name = nameFromParam;
        $(".name-input").val(self.name );
    }

    self.AutoStart = function() {
        console.log("in auto start self.outroLoaded " + self.outroLoaded + " and self.introLoaded " + self.introLoaded)
        if(self.outroLoaded === true && self.introLoaded === true && self.name !== null) {
            console.log("auto starting");
            self.TurnOn();
        }
    }

    self.SubmitNewName = function(newName) {
        window.location.href = window.location.href.split("?")[0] + "?name=" + newName ;
    }

    self.StartConsole = function() {
        $("#burns-image").attr({ src : self.backgroundImage });
        $("#command-container").show();
        $(".login-prompt").hide();
        self.commandPrompt.CommandClear();
    }

    self.Initialize = function() {

        self.commandPrompt = new CommandPrompt(self.LogOut);

        var url = new URL(window.location);
        var nameFromParam = url.searchParams.get("name");
        self.UpdateNameFromParam(nameFromParam);


        var introSound = new Howl({
            src: [self.introTrack],
            onend : function() {
                console.log('intro stopped!');
                self.SayName();
            },
            onload : function() {
                //self.introLoaded = true;
                //self.AutoStart();
            }
        });

        self.introSound = introSound;

        var outroSound = new Howl({
            src: [self.outroTrack],
            onend : function() {
                console.log('outro stopped!');
                setTimeout(function() { 
                    self.StartConsole();
                    
                }, 2000);
            },
            onload : function() {
                //self.outroLoaded = true;
                //self.AutoStart();
            }
        });

        self.outroSound = outroSound;
    };
}

let CommandPrompt = function(logOutCallback) {
    var self = this;

    self.output = "";
    self.currentCommand = "";
    self.logOutCallback = logOutCallback;

    // called on a key press
    self.ReceiveInput = function(event) {
        if(event.which == 13) {
            self.EnterInput();
        }
        if(event.key.length === 1) {
            self.RecordInput(event.key);
        }
    }

    // called when the user enters a printable(?) key
    self.RecordInput = function(key) {

        self.currentCommand = self.currentCommand + key;
        self.PutTextIntoOutput(key);
    }

    // output a prompt for the user to type against
    self.EnsureInputDefault = function() {
        self.PutTextIntoOutput(">");
    }

    // processes whatever the user has entered as the current command
    self.ProcessCurrentCommand = function() {
        let command = self.currentCommand.toLowerCase();
        if(command === "help") {
            let output = [
                "help functions:",
                "logout - logs you out",
                "pwd - prints current directory",
                "cd - changes directory",
                "cls - clear screen"
            ];
            self.PutTextIntoOutput(output);
        } else if(command === "logout") {
            self.logOutCallback();
        } else if(command === "cls") {
            self.CommandClearScreen();
        } else if(command === "pwd") {
            self.PutTextIntoOutput("Errrrrrrror, disk corruption detected </br>");
        } else if(command.startsWith("cd ")) {
            self.PutTextIntoOutput("Errrrrrrror, disk corruption detected </br>");
        } else {
            self.PutTextIntoOutput("Unknown command </br>");
        }
    }

    self.CommandClear = function() {
        self.CommandClearScreen();
        self.EnsureInputDefault();
    }
    self.CommandClearScreen = function() {
        $(".commandOutput").html("");
    }

    // trigger when the user hits the enter key to process their input
    self.EnterInput = function() {

        self.PutTextIntoOutput("</br>");

        self.ProcessCurrentCommand();
        self.EnsureInputDefault();
        self.currentCommand = "";
    }

    // puts text (or an array of text) into the history/output
    self.PutTextIntoOutput = function(text) {
        if(Array.isArray(text)) {
            for (const output of text){
                let newOUtput = $(".commandOutput").html() + output + "</br>";
                $(".commandOutput").html(newOUtput);
            }
        } else {
            let newOUtput = $(".commandOutput").html() + text;
            $(".commandOutput").html(newOUtput);
        }
    }

    $(document).ready(function() {
        console.log("got it")
        $(document).on('keypress',function(e) {
            self.ReceiveInput(e);
        });
    });
    
    self.EnsureInputDefault();
}


$(document).ready(function() {

    let computer = new SmithersComputer();
    computer.Initialize();

    // for testing
    $("#command-container").show();
    $(".login-prompt").hide();

    // see if they press the enter key on the login prompt
    $(".name-input").on('keypress',function(e) {
        if(e.which == 13) {
            DoLogon();
        }
    });


    $(".turnOnTrigger").click(function() {
        DoLogon();
    });

    function DoLogon() {
        let textToSay = $(".name-input").val();;

        computer.TurnOn(textToSay);
        //computer.SubmitNewName(textToSay);

    }

});