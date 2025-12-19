/**
 * Celestial Advent Calendar - Logic & Game Loop
 * Stack: Vanilla JS + Canvas Confetti
 */

const calendarData = [
    { id: 1, riddle: "İçinde ne motor yağı var ne de yakıt; sadece sabah kahvenin dökülmeden durabileceği o çukur yuvayım.", answer: "Bardaklık", img: "1.jpeg" },
    { id: 2, riddle: "Passenger Princessin hemen yanındaki derin sessizliğim; genellikle yarım kalmış su şişelerini ve unutulmuş fişleri yutarım.", answer: "Kapı cebi", img: "2.jpeg" },
    { id: 3, riddle: "Karanlık ve ulaşılmazım; bozuk paraların, kalemlerin ve anahtarların kaybolup sonsuzluğa uğurlandığı o gizli çukurum.", answer: "Koltuğun altı", img: "3.jpg" },
    { id: 4, riddle: "Tavanda asılı duran küçük bir yatağım; camdan gözlerini koruyan o hassas dostun, çizilmeden dinlendiği kadife kaplı odasıyım.", answer: "Gözlük kabı", img: "4.jpeg" },
    { id: 5, riddle: "Aracın kütüphanesiyim ama içinde sadece kullanım kılavuzu ve tozlu belgeler saklarım; yolcunun dizlerine en yakın sırdaşım.", answer: "torpido", img: "9.jpeg" },
    { id: 6, riddle: "Müziğin hemen altında, vitesin bir tık yukarısındayım; anahtarını veya cüzdanını bıraktığın o en dar ve sığ boşluğum.", answer: "Radyo altı", img: "6.jpeg" },
    { id: 7, riddle: "Sırtımı sürücüye yaslamışım ama yüzüm arkadakilere dönük. Ne bir ağzım var ne de elim, ama içine bırakılan her dergiyi veya tableti sıkıca kucaklarım.", answer: "Koltuk cebi", img: "8.jpg" },
    { id: 8, riddle: "Gündüzleri aşağı inip dünyanı karartırım, yukarı kalktığımda ise tavana bir sır gibi yaslanırım. Bazen yüzüne ayna tutarım, bazen de bir otopark kartını bağrımda saklarım.", answer: "Güneşlik", img: "7.jpg" },
    { id: 9, riddle: "Kaptanla her virajda omuz omuzayım; elinin altındaki en yakın kuyu, bezlerin ve temizlik spreylerinin yuvasıyım.", answer: "Kapı cebi", img: "5.jpeg" },
    { id: 10, riddle: "Asıl kapağın yukarısında pusuda bekleyen ikinci bir saklanma yeriyim; her arabada bulunmam, varlığım bir sürprizdir.", answer: "Üst Torpido", img: "10.JPG" },
    { id: 11, riddle: "Dünyayı bir kutuya sığdırdım, cebindeyken her yere ulaştım. Gözüm var görmem ama gösteririm, kulağım var duymam ama duyururum; şarjım biterse bir anda dilsiz kalırım.", answer: "Telefon", img: "11.jpg" },
    { id: 12, riddle: "Arabanın sırtındaki devasa çantayım; tatile giderken dolar taşarım, şehirde ise sadece bir stepneye ev sahipliği yaparım.", answer: "bagaj", img: "12.jpg" },
];

// Uygulama Durumu (State)
let currentStep = parseInt(localStorage.getItem('celestialProgress')) || 1;
let activeBubbleId = null;

// DOM Elementleri
const grid = document.getElementById('calendar-grid');
const modal = document.getElementById('riddle-modal');
const riddleText = document.getElementById('riddle-text');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-answer');
const closeModal = document.querySelector('.close-modal');
const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('music-control');

// Ses Dosyaları (Yolları klasör yapına göre düzenle)
const sfx = {
    chime: new Audio('assets/sfx/chime.mp3'), // Açılış sesi
    success: new Audio('assets/sfx/success.mp3'), // Doğru cevap
    locked: new Audio('assets/sfx/locked.mp3') // Kilitli uyarısı
};

// Takvimi Oluştur
function renderCalendar() {
    grid.innerHTML = ''; // Temizle
    
    calendarData.forEach(item => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Durum Kontrolü
        if (item.id < currentStep) {
            // Çözülmüş
            bubble.classList.add('solved');
            bubble.style.backgroundImage = `url('assets/images/${item.img}')`;
            bubble.innerHTML = ''; // Numarayı kaldır
        } else if (item.id === currentStep) {
            // Aktif
            bubble.classList.add('active');
            bubble.innerHTML = `<span>${item.id}</span>`;
        } else {
            // Kilitli
            bubble.classList.add('locked');
            bubble.innerHTML = `<span>${item.id}</span>`;
        }

        bubble.addEventListener('click', () => onBubbleClick(item));
        grid.appendChild(bubble);
    });
}

// Baloncuk Tıklama Olayı
function onBubbleClick(item) {
    if (item.id > currentStep) {
        // Kilitli efekt
        sfx.locked.play();
        triggerShake(document.querySelector(`.bubble:nth-child(${item.id})`));
        return;
    }

    if (item.id < currentStep) {
        // Zaten açılmış resme tıklanırsa büyütebilirsin (opsiyonel)
        return;
    }

    // Modal Aç
    activeBubbleId = item.id;
    riddleText.innerText = item.riddle;
    answerInput.value = '';
    modal.classList.remove('hidden');
    sfx.chime.play();
}

// Cevap Kontrolü
submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

function checkAnswer() {
    const input = answerInput.value.trim().toLowerCase();
    const correct = calendarData.find(d => d.id === activeBubbleId).answer.toLowerCase();

    if (input === correct) {
        handleSuccess();
    } else {
        sfx.locked.play();
        triggerShake(modal.querySelector('.modal-content'));
    }
}

function handleSuccess() {
    sfx.success.play();
    modal.classList.add('hidden');

    if (currentStep === 12) {
        // Oyun Bitti
        localStorage.setItem('celestialProgress', 13);
        currentStep = 13;
        renderCalendar();
        showFinalSurprise();
    } else {
        currentStep++;
        localStorage.setItem('celestialProgress', currentStep);
        renderCalendar();
    }
}

// Titreme Efekti
function triggerShake(element) {
    element.classList.add('shake-anim');
    setTimeout(() => element.classList.remove('shake-anim'), 500);
}

// Final Konfeti ve Mesaj
function showFinalSurprise() {
    confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff']
    });

    document.getElementById('final-screen').classList.remove('hidden');
}

// Müzik ve Modal Kapama
muteBtn.onclick = () => {
    if (bgMusic.paused) {
        bgMusic.play();
        muteBtn.innerHTML = '🔊';
    } else {
        bgMusic.pause();
        muteBtn.innerHTML = '🔇';
    }
};

closeModal.onclick = () => modal.classList.add('hidden');

// Başlat
window.onload = () => {
    renderCalendar();
    if(currentStep > 12) showFinalSurprise();
};
