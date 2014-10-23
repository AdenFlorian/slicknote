var nextNoteID = 0;

$(document).ready(function () {
    $('#summernote').summernote({
                                    //height: '400', // set editor height
                                    minHeight: null, // set minimum height of editor
                                    maxHeight: null, // set maximum height of editor
                                    focus: true, // set focus to editable area after initializing summernote
                                    onChange: function (contents, $editable) {
                                        NoteChanged();
                                    }
                                });
    AssignHandlers();

    var loadedCount = LoadStoredNotes();

    if (loadedCount === 0) {
        NewNote();
    }

    ClickFirstSideNote();

    // Setup keybinds
    $(document).keydown(function (event) {
        switch (event.which) {
            case 46:    // Delete
                OnDeleteKey();
                break;
            default:
                break;
        }
        // Stop letter from being typed into new input box if applicable
        //event.preventDefault();
    });
})
;

function AssignHandlers() {
    $('.note-title').focus(function () {
        $(this).select();
    });
    $('.side-note').click(SideNoteClick);
    //$('#summernote').keyup(NoteChanged);
    $('#note-title').keyup(NoteChanged);
    $('#newnotebutton').click(NewNote);
}

function OnDeleteKey() {
    var $sidenote = $('.side-note:focus');
    if ($sidenote.attr('id')) {
        DeleteNote($sidenote.attr('id').replace(/note-/, ''));
    }
}

function ClickFirstSideNote() {
    $('#sidenotes').children(':first-child').click();
}

/**
 * Loads all notes from window.localStorage
 * @return {number} loadedCount - Number of notes loaded
 */
function LoadStoredNotes() {
    var items = {};
    var loadedCount = 0;

    for (var i = 0; i < localStorage.length; i++) {
        try {
            items[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
        }
        catch (e) {
        }
    }

    for (var item in items) {
        if (items.hasOwnProperty(item) && items[item].title) {
            CreateSideNote(items[item].id, items[item].title);
            if (items[item].id >= nextNoteID) {
                nextNoteID = items[item].id + 1;
            }
            loadedCount++;
        }
    }

    return loadedCount;
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

function DeleteNote(id) {
    localStorage.removeItem('note-' + id);
    $('#note-' + id).remove();
    ClearEditor();
}

function ClearEditor() {
    $('#note-title').val('');
    $('#summernote').code('');
    $('#note-id').val('');
}

function LoadNote(id) {
    console.log('loading note ' + id);
    var note = JSON.parse(localStorage.getItem('note-' + id));
    $('#note-title').val(note.title);
    $('#summernote').code(note.body);
    $('#note-id').val(id);
}

function SaveCurrentNote() {
    var id = $('#note-id').val();
    //console.log('saving note ' + id);
    var headertd = $('#header').find('td');
    headertd.text('Saving...');

    // Save to localStorage
    var note = {
        'id': id,
        'title': $('#note-title').val(),
        'body': $('#summernote').code()
    };
    localStorage.setItem('note-' + id, JSON.stringify(note));
    // Update sidenote
    $('#note-' + id).text(note.title);

    headertd.text('Saved!');
    //console.log('Note ' + id + ' was saved!');
}

var timeout = 500;
var timeoutID;

function NoteChanged() {
    clearTimeout(timeoutID);
    var noteID = $('#note-id').val();
    //console.log('changing note ' + noteID);
    timeoutID = window.setTimeout(function () {
        SaveCurrentNote();
    }, timeout);
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
