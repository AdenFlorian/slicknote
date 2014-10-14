$(function () {
    AssignHandlers();

    // Create seed notes in storage
    localStorage.notes = JSON.stringify({
                                            '0': {
                                                'title': 'First Note',
                                                'body': 'First note text...'
                                            },
                                            '1': {
                                                'title': 'Second Note',
                                                'body': 'Second note text...'
                                            },
                                            '2': {
                                                'title': 'Third Note',
                                                'body': 'Third note text...'
                                            }
                                        });

    // Load notes from storage
    var notes = JSON.parse(localStorage.notes);

    if (notes[0].title.length < 1) {
        console.log('error loading notes');
    }

    for (var note in notes) {
        // Create sidenote
        if (notes.hasOwnProperty(note)) {
            CreateSideNote(note, notes[note].title);
        }
    }
});

function AssignHandlers() {
    $('.note-title').focus(function () {
        $(this).select();
    });
    $('.side-note').click(SideNoteClick);
    $('#note-body').keyup(NoteChanged);
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
    var note = JSON.parse(localStorage.notes)[id];
    $('#note-title').val(note.title);
    $('#note-body').val(note.body);
    $('#note-id').val(id);
}

function SaveCurrentNote() {
    var id = $('#note-id').val();
    console.log('saving note ' + id);
    var headertd = $('#header').find('td');
    headertd.text('Saving...');
    var notes = JSON.parse(localStorage.notes);
    notes[id].title = $('#note-title').val();
    notes[id].body = $('#note-body').val();
    localStorage.notes = JSON.stringify(notes);
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
    CreateSideNote()
}

function NewNote() {

}
