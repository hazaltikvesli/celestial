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
    { id: 12, riddle: "Arabanın sırtındaki devase çantayım; tatile giderken dolar taşarım, şehirde ise sadece bir stepneye ev sahipliği yaparım.", answer: "bagaj", img: "12.jpg" },
];

let currentStep = parseInt(localStorage.getItem('celestialProgress')) || 1;
let activeBubbleId = null;

const grid = document.getElementById('calendar-grid');
const modalOverlay = document.getElementById('modal-overlay');
const bgMusic = document.getElementById('bg-music');
const sfx = { chime: new Audio('chime.mp3'), success: new Audio('success.mp3'), locked: new Audio('locked.mp3') };

function renderCalendar() {
    grid.innerHTML = '';
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    calendarData.forEach((item, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const angle = (index / calendarData.length) * Math.PI * 2;
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
        const x = centerX + Math.cos(angle) * radius - 55;
        const y = centerY + Math.sin(angle) * radius - 55;

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        const size = 100 + (index % 3) * 15;
        bubble.style.width = bubble.style.height = `${size}px`;
        bubble.style.animationDelay = `${index * 0.4}s`;

        if (item.id < currentStep) {
            bubble.classList.add('solved');
            bubble.style.backgroundImage = `url('${item.img}')`;
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
                setTimeout(() => bubble.classList.remove('shake-anim'), 400);
                return;
            }
            if (item.id < currentStep) return;

            activeBubbleId = item.id;
            document.getElementById('modal-title').innerText = `Day ${item.id}`;
            document.getElementById('riddle-text').innerText = item.riddle;
            document.getElementById('answer-input').value = '';
            modalOverlay.classList.add('active');
            sfx.chime.play();
            if (bgMusic.paused) bgMusic.play().catch(() => {});
        };
        grid.appendChild(bubble);
    });
}

document.getElementById('submit-btn').onclick = () => {
    const input = document.getElementById('answer-input').value.trim().toLowerCase();
    const correct = calendarData.find(d => d.id === activeBubbleId).answer.toLowerCase();

    if (input === correct) {
        sfx.success.play();
        modalOverlay.classList.remove('active');
        if (currentStep === 12) {
            currentStep = 13;
            localStorage.setItem('celestialProgress', 13);
            renderCalendar();
            confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
            document.getElementById('final-screen').classList.remove('hidden');
        } else {
            currentStep++;
            localStorage.setItem('celestialProgress', currentStep);
            renderCalendar();
        }
    } else {
        sfx.locked.play();
        document.querySelector('.modal-content').classList.add('shake-anim');
        setTimeout(() => document.querySelector('.modal-content').classList.remove('shake-anim'), 400);
    }
};

document.getElementById('close-btn').onclick = () => modalOverlay.classList.remove('active');
document.getElementById('mute-btn').onclick = () => {
    if (bgMusic.paused) { bgMusic.play(); document.getElementById('icon-on').classList.add('active'); document.getElementById('icon-off').classList.remove('active'); }
    else { bgMusic.pause(); document.getElementById('icon-on').classList.remove('active'); document.getElementById('icon-off').classList.add('active'); }
};

window.onload = renderCalendar;
window.onresize = renderCalendar;
