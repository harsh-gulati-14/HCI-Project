try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}


var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');

var noteContent = '';

// Get all notes from previous sessions and display them.


/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        noteContent += transcript;
        noteTextarea.val(noteContent);
    }
};

recognition.onstart = function() {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
    instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        instructions.text('No speech was detected. Try again.');
    };
}



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
        noteContent += ' ';
    }
    recognition.start();
});


$('#pause-record-btn').on('click', function(e) {
    recognition.stop();
    instructions.text('Voice recognition paused.');
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
    noteContent = $(this).val();
})

$('#save-note-btn').on('click', function(e) {
    recognition.stop();

    if (!noteContent.length) {
        instructions.text('Could not save empty note. Please add a message to your note.');
    } else {
        // Save note to localStorage.
        // The key is the dateTime with seconds, the value is the content of the note.
        // Reset variables and update UI.
        checkspeech(noteContent);
        noteContent = '';
       
        noteTextarea.val('');
        instructions.text('Note saved successfully.');
    }

})




/*-----------------------------
      Helper Functions 
------------------------------*/

function checkspeech(note) {
    var html = '';
    console.log(note);
    if(note==="this is human computer interaction project")
    {
        html += `<div class="note">
        <p class="header">
        <h4 class="content" style="color: #8ac000;">Correct Answer</h4>
        </p>
        </div>`;
        readOutText('correct answer')
    }
    else{
        html += `<div class="note">
        <p class="header">
        <h4 class="content" style="color: red;">Wrong Answer</h4>
        </p>
        </div>`;
        readOutText('wrong answer')
    }
    notesList.html(html);
}

function readOutLoud(message,id) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 3;
    speech.rate = 1;
    speech.pitch = 3;
    document.getElementById(id).style.color = "red";
    window.speechSynthesis.speak(speech);
    if(message=="welcome to Sahaara, Listening and Typing Test")
    {
        speech.text = "Move to the left section, to listen the text";
        window.speechSynthesis.speak(speech);
    }
    speech.onend = () => {
        console.log("Utterance has finished being spoken after");
        document.getElementById(id).style.color = "#1da7da";
      }
}
function readOutMessage(message,id) {
    var speech = new SpeechSynthesisUtterance();

    speech.text = message;
    speech.volume = 3;
    speech.rate = 0.2;
    speech.pitch = 3;
    document.getElementById(id).style.color = "red";

    window.speechSynthesis.speak(speech);
    speech.rate = 1;
    speech.text = "Please type in the text box";
    window.speechSynthesis.speak(speech);
    speech.onend = () => {
        console.log("Utterance has finished being spoken after");
        document.getElementById(id).style.color = "#1da7da";
      }
}
function readOutText(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 3;
    speech.rate = 1;
    speech.pitch = 3;
    // document.getElementById(id).style.color = "red";

    window.speechSynthesis.speak(speech);
}

