let editingIndex = -1;

// Generate pastel color
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
}

// Format timestamp
function getFormattedTimestamp() {
    const now = new Date();
    return now.toLocaleString();
}

// Save or update a note
function saveNote() {
    const noteInput = document.getElementById("noteInput");
    const text = noteInput.value.trim();

    if (text === "") {
        alert("Please enter a note!");
        return;
    }

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (editingIndex > -1) {
        notes[editingIndex].text = text;
        notes[editingIndex].timestamp = getFormattedTimestamp();
        editingIndex = -1;
    } else {
        const noteColor = getRandomColor();
        notes.push({
            text,
            color: noteColor,
            timestamp: getFormattedTimestamp()
        });
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    noteInput.value = "";
    document.getElementById("cancelEditBtn").style.display = "none";
    displayNotes();
}

// Cancel editing
function cancelEdit() {
    document.getElementById("noteInput").value = "";
    editingIndex = -1;
    document.getElementById("cancelEditBtn").style.display = "none";
}

// Display notes
function displayNotes() {
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = "";

    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.forEach((note, index) => {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
        noteDiv.style.background = note.color;

        const noteText = document.createElement("p");
        noteText.textContent = note.text;

        const timeStamp = document.createElement("small");
        timeStamp.textContent = `🕒 ${note.timestamp}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = function (event) {
            event.stopPropagation();
            deleteNote(index);
        };

        noteDiv.onclick = function () {
            document.getElementById("noteInput").value = note.text;
            editingIndex = index;
            document.getElementById("cancelEditBtn").style.display = "inline-block";
        };

        noteDiv.appendChild(noteText);
        noteDiv.appendChild(timeStamp);
        noteDiv.appendChild(deleteBtn);
        notesContainer.appendChild(noteDiv);
    });
}

// Delete note with confirmation
function deleteNote(index) {
    if (confirm("Are you sure you want to delete this note?")) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        editingIndex = -1;
        document.getElementById("cancelEditBtn").style.display = "none";
        displayNotes();
    }
}

// Load notes on page load
document.addEventListener("DOMContentLoaded", displayNotes);
