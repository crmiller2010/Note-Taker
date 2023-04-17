let $note1 = $(".note-title");

let $note2 = $(".note-textarea");

let $saveBtn = $(".save-note");

let $newBtn = $(".new-note");

let $noteList = $(".list-container .list-group");


let activeNote = {};


const getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};


const saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};


const deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};


const renderActiveNote = function() {
  $saveBtn.hide();

  if (activeNote.id) {
    $note1.attr("readonly", true);
    $note2.attr("readonly", true);
    $note1.val(activeNote.title);
    $note2.val(activeNote.text);
  } else {
    $note1.attr("readonly", false);
    $note2.attr("readonly", false);
    $note1.val("");
    $note2.val("");
  }
};


const handleNoteSave = function() {
  var newNote = {
    title: $note1.val(),
    text: $note2.val()
  };

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};


const handleNoteDelete = function(event) {
  
  event.stopPropagation();

  const note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};


const handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};


const handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};




const handleRenderSaveBtn = function() {
  if (!$note1.val().trim() || !$note2.val().trim()) {
    $saveBtn.hide();
  } else {
    $saveBtn.show();
  }
};


const renderNoteList = function(notes) {
  $noteList.empty();

  let noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
   let note = notes[i];

    let $li = $("<li class='list-group-item'>").data(note);
    let $span = $("<span>").text(note.title);
   let $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};



const getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$note1.on("keyup", handleRenderSaveBtn);
$note2.on("keyup", handleRenderSaveBtn);



getAndRenderNotes();
