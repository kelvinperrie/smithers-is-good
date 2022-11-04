const synth = window.speechSynthesis;

let SmithersComputer = function() {
    var self = this;

    self.introTrack = "sounds/testsoundintro.mp3";
    self.outroTrack = "sounds/testsoundoutro.mp3";
    self.name = null;

    self.introSound = null;
    self.outroSound = null;

    self.TurnOn = function(name) {

        //self.name = name;

        self.PlayIntro();

    };

    self.PlayIntro = function() {
        console.log("playing intro");
        //self.introSound.play();

        const utterThis = new SpeechSynthesisUtterance("Hello");
        synth.speak(utterThis);
        self.SayName();
    }

    self.SayName = function() {
        const utterThis = new SpeechSynthesisUtterance(self.name);
        synth.speak(utterThis);
        self.PlayOutro();
    }

    self.PlayOutro = function() {
        console.log("playing outro");
        //self.outroSound.play();

        const utterThis = new SpeechSynthesisUtterance("You're quite good, at turning me on");
        synth.speak(utterThis);
    }

    self.UpdateNameFromParam = function(nameFromParam) {
        self.name = nameFromParam;
        $(".name-input").val(self.name );
    }

    self.AutoStart = function() {
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
                self.introLoaded = true;
                self.AutoStart();
            }
        });

        self.introSound = introSound;

        var outroSound = new Howl({
            src: [self.outroTrack],
            onend : function() {
                console.log('outro stopped!');
            },
            onload : function() {
                self.outroLoaded = true;
                self.AutoStart();
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

        computer.SubmitNewName(textToSay);
    });

});