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

    // method called when logon prompt submitted
    // starts the animation / sounds
    self.TurnOn = function(name) {
        self.name = name;
        $(".login-prompt").hide();

        self.MakeImageStop();
        setTimeout(self.PlayIntro , 1000);
    };

    // log out of the console, so show the logon prompt
    self.LogOut = function() {
        self.ShowLogon();
    }

    self.MakeImageTalk = function() {
        //console.log("image start")
        $("#burns-image").attr({ src : self.burnsOpenImage });
    }
    self.MakeImageStop = function() {
        //console.log("image stop")
        $("#burns-image").attr({ src : self.burnsClosedImage });
    }

    // plays the "hello ..." burns sound
    self.PlayIntro = function() {
        self.MakeImageTalk();
        setTimeout(self.MakeImageStop , 500);
        self.introSound.play();
    }

    // use the browser's speech synthesis stuff to say whatever the name was that they entered
    self.SayName = function() {
        
        self.MakeImageTalk();
        setTimeout(self.MakeImageStop , 500);

        const utterThis = new SpeechSynthesisUtterance(self.name);
        utterThis.addEventListener('end', (event) => {
            // when the name has finished being said then we play the outro
            self.PlayOutro();
          });
        synth.speak(utterThis);
        
    }

    self.PlayOutro = function() {
        //console.log("playing outro");
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

    // show the console/command prompt stuff
    self.StartConsole = function() {
        $("#burns-image").attr({ src : self.backgroundImage });
        $("#command-container").show();
        $(".login-prompt").hide();
        self.commandPrompt.InitializePrompt(self.name);
    }

    // show the login page
    self.ShowLogon = function() {
        $("#command-container").hide();
        $(".login-prompt").show();
        $(".name-input").val("");
        $(".name-input").focus();
    }

    self.Initialize = function() {

        self.commandPrompt = new CommandPrompt(self.LogOut);

        // setup our intro sound - the "hello ..."
        var introSound = new Howl({
            src: [self.introTrack],
            onend : function() {
                //console.log('intro stopped!');
                // call the method to say the name that was typed in
                self.SayName();
            }
        });
        self.introSound = introSound;

        // setup the outro sound - the "... you're quite good at turning me on"
        var outroSound = new Howl({
            src: [self.outroTrack],
            onend : function() {
                // the logon sequence has finished, wait a bit then show the console
                setTimeout(function() { 
                    self.StartConsole();
                }, 2000);
            }
        });
        self.outroSound = outroSound;

        // setup keyboard and mouse hooks
        $(document).ready(function() {
            // see if they press the enter key on the login prompt
            $(".name-input").on('keypress',function(e) {
                if(e.which == 13) {
                    DoLogon();
                }
            });

            // see if they press the 'log on' button
            $(".turnOnTrigger").click(function() {
                DoLogon();
            });

            function DoLogon() {
                let textToSay = $(".name-input").val();;
                self.TurnOn(textToSay);
            }

            self.ShowLogon();
            // for testing
            // $("#command-container").show();
            // $(".login-prompt").hide();

        })
    };
}

let File = function(fileData) {
    var self = this;

    self.name = fileData.name;
    self.type = "file";
    self.execute = fileData.execute;
}

let Directory = function(directoryData, parent) {
    var self = this;

    self.name = directoryData.name;
    self.parent = parent;
    self.contents = [];
    self.type = "directory";

    for (const content of directoryData.contents){
        if(content.type === "file") {
            var newFile = new File(content);
            self.contents.push(newFile);
        } else if(content.type === "directory") {
            var newDir = new Directory(content, self);
            self.contents.push(newDir);
        }
    }
}

let FileSystem = function() {
    var self = this;

    self.structureData = [
        {
            name: "Burns_Pics",
            type: "directory",
            contents: [
                {
                    name: "burn04.jpg",
                    type: "file",
                    execute: function(output) { output("file encypted<br/>"); } 
                },
                {
                    name: "too_hot_to_handle.jpg",
                    type: "file",
                    execute: function(output) { output("file encypted<br/>"); } 
                }
            ]
        },
        {
            name: "PossibleWarCrimes",
            type: "directory",
            contents: [
                {
                    name: "NuclearWasteDumpSites.doc",
                    type: "file",
                    execute: function(output) { output("No application associated with this file type.<br/>"); }        
                },
                {
                    name: "SchoolBus.txt",
                    type: "file",
                    execute: function(output) { output("At this time the effects of transporting radioactive material on the local school bus are unknown, but it [error file corrupt]<br/>"); }        
                }
            ]
        },
        {
            name: "notAvirus.exe",
            type: "file",
            execute: function(output) { output(["greeting from team b4d w01f - you have been haxed!!","We have encrypted all your imagfe files!","To geet access you must give us your rarest malibu stacey by 4pm"]); }
        }
    ]
    let structure = new Directory({ name : "C:", type: "directory", contents: self.structureData });
    self.currentDirectory = structure;
    console.log(self.structure);

    self.GetFileInCurrentDirectory = function(fileName) {
        for (const child of self.currentDirectory.contents){
            if(child.name.toLowerCase() === fileName.toLowerCase() && child.type === "file") {
                return child;
            }
        }
    }

    self.GetCurrentPath = function() {
        let path = [self.currentDirectory.name];
        let navDir = self.currentDirectory;
        while(navDir.parent != null) {
            navDir = navDir.parent;
            path.unshift(navDir.name);
        }
        console.log(path);
        return path.join("/");
    }

    self.GoToChildDirectory = function(name) {
        for (const childDirectory of self.currentDirectory.contents){
            console.log("compare child called " + childDirectory.name + " with wanted folder of " + name)
            if(childDirectory.name.toLowerCase() === name.toLowerCase() && childDirectory.type === "directory") {
                self.currentDirectory = childDirectory;
                return self.GetCurrentPath();
            }
        }
        return "no such folder";
    }
    
    self.GoToParentDirectory = function() {
        if(self.currentDirectory.parent != null) {
            self.currentDirectory = self.currentDirectory.parent;
        }
        return self.GetCurrentPath();
    }

    self.ListCurrentDirectoryContents = function() {
        let contents = [];
        for (const content of self.currentDirectory.contents){
            let name = content.type === "directory" ? "&lt;DIR&gt; "+content.name : content.name
            contents.push(name);
        }
        return contents;
    }
}

let CommandPrompt = function(logOutCallback) {
    var self = this;

    self.output = "";
    self.currentCommand = "";
    self.logOutCallback = logOutCallback;
    self.fileSytem = new FileSystem(); // one misspell and you can never go back

    // called on a key press
    self.ReceiveInput = function(event) {
        if(event.which == 13) {
            self.EnterInput();
        }
        if(event.key.length === 1) {
            self.RecordInput(event.key);
        }
    }
    self.ProcessDelete = function() {
        if(self.currentCommand.length > 0) {
            self.currentCommand = self.currentCommand.slice(0, -1);
            let newOUtput = $(".commandOutput").html().slice(0, -1);
            $(".commandOutput").html(newOUtput);
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
                "dir - list contents of current directory",
                "cd - changes directory",
                "cls - clear screen"
            ];
            self.PutTextIntoOutput(output);
        } else if(command === "logout") {
            self.logOutCallback();
        } else if(command === "cls") {
            self.CommandClearScreen();
        } else if(command === "dir") {
            let contents = self.fileSytem.ListCurrentDirectoryContents()
            self.PutTextIntoOutput(contents);
        } else if(command === "pwd") {
            var path = self.fileSytem.GetCurrentPath();
            self.PutTextIntoOutput(path + "</br>");
        } else if(command === "cd..") {
            let path = self.fileSytem.GoToParentDirectory();
            self.PutTextIntoOutput(path + "</br>");
        } else if(command.startsWith("cd ")) {
            let parts = command.split(" ");
            let result = self.fileSytem.GoToChildDirectory(parts[1]);
            self.PutTextIntoOutput(result + "</br>");
        } else {
            // maybe it's a filename they typed? heck if I know
            let file = self.fileSytem.GetFileInCurrentDirectory(command);
            if(file) {
                if(file.execute) {
                    let ex = file.execute;
                    ex(self.PutTextIntoOutput);
                } else {
                    self.PutTextIntoOutput("file corrupt </br>");
                }
            } else {
                self.PutTextIntoOutput("Unknown command </br>");
            }
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

    self.InitializePrompt = function(loginName) {
        let welcomeText = [
            "Welcome " + loginName + "!",
            "",
            "For help type 'help'"
        ];
        self.CommandClear();
        self.PutTextIntoOutput(welcomeText);
        self.EnsureInputDefault();
    }

    $(document).ready(function() {
        $(document).on('keypress',function(e) {
            self.ReceiveInput(e);
        });
        $(document).keyup(function(e){
            if(e.keyCode == 8) {
                self.ProcessDelete();
            }
        });
    });
    
    self.EnsureInputDefault();
}


$(document).ready(function() {

    let computer = new SmithersComputer();
    computer.Initialize();

});