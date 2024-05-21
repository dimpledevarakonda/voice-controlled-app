// script.js
const startButton = document.getElementById('start-recording');
const stopButton = document.getElementById('stop-recording');
const saveButton = document.getElementById('save-note');
const downloadButton = document.getElementById('download-text');
const noteText = document.getElementById('note-text');
const addCategoryButton = document.getElementById('add-category');
const categoryInput = document.getElementById('category-input');
const categorySelect = document.getElementById('category-select');
const filterCategorySelect = document.getElementById('filter-category');
const notesList = document.getElementById('notes-list');

let recognition;
let isRecording = false;
let categories = [];
let notes = [];

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert("Your browser does not support speech recognition.");
}

recognition.continuous = true;
recognition.interimResults = false;

startButton.addEventListener('click', () => {
    if (!isRecording) {
        recognition.start();
        isRecording = true;
        console.log("Recording started...");
    }
});

stopButton.addEventListener('click', () => {
    if (isRecording) {
        recognition.stop();
        isRecording = false;
        console.log("Recording stopped.");
    }
});

recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript;
    noteText.value += transcript + ' ';
};

recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    recognition.stop();
    isRecording = false;
};

addCategoryButton.addEventListener('click', () => {
    const category = categoryInput.value.trim();
    if (category && !categories.includes(category)) {
        categories.push(category);
        updateCategorySelect();
        categoryInput.value = '';
    }
});

saveButton.addEventListener('click', () => {
    const note = noteText.value.trim();
    const category = categorySelect.value;
    if (note && category) {
        notes.push({ text: note, category: category });
        displayNotes();
        noteText.value = '';
    } else {
        alert('Note and category cannot be empty!');
    }
});

downloadButton.addEventListener('click', () => {
    const filter = filterCategorySelect.value;
    const filteredNotes = filter === 'All' ? notes : notes.filter(note => note.category === filter);
    const text = filteredNotes.map(note => `[${note.category}] ${note.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filter === 'All' ? 'all_notes.txt' : `${filter}_notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

filterCategorySelect.addEventListener('change', displayNotes);

function updateCategorySelect() {
    categorySelect.innerHTML = `<option value="" disabled selected>Select category</option>`;
    filterCategorySelect.innerHTML = `<option value="" selected>All</option>`;
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
        
        const filterOption = document.createElement('option');
        filterOption.value = category;
        filterOption.textContent = category;
        filterCategorySelect.appendChild(filterOption);
    });
}

function displayNotes() {
    const filter = filterCategorySelect.value;
    notesList.innerHTML = '';
    notes.forEach(note => {
        if (filter === 'All' || note.category === filter) {
            const li = document.createElement('li');
            li.textContent = `[${note.category}] ${note.text}`;
            notesList.appendChild(li);
        }
    });
}
