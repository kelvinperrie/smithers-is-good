const synth = window.speechSynthesis;

let SmithersComputer = function() {
    var self = this;

    self.introTrack = "sounds/Long Hello.mp3";
    self.outroTrack = "sounds/Quite Good.mp3";
    self.name = null;

    self.burnsOpenImage = "images/burns-opened.png";
    self.burnsClosedImage = "images/burns-closed.png";

    self.introSound = null;
    self.outroSound = null;

    self.TurnOn = function(name) {

        self.name = name;
        $(".login-prompt").hide();

        self.MakeImageStop();
        setTimeout(self.PlayIntro , 1000);

    };

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

    self.Initialize = function() {

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
            },
            onload : function() {
                //self.outroLoaded = true;
                //self.AutoStart();
            }
        });

        self.outroSound = outroSound;
    };
}


$(document).ready(function() {

    let computer = new SmithersComputer();
    computer.Initialize();

    $(".turnOnTrigger").click(function() {

        let textToSay = $(".name-input").val();;

        computer.TurnOn(textToSay);
        //computer.SubmitNewName(textToSay);
    });

});