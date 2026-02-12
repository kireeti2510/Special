/* ============================================
   VALENTINE'S DAY – JAVASCRIPT
   ============================================ */

// ---- Floating Hearts Background ----
function createFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const hearts = ['💕', '💖', '💗', '💓', '💘', '💝', '❤️', '🩷', '🤍', '✨'];
  
  function spawnHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
    heart.style.animationDuration = (Math.random() * 6 + 6) + 's';
    heart.style.animationDelay = '0s';
    heart.style.opacity = Math.random() * 0.5 + 0.2;
    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 14000);
  }

  // Initial batch
  for (let i = 0; i < 12; i++) {
    setTimeout(spawnHeart, i * 300);
  }

  // Continuous spawning
  setInterval(spawnHeart, 800);
}

// ---- Sparkles ----
function createSparkles(containerId, count = 15) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 3 + 's';
    sparkle.style.animationDuration = (Math.random() * 2 + 1) + 's';
    container.appendChild(sparkle);
  }
}

// ---- Cursor Heart Trail ----
function initHeartTrail() {
  const canvas = document.getElementById('heartTrail');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -100, y: -100 };
  let lastSpawn = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  });

  function spawnParticle() {
    const emojis = ['💖', '💕', '✨', '💗', '🩷'];
    particles.push({
      x: mouse.x,
      y: mouse.y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 1,
      life: 1,
      decay: 0.015 + Math.random() * 0.01,
      size: Math.random() * 14 + 10,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      rotation: Math.random() * 360
    });
  }

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn new particles (throttled)
    if (timestamp - lastSpawn > 50 && mouse.x > 0) {
      spawnParticle();
      lastSpawn = timestamp;
    }

    // Update & draw
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // gentle gravity
      p.life -= p.decay;
      p.rotation += 2;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.font = p.size + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// ---- Screen Transitions ----
function goToScreen2() {
  const screen1 = document.getElementById('screen1');
  const screen2 = document.getElementById('screen2');

  screen1.classList.remove('active');
  setTimeout(() => {
    screen2.classList.add('active');
    initNoButton();
  }, 400);
}

function goToScreen3() {
  const screen2 = document.getElementById('screen2');
  const screen3 = document.getElementById('screen3');

  screen2.classList.remove('active');
  setTimeout(() => {
    screen3.classList.add('active');
    launchConfetti();
    launchHeartBurst();
    launchExtraHearts();
    // Try to play background music
    try {
      const music = document.getElementById('bgMusic');
      music.volume = 0.3;
      music.play().catch(() => {});
    } catch (e) {}
  }, 500);
}

// ---- YES Handler ----
function handleYes() {
  // Little celebration before transition
  const btn = document.getElementById('btnYes');
  btn.style.transform = 'scale(1.3)';
  btn.style.boxShadow = '0 0 60px rgba(233, 30, 99, 0.8), 0 0 120px rgba(255, 105, 180, 0.5)';
  btn.innerHTML = '<span>Yaaay! 🎉💖</span>';

  // Mini heart explosion at button
  for (let i = 0; i < 8; i++) {
    createMiniHeart(btn);
  }

  setTimeout(goToScreen3, 1000);
}

function createMiniHeart(element) {
  const heart = document.createElement('span');
  const hearts = ['💖', '💕', '💗', '✨'];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.position = 'fixed';
  const rect = element.getBoundingClientRect();
  heart.style.left = (rect.left + rect.width / 2) + 'px';
  heart.style.top = (rect.top + rect.height / 2) + 'px';
  heart.style.fontSize = '24px';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '9998';
  heart.style.transition = 'all 1s ease-out';
  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 200) + 'px';
    heart.style.top = (rect.top - Math.random() * 200 - 50) + 'px';
    heart.style.opacity = '0';
    heart.style.transform = 'scale(0.3) rotate(' + (Math.random() * 360) + 'deg)';
  });

  setTimeout(() => heart.remove(), 1200);
}

// ---- NO Button Shenanigans ----
const cheekyMessages = [
  "Nice try 😜",
  "Haha, nope! 🙅‍♀️",
  "That button doesn't work! 😏",
  "Try again... but differently 💕",
  "Are you sure?? 🥺👉👈",
  "Wrong answer, cutie! 😘",
  "My heart won't let you! 💖",
  "Not an option, sorry! 😝",
  "The universe says YES! 🌟",
  "You can't escape love! 💘",
  "Even this button loves YES! 😂",
  "Click the pink one!! 💗",
  "I'll wait... click YES 🥰",
  "The NO button is shy! 🙈",
  "Love always wins! 💞"
];

let noAttempts = 0;
let currentNoSize = 1;

function initNoButton() {
  const btnNo = document.getElementById('btnNo');
  const btnYes = document.getElementById('btnYes');

  // Desktop: move away on hover
  btnNo.addEventListener('mouseenter', handleNoHover);
  // Mobile: move away on touch
  btnNo.addEventListener('touchstart', handleNoTouch, { passive: true });
  // Click as fallback
  btnNo.addEventListener('click', handleNoClick);
}

function handleNoHover(e) {
  e.preventDefault();
  dodgeNo();
}

function handleNoTouch(e) {
  dodgeNo();
}

function handleNoClick(e) {
  e.preventDefault();
  dodgeNo();
}

function dodgeNo() {
  const btnNo = document.getElementById('btnNo');
  const btnYes = document.getElementById('btnYes');
  const msgEl = document.getElementById('cheekyMsg');
  const noText = document.getElementById('noText');

  noAttempts++;

  // Show cheeky message
  const msg = cheekyMessages[noAttempts % cheekyMessages.length];
  msgEl.textContent = msg;
  msgEl.style.animation = 'none';
  void msgEl.offsetHeight; // trigger reflow
  msgEl.style.animation = 'fadeIn 0.3s ease';

  // YES button grows
  const yesScale = Math.min(1 + noAttempts * 0.08, 1.6);
  btnYes.style.transform = `scale(${yesScale})`;

  // NO button shrinks
  currentNoSize = Math.max(1 - noAttempts * 0.06, 0.35);

  // Move NO button to random position
  const parent = btnNo.parentElement;
  const parentRect = parent.getBoundingClientRect();
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;

  const maxX = viewW - 120;
  const maxY = viewH - 60;
  const randX = Math.random() * maxX;
  const randY = Math.random() * (maxY - 100) + 50;

  btnNo.style.position = 'fixed';
  btnNo.style.left = randX + 'px';
  btnNo.style.top = randY + 'px';
  btnNo.style.transform = `scale(${currentNoSize})`;
  btnNo.style.zIndex = '100';
  btnNo.style.transition = 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

  // After many attempts, make NO nearly invisible
  if (noAttempts >= 5) {
    btnNo.style.opacity = Math.max(1 - noAttempts * 0.1, 0.15);
  }

  // Change NO text after a few tries
  const noTexts = ['No', 'Hmm...', 'Maybe?', 'OK fine...', '...YES?', '💖'];
  if (noAttempts < noTexts.length) {
    noText.textContent = noTexts[noAttempts];
  }

  // After 8 attempts, hide NO completely
  if (noAttempts >= 8) {
    btnNo.style.opacity = '0';
    btnNo.style.pointerEvents = 'none';
    msgEl.textContent = "See? There's only one answer! 💖 Click YES!";
  }
}

// ---- Confetti ----
function launchConfetti() {
  const container = document.getElementById('confetti');
  const confettiEmojis = ['💖', '💕', '💗', '💓', '💘', '💝', '❤️', '🩷', '✨', '🌟', '🎉', '💐', '🌹', '🦋'];

  function spawnConfetti() {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');
    piece.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
    piece.style.left = Math.random() * 100 + '%';
    piece.style.fontSize = (Math.random() * 18 + 14) + 'px';
    piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
    piece.style.animationDelay = '0s';
    container.appendChild(piece);

    setTimeout(() => piece.remove(), 6000);
  }

  // Initial burst
  for (let i = 0; i < 40; i++) {
    setTimeout(spawnConfetti, i * 80);
  }

  // Continuous gentle confetti
  const interval = setInterval(spawnConfetti, 400);
  setTimeout(() => clearInterval(interval), 20000);
}

// ---- Heart Burst (center explosion on screen 3 reveal) ----
function launchHeartBurst() {
  const container = document.getElementById('heartBurst');
  const burstHearts = ['💖', '💕', '💗', '💘', '💝', '❤️', '✨'];

  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.classList.add('burst-heart');
    heart.textContent = burstHearts[Math.floor(Math.random() * burstHearts.length)];

    const angle = (i / 20) * 360;
    const distance = Math.random() * 250 + 100;
    const tx = Math.cos((angle * Math.PI) / 180) * distance;
    const ty = Math.sin((angle * Math.PI) / 180) * distance;

    heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
    heart.style.animationDelay = (Math.random() * 0.3) + 's';
    heart.style.setProperty('--tx', tx + 'px');
    heart.style.setProperty('--ty', ty + 'px');

    // Override animation with custom end position
    heart.animate([
      { transform: 'translate(0, 0) scale(0)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(1.2)`, opacity: 0.8, offset: 0.5 },
      { transform: `translate(${tx * 1.5}px, ${ty * 1.5}px) scale(0.5)`, opacity: 0 }
    ], {
      duration: 1500 + Math.random() * 500,
      easing: 'ease-out',
      fill: 'forwards',
      delay: Math.random() * 200
    });

    container.appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  }
}

// ---- Extra floating hearts for Screen 3 ----
function launchExtraHearts() {
  const container = document.getElementById('extraHearts');
  const emojis = ['💖', '💕', '💗', '💓', '🩷', '✨'];

  function spawn() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 24 + 16) + 'px';
    heart.style.animationDuration = (Math.random() * 5 + 4) + 's';
    heart.style.opacity = Math.random() * 0.6 + 0.3;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 12000);
  }

  for (let i = 0; i < 10; i++) {
    setTimeout(spawn, i * 200);
  }

  setInterval(spawn, 600);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  createFloatingHearts();
  createSparkles('sparkles1', 20);
  initHeartTrail();
});
