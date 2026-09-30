const textArea = document.getElementById('text');
const voiceSelect = document.getElementById('voices');
const speakButton = document.getElementById('speak');
const stopButton = document.getElementById('stop');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
const rateValue = document.getElementById('rateValue');
const pitchValue = document.getElementById('pitchValue');
const visualizer = document.getElementById('visualizer');

let voices = [];

function loadVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';

    if (voices.length === 0) {
        const option = document.createElement('option');
        option.textContent = "Ovozlar topilmadi";
        voiceSelect.appendChild(option);
        return;
    }

    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.name;
        voiceSelect.appendChild(option);
    });
}

speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

rateInput.addEventListener('input', () => {
    rateValue.textContent = `${rateInput.value}x`;
});

pitchInput.addEventListener('input', () => {
    pitchValue.textContent = pitchInput.value;
});

speakButton.addEventListener('click', () => {
    const text = textArea.value.trim();
    if (!text) {
        alert("Iltimos, matn kiriting!");
        return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const selectedVoiceName = voiceSelect.value;
    utterance.voice = voices.find(v => v.name === selectedVoiceName);
    utterance.rate = parseFloat(rateInput.value);
    utterance.pitch = parseFloat(pitchInput.value);

    utterance.onstart = () => {
        visualizer.classList.add('active');
    };

    utterance.onend = () => {
        visualizer.classList.remove('active');
    };

    utterance.onerror = () => {
        visualizer.classList.remove('active');
    };

    speechSynthesis.speak(utterance);
});

stopButton.addEventListener('click', () => {
    speechSynthesis.cancel();
    visualizer.classList.remove('active');
});


let audio = new Audio();

speakButton.addEventListener('click', () => {
    const text = textArea.value.trim();
    if (!text) {
        alert("Iltimos, matn kiriting!");
        return;
    }

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=uz&client=tw-ob`;

    audio.src = url;
    audio.play();

    visualizer.classList.add('active');

    audio.onended = () => {
        visualizer.classList.remove('active');
    };


});

stopButton.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    visualizer.classList.remove('active');
});