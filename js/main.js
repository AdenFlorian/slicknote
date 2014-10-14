var nextNoteID = 0;

$(function () {
    AssignHandlers();

    // Clear storage
    //localStorage.clear();

    // Create seed notes in storage
    //SeedNotes(3);

    // Load notes from storage
    LoadStoredNotes();
});

function AssignHandlers() {
    $('.note-title').focus(function () {
        $(this).select();
    });
    $('.side-note').click(SideNoteClick);
    $('#note-body').keyup(NoteChanged);
    $('#note-title').keyup(NoteChanged);
    $('#newnotebutton').click(NewNote);
}

function LoadStoredNotes() {
    var notes = {};

    for (var i = 0; i < localStorage.length; i++) {
        notes[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
    }

    console.log(notes[0].title);

    for (var note in notes) {
        // Create sidenote
        if (notes.hasOwnProperty(note)) {
            CreateSideNote(notes[note].id, notes[note].title);
            if (notes[note].id >= nextNoteID) {
                nextNoteID = notes[note].id + 1;
            }
        }
    }
}

function CreateSideNote(id, title) {
    $('#template-sidenote').clone()
        .appendTo('#sidenotes')
        .attr('id', 'note-' + id)
        .show()
        .text(title)
        .click(SideNoteClick);
}

function SideNoteClick() {
    // Save previous/current note
    // Load that note
    LoadNote($(this).attr('id').replace(/note-/, ''));
    // unselect previous note
    $(this).parent().find('.selected').removeClass('selected');
    //Set sidenote to selected
    $(this).addClass('selected');
}

function LoadNote(id) {
    console.log('loading note ' + id);
    var note = JSON.parse(localStorage.getItem('note-' + id));
    $('#note-title').val(note.title);
    $('#note-body').val(note.body);
    $('#note-id').val(id);
}

function SaveCurrentNote() {
    var id = $('#note-id').val();
    console.log('saving note ' + id);
    var headertd = $('#header').find('td');
    headertd.text('Saving...');

    // Save to localStorage
    var note = {
        'id': id,
        'title': $('#note-title').val(),
        'body': $('#note-body').val()
    };
    localStorage.setItem('note-' + id, JSON.stringify(note));
    // Update sidenote
    $('#note-' + id).text(note.title);

    headertd.text('Saved!');
    console.log('Note ' + id + ' was saved!');
}

var timeout = 500;
var timeoutID;

function NoteChanged() {
    clearTimeout(timeoutID);
    var noteID = $('#note-id').val();
    console.log('changing note ' + noteID);
    timeoutID = window.setTimeout(function (noteID) {
        SaveCurrentNote();
    }(noteID), timeout);
}

function NewNoteButton() {
    NewNote();
}

function NewNote() {
    var newID = nextNoteID++;
    var note = {
        'id': newID,
        'title': 'Note ' + newID,
        'body': 'Text of note number ' + newID
    };
    localStorage.setItem('note-' + newID, JSON.stringify(note));
    CreateSideNote(newID, note.title);
}

// Create seed notes
function SeedNotes(amount) {
    for (var i = 0; i < amount; i++) {
        var note = {
            'id': i,
            'title': 'Note ' + i,
            'body': 'Text of note number ' + i
        };
        localStorage.setItem('note-' + i, JSON.stringify(note));
        nextNoteID++;
    }
}
