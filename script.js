const calendarData = [ /* ... Yukarıdaki bilmeceler buraya ... */ ];

let currentStep = parseInt(localStorage.getItem('celestialProgress')) || 1;
const grid = document.getElementById('calendar-grid');
const modal = document.getElementById('riddle-modal');
const input = document.getElementById('answer-input');
let activeBubbleId = null;

// Ses Efektleri
const sfx = {
    click: new Audio('assets/chime.mp3'),
    wrong: new Audio('assets/shake.mp3'),
    success: new Audio('assets/success.mp3')
};

function initCalendar() {
    grid.innerHTML = '';
    calendarData.forEach(item => {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.innerHTML = `<span>${item.id}</span>`;
        
        if (item.id < currentStep) {
            bubble.classList.add('solved');
            bubble.style.backgroundImage = `url('assets/${item.img}')`;
            bubble.innerHTML = '';
        } else if (item.id === currentStep) {
            bubble.classList.add('active');
        } else {
            bubble.classList.add('locked');
        }

        bubble.onclick = () => handleBubbleClick(item);
        grid.appendChild(bubble);
    });
}

function handleBubbleClick(item) {
    if (item.id > currentStep) {
        triggerShake();
        return;
    }
    if (item.id < currentStep) return; // Zaten çözülmüş

    activeBubbleId = item.id;
    document.getElementById('riddle-text').innerText = item.riddle;
    modal.classList.remove('hidden');
    sfx.click.play();
}

document.getElementById('submit-answer').onclick = () => {
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = calendarData.find(d => d.id === activeBubbleId).answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        successTransition();
    } else {
        triggerShake();
    }
};

function successTransition() {
    sfx.success.play();
    modal.classList.add('hidden');
    input.value = '';
    
    if (currentStep === 12) {
        triggerFinal();
    } else {
        currentStep++;
        localStorage.setItem('celestialProgress', currentStep);
        initCalendar();
    }
}

function triggerFinal() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#ffeb3b']
    });
    document.getElementById('final-screen').classList.remove('hidden');
}

function triggerShake() {
    modal.classList.add('shake');
    setTimeout(() => modal.classList.remove('shake'), 500);
}

// Müzik Kontrolü
const music = document.getElementById('bg-music');
document.getElementById('music-control').onclick = () => {
    if (music.paused) {
        music.play();
        document.getElementById('mute-icon').innerText = '🔊';
    } else {
        music.pause();
        document.getElementById('mute-icon').innerText = '🔇';
    }
};

initCalendar();
