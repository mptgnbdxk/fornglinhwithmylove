let topZIndex = 30;

// --- Canvas Đỏ Trắng Caro + Trang Trí Sống Động ---
function initCanvasBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 2,
        color: Math.random() > 0.5 ? 'rgba(255, 105, 180, 0.4)' : 'rgba(255, 255, 255, 0.6)',
        speedY: (Math.random() - 0.5) * 0.4,
        speedX: (Math.random() - 0.5) * 0.4
      });
    }
  }

  function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const size = 36;
    for (let x = 0; x < canvas.width; x += size) {
      for (let y = 0; y < canvas.height; y += size) {
        if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#ffd6d6';
        }
        ctx.fillRect(x, y, size, size);
      }
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    const gridSize = 72;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(drawBackground);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawBackground();
}

// --- Photos List for Album ---
// Lưu ý: Hãy đảm bảo các đường dẫn ảnh này khớp với thư mục thực tế của bạn
const defaultPhotos = [
  { url: "ảnh/hoabik.jpg", caption: "embe_nha_dhien_phai_hog:> 🌸" },
  { url: "ảnh/anh2.jpg", caption: "cai_tay_dep_mun_xiu.exe ✨" },
  { url: "ảnh/0b624e40-0d7b-4e3c-aadc-0a836510ad6b.jpg", caption: "anh_mun_sau_nay_chung_minh_cung_zay" }
];
let currentPhotoIndex = 0;

function updatePhotoDisplay() {
  const imgEl = document.getElementById('nlinh-img-display');
  const captionEl = document.getElementById('img-caption');
  if (imgEl && captionEl && defaultPhotos.length > 0) {
    imgEl.src = defaultPhotos[currentPhotoIndex].url;
    captionEl.innerText = defaultPhotos[currentPhotoIndex].caption;
  }
}

function prevPhoto() {
  playClickSound();
  currentPhotoIndex = (currentPhotoIndex - 1 + defaultPhotos.length) % defaultPhotos.length;
  updatePhotoDisplay();
}

function nextPhoto() {
  playClickSound();
  currentPhotoIndex = (currentPhotoIndex + 1) % defaultPhotos.length;
  updatePhotoDisplay();
}

// --- Window Drag & Drop System ---
let activeWin = null;
let offsetX = 0, offsetY = 0;

function bringToFront(winId) {
  const win = document.getElementById(winId);
  if (win) {
    topZIndex += 1;
    win.style.zIndex = topZIndex;
  }
}

function openWindow(winId) {
  playClickSound();
  const win = document.getElementById(winId);
  if (win) {
    win.classList.remove('hidden');
    win.classList.add('flex');
    bringToFront(winId);
    updateTaskbar();
  }
}

function closeWindow(winId) {
  playClickSound();
  const win = document.getElementById(winId);
  if (win) {
    win.classList.add('hidden');
    win.classList.remove('flex');
    updateTaskbar();
  }
}

function dragStart(e, winId) {
  bringToFront(winId);
  activeWin = document.getElementById(winId);
  const rect = activeWin.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;

  document.addEventListener('mousemove', dragging);
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchmove', dragging);
  document.addEventListener('touchend', dragEnd);
}

function dragging(e) {
  if (!activeWin) return;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  let left = clientX - offsetX;
  let top = clientY - offsetY;

  left = Math.max(0, Math.min(window.innerWidth - activeWin.offsetWidth, left));
  top = Math.max(0, Math.min(window.innerHeight - activeWin.offsetHeight - 50, top));

  activeWin.style.left = left + 'px';
  activeWin.style.top = top + 'px';
}

function dragEnd() {
  activeWin = null;
  document.removeEventListener('mousemove', dragging);
  document.removeEventListener('mouseup', dragEnd);
  document.removeEventListener('touchmove', dragging);
  document.removeEventListener('touchend', dragEnd);
}

// --- Taskbar Management ---
function updateTaskbar() {
  const container = document.getElementById('taskbar-tabs');
  if (!container) return;
  container.innerHTML = '';

  const winList = [
    { id: 'win-letter', title: 'Thu_Gui_Nlinh' },
    { id: 'win-album', title: 'Album_Nlinh' },
    { id: 'win-music', title: 'Y2K_Music' },
    { id: 'win-gift', title: 'BatNgo_2010' },
    { id: 'win-dialog', title: 'Question' }
  ];

  winList.forEach(w => {
    const el = document.getElementById(w.id);
    // Kiểm tra chính xác xem cửa sổ có đang hiển thị hay không (không chứa class hidden)
    if (el && !el.classList.contains('hidden')) {
      const btn = document.createElement('button');
      btn.className = 'btn-y2k-3d px-2.5 py-0.5 font-pixel text-[10px] text-purple-900 shrink-0 rounded';
      btn.innerText = w.title;
      btn.onclick = () => bringToFront(w.id);
      container.appendChild(btn);
    }
  });
}

// --- Click Sparkle Effect ---
function spawnSparkle(e) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle font-pixel text-pink-500 text-sm';
  sparkle.style.left = (e.clientX - 10) + 'px';
  sparkle.style.top = (e.clientY - 10) + 'px';
  const symbols = ['✦', '★', '💖', '✨', '🌸', '🐰'];
  sparkle.innerText = symbols[Math.floor(Math.random() * symbols.length)];
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 700);
}

// --- Dodging "No" Button ---
function dodgeNo() {
  const btnNo = document.getElementById('btn-no');
  if (btnNo) {
    const randomX = (Math.random() - 0.5) * 140;
    const randomY = (Math.random() - 0.5) * 90;
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }
}

function answerLove() {
  triggerSurprise();
  showToast("Biết ngay Nlinh yêu anh nhất mà! 💕🐰");
  closeWindow('win-dialog');
}

// --- Surprise Heart Confetti Effect ---
function triggerSurprise() {
  playClickSound();
  if (window.confetti) {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ffb6c1', '#f472b6', '#c084fc', '#fde047']
    });
  }

  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'fixed text-2xl pointer-events-none z-50 animate-bounce';
      heart.style.left = Math.random() * 90 + 'vw';
      heart.style.top = Math.random() * 80 + 'vh';
      heart.innerText = ['💖', '🌸', '🐰', '✨'][Math.floor(Math.random() * 4)];
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1500);
    }, i * 100);
  }
}

// --- Toast Popup ---
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (toast && toastMsg) {
    toastMsg.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
  }
}

function toggleStartMenu() {
  playClickSound();
  const menu = document.getElementById('start-menu');
  if (menu) {
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
  }
}

// --- Realtime Clock ---
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const clockEl = document.getElementById('clock');
  if (clockEl) clockEl.innerText = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- Audio System (Web Audio API Synthesizer) ---
let audioCtx = null;
let isPlaying = false;
let musicTimer = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playClickSound() {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {}
}

const lofiNotes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];
function playMelodyStep() {
  if (!audioCtx || !isPlaying) return;
  const note = lofiNotes[Math.floor(Math.random() * lofiNotes.length)];
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(note, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 1.2);

  for (let i = 1; i <= 5; i++) {
    const bar = document.getElementById(`bar${i}`);
    if (bar) bar.style.height = (Math.random() * 16 + 4) + 'px';
  }
}

function toggleMusic() {
  initAudio();
  const disc = document.getElementById('music-cd');
  const playIcon = document.getElementById('play-icon');
  const playText = document.getElementById('play-text');
  if (isPlaying) {
    isPlaying = false;
    clearInterval(musicTimer);
    if (disc) disc.classList.remove('cd-spin');
    if (playIcon) playIcon.className = 'fa-solid fa-play text-pink-500';
    if (playText) playText.innerText = 'PLAY MUSIC';
  } else {
    isPlaying = true;
    if (disc) disc.classList.add('cd-spin');
    if (playIcon) playIcon.className = 'fa-solid fa-pause text-pink-500';
    if (playText) playText.innerText = 'PAUSE';
    musicTimer = setInterval(playMelodyStep, 700);
  }
}

// Khởi chạy khi tải trang xong
window.onload = () => {
  initCanvasBackground();
  openWindow('win-letter'); // Mở sẵn thư tình và tự động cập nhật taskbar
  updatePhotoDisplay();
};
