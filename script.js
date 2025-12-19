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
    { id: 12, riddle: "Arabanın sırtındaki devasa çantayım; tatile giderken dolar taşarım, şehirde ise sadece bir stepneye ev sahipliği yaparım.", answer: "bagaj", img: "12.jpg" }
];

let currentStep = parseInt(localStorage.getItem('celestialProgress')) || 1;
let activeBubbleId = null;

// DOM Elementleri
const grid = document.getElementById('calendar-grid');
const modalOverlay = document.querySelector('.modal-overlay'); // Yeni overlay
const modalContent = document.querySelector('.modal-content');
const riddleText = document.getElementById('riddle-text');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.querySelector('.modal-content button');
const closeModal = document.querySelector('.modal-close');
const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
const iconOn = document.getElementById('icon-on');
const iconOff = document.getElementById('icon-off');

// Sesler
const sfx = {
    chime: new Audio('chime.mp3'),
    success: new Audio('success.mp3'),
    locked: new Audio('locked.mp3')
};

function renderCalendar() {
    grid.innerHTML = '';
    calendarData.forEach(item => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        if (item.id < currentStep) {
            bubble.classList.add('solved');
            bubble.style.backgroundImage = `url('${item.img}')`; // GitHub ana dizin için düzenlendi
        } else if (item.id === currentStep) {
            bubble.classList.add('active');
            bubble.innerHTML = `<span>${item.id}</span>`;
        } else {
            bubble.classList.add('locked');
            bubble.innerHTML = `<span>${item.id}</span>`;
        }

        bubble.onclick = () => {
            if (item.id > currentStep) {
                sfx.locked.play();
                bubble.classList.add('shake-anim');
                setTimeout(() => bubble.classList.remove('shake-anim'), 500);
                return;
            }
            if (item.id < currentStep) return;

            activeBubbleId = item.id;
            riddleText.innerText = item.riddle;
            answerInput.value = '';
            modalOverlay.classList.add('active'); // Overlay'i göster
            sfx.chime.play();
            
            // İlk etkileşimde müziği başlat (Tarayıcı engeli için)
            if (bgMusic.paused) bgMusic.play();
        };
        grid.appendChild(bubble);
    });
}

function checkAnswer() {
    const input = answerInput.value.trim().toLowerCase();
    const correct = calendarData.find(d => d.id === activeBubbleId).answer.toLowerCase();

    if (input === correct) {
        sfx.success.play();
        modalOverlay.classList.remove('active');
        
        if (currentStep === 12) {
            currentStep = 13;
            localStorage.setItem('celestialProgress', 13);
            renderCalendar();
            confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
            alert("Yeni Yılın Kutlu Olsun Sevgilim!"); // Buraya görsel bir final de eklenebilir
        } else {
            currentStep++;
            localStorage.setItem('celestialProgress', currentStep);
            renderCalendar();
        }
    } else {
        sfx.locked.play();
        modalContent.classList.add('shake-anim');
        setTimeout(() => modalContent.classList.remove('shake-anim'), 500);
    }
}

// Event Listeners
submitBtn.onclick = checkAnswer;
answerInput.onkeypress = (e) => { if (e.key === 'Enter') checkAnswer(); };
closeModal.onclick = () => modalOverlay.classList.remove('active');

muteBtn.onclick = () => {
    if (bgMusic.paused) {
        bgMusic.play();
        iconOn.classList.add('active');
        iconOff.classList.remove('active');
    } else {
        bgMusic.pause();
        iconOn.classList.remove('active');
        iconOff.classList.add('active');
    }
};

window.onload = renderCalendar;
