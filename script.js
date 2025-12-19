/**
 * Celestial Advent Calendar - Final Logic
 * GitHub Pages Uyumlu & Dinamik Gün Başlıklı
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

// İlerleme Durumu
let currentStep = parseInt(localStorage.getItem('celestialProgress')) || 1;
let activeBubbleId = null;

// DOM Elementleri
const grid = document.getElementById('calendar-grid');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const riddleText = document.getElementById('riddle-text');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const closeBtn = document.getElementById('close-btn');
const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
const iconOn = document.getElementById('icon-on');
const iconOff = document.getElementById('icon-off');

// Ses Efektleri (Dosyalar GitHub ana dizinde olmalı)
const sfx = {
    chime: new Audio('chime.mp3'),
    success: new Audio('success.mp3'),
    locked: new Audio('locked.mp3')
};

// Takvimi Başlat/Yenile
function renderCalendar() {
    grid.innerHTML = ''; // Önce temizle
    
    calendarData.forEach(item => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        if (item.id < currentStep) {
            // Çözülmüş baloncuklar
            bubble.classList.add('solved');
            bubble.style.backgroundImage = `url('${item.img}')`;
            bubble.innerHTML = ''; 
        } else if (item.id === currentStep) {
            // Şu anki aktif baloncuk
            bubble.classList.add('active');
            bubble.innerHTML = `<span>${item.id}</span>`;
        } else {
            // Gelecek (kilitli) baloncuklar
            bubble.classList.add('locked');
            bubble.innerHTML = `<span>${item.id}</span>`;
        }

        bubble.onclick = () => handleBubbleClick(item);
        grid.appendChild(bubble);
    });
}

// Baloncuk Tıklama Mantığı
function handleBubbleClick(item) {
    if (item.id > currentStep) {
        sfx.locked.play();
        const el = document.querySelector(`.bubble:nth-child(${item.id})`);
        el.classList.add('shake-anim');
        setTimeout(() => el.classList.remove('shake-anim'), 500);
        return;
    }

    if (item.id < currentStep) return;

    // Modalı Hazırla
    activeBubbleId = item.id;
    modalTitle.innerText = `Day ${item.id}`; // Başlığı güncelliyoruz
    riddleText.innerText = item.riddle;
    answerInput.value = '';
    
    // Modalı Göster
    modalOverlay.classList.add('active');
    sfx.chime.play();

    // İlk tıklamada müziği başlat (Tarayıcı izni için)
    if (bgMusic.paused) {
        bgMusic.play().catch(() => console.log("Müzik için etkileşim bekleniyor..."));
    }
}

// Cevap Kontrolü
function checkAnswer() {
    const input = answerInput.value.trim().toLowerCase();
    const correct = calendarData.find(d => d.id === activeBubbleId).answer.toLowerCase();

    // Türkçe karakter toleransı için küçük bir düzenleme (isteğe bağlı)
    const normalizedInput = input.replace(/i/g, 'İ').toLowerCase();
    const normalizedCorrect = correct.replace(/i/g, 'İ').toLowerCase();

    if (normalizedInput === normalizedCorrect) {
        sfx.success.play();
        modalOverlay.classList.remove('active');
        
        if (currentStep === 12) {
            currentStep = 13;
            localStorage.setItem('celestialProgress', 13);
            renderCalendar();
            triggerFinal();
        } else {
            currentStep++;
            localStorage.setItem('celestialProgress', currentStep);
            renderCalendar();
        }
    } else {
        sfx.locked.play();
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.add('shake-anim');
        setTimeout(() => modalContent.classList.remove('shake-anim'), 500);
    }
}

// Final Kutlaması
function triggerFinal() {
    confetti({
        particleCount: 250,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#ffeb3b']
    });
    document.getElementById('final-screen').classList.remove('hidden');
}

// Event Listeners (Tıklama Dinleyicileri)
submitBtn.onclick = checkAnswer;
answerInput.onkeypress = (e) => { if (e.key === 'Enter') checkAnswer(); };
closeBtn.onclick = () => modalOverlay.classList.remove('active');

// Müzik Kontrolü (Aç/Kapat)
muteBtn.onclick = () => {
    if (bgMusic.paused) {
        bgMusic.play();
        iconOn.classList.add('active');
        iconOff.style.display = 'none';
        iconOn.style.display = 'block';
    } else {
        bgMusic.pause();
        iconOn.classList.remove('active');
        iconOn.style.display = 'none';
        iconOff.style.display = 'block';
    }
};

// Sayfa yüklendiğinde başlat
window.onload = () => {
    renderCalendar();
    if(currentStep > 12) triggerFinal();
};
