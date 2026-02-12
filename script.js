/* ============================================
   VALENTINE'S DAY – JAVASCRIPT
   ============================================ */

// ---- Mobile Detection & Viewport Fix ----
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || ('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0);

// Fix mobile viewport height (address bar issue)
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 200);
});

// ---- Floating Hearts Background ----
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const hearts = ['💕', '💖', '💗', '💓', '💘', '💝', '❤️', '🩷', '🤍', '✨'];
    // Fewer hearts on mobile for performance
    const spawnCount = isMobile ? 6 : 12;
    const spawnInterval = isMobile ? 1200 : 800;

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
    for (let i = 0; i < spawnCount; i++) {
        setTimeout(spawnHeart, i * 300);
    }

    // Continuous spawning
    setInterval(spawnHeart, spawnInterval);
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
    // On mobile: fewer particles, shorter life, throttled more
    const spawnThrottle = isMobile ? 120 : 50;
    const maxParticles = isMobile ? 15 : 50;

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

    // Touch: use passive listener to avoid scroll jank, track position
    document.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        // Reset so we don't keep spawning at last position
        mouse.x = -100;
        mouse.y = -100;
    }, { passive: true });

    function spawnParticle() {
        if (particles.length >= maxParticles) return;
        const emojis = ['💖', '💕', '✨', '💗', '🩷'];
        particles.push({
            x: mouse.x,
            y: mouse.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            life: 1,
            decay: isMobile ? 0.025 + Math.random() * 0.015 : 0.015 + Math.random() * 0.01,
            size: isMobile ? Math.random() * 10 + 8 : Math.random() * 14 + 10,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            rotation: Math.random() * 360
        });
    }

    function animate(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn new particles (throttled)
        if (timestamp - lastSpawn > spawnThrottle && mouse.x > 0) {
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
function transitionScreens(fromId, toId, onAfter) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    from.classList.remove('active');
    setTimeout(() => {
        to.classList.add('active');
        if (onAfter) onAfter();
    }, 450);
}

function goToScreen2() {
    transitionScreens('screen1', 'screen2', () => {
        initNoButton();
    });
}

// After YES → go to compliments (screen3)
function goToScreen3() {
    transitionScreens('screen2', 'screen3', () => {
        initCompliments();
    });
}

// Compliments done → go to reasons (screen4)
function goToScreen4() {
    transitionScreens('screen3', 'screen4', () => {
        initReasons();
    });
}

// Reasons done → go to typewriter (screen5)
function goToScreen5() {
    transitionScreens('screen4', 'screen5', () => {
        startTypewriter();
    });
}

// Typewriter done → go to final proposal (screen6)
function goToScreen6() {
    transitionScreens('screen5', 'screen6', () => {
        launchConfetti();
        launchHeartBurst();
        launchExtraHearts();
        try {
            const music = document.getElementById('bgMusic');
            music.volume = 0.3;
            music.play().catch(() => {});
        } catch (e) {}
    });
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

// ============================================
// SCREEN 3 – COMPLIMENTS CAROUSEL
// ============================================
const compliments = [
    { text: "Your smile could light up the darkest room ✨", emoji: "🌹" },
    { text: "You're the reason I believe in magic 🪄", emoji: "🦋" },
    { text: "Being with you feels like coming home 🏡", emoji: "💫" },
    { text: "You make my heart skip beats... plural 💓", emoji: "🎵" },
    { text: "The world is more beautiful because you're in it 🌸", emoji: "🌷" },
    { text: "You're my favorite notification 📱", emoji: "🥰" },
    { text: "I fall for you a little more every single day 🍂", emoji: "💝" },
];

let currentCompliment = 0;

function initCompliments() {
    const dotsContainer = document.getElementById('complimentDots');
    dotsContainer.innerHTML = '';
    compliments.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('compliment-dot');
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });
}

function nextCompliment() {
    const card = document.getElementById('complimentCard');
    const textEl = document.getElementById('complimentText');
    const emojiEl = document.getElementById('complimentEmoji');
    const dots = document.querySelectorAll('.compliment-dot');
    const btn = document.getElementById('btnNextCompliment');

    currentCompliment++;

    // Last compliment → transition to next screen
    if (currentCompliment >= compliments.length) {
        card.classList.add('swipe-out-left');
        setTimeout(() => goToScreen4(), 500);
        return;
    }

    // Swipe out animation
    card.classList.add('swipe-out-left');

    setTimeout(() => {
        // Update content
        const c = compliments[currentCompliment];
        textEl.textContent = c.text;
        emojiEl.textContent = c.emoji;

        // Update dots
        dots.forEach((d, i) => d.classList.toggle('active', i === currentCompliment));

        // Reset and swipe in
        card.classList.remove('swipe-out-left');
        card.classList.add('swipe-in');
        setTimeout(() => card.classList.remove('swipe-in'), 500);

        // Update button text on second-to-last
        if (currentCompliment === compliments.length - 1) {
            btn.innerHTML = '<span>One more thing...</span><span class="btn-icon">💘</span>';
        }
    }, 400);
}

// ============================================
// SCREEN 4 – REASONS I LOVE YOU (FLIP CARDS)
// ============================================
let flippedCount = 0;

function initReasons() {
    flippedCount = 0;
}

function flipCard(card) {
    if (card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    flippedCount++;

    // Show mini heart on flip
    createMiniHeart(card);

    // After flipping 5+ cards, show the continue button
    if (flippedCount >= 5) {
        const btn = document.getElementById('btnReasonsNext');
        btn.classList.add('visible');
    }
}

// ============================================
// SCREEN 5 – TYPEWRITER LOVE QUOTE
// ============================================
function startTypewriter() {
    const text = "In a world of 8 billion people, my heart chose you... and it would choose you in every lifetime, in every universe, again and again. 💕";
    const el = document.getElementById('typewriterText');
    const cursor = document.getElementById('typewriterCursor');
    const btn = document.getElementById('btnReveal');
    let i = 0;

    el.textContent = '';

    function type() {
        if (i < text.length) {
            el.textContent += text[i];
            i++;
            const delay = text[i - 1] === ',' || text[i - 1] === '.' || text[i - 1] === '—' ? 120 : 40;
            setTimeout(type, delay);
        } else {
            // Typing done — show the reveal button
            cursor.style.display = 'none';
            setTimeout(() => {
                btn.style.display = 'inline-flex';
                btn.style.animation = 'fadeSlideUp 0.8s ease both, yesGlow 1.5s ease-in-out 1s infinite alternate';
            }, 600);
        }
    }

    setTimeout(type, 800);
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
let noButtonDodging = false; // prevent rapid re-triggers

function initNoButton() {
    const btnNo = document.getElementById('btnNo');

    if (isMobile) {
        // MOBILE: Use touchstart to dodge BEFORE the tap registers
        btnNo.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent click/ghost tap
            e.stopPropagation();
            dodgeNo();
        }, { passive: false });

        // Also catch any click that gets through
        btnNo.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dodgeNo();
        });
    } else {
        // DESKTOP: move away on hover
        btnNo.addEventListener('mouseenter', (e) => {
            e.preventDefault();
            dodgeNo();
        });

        // Fallback click
        btnNo.addEventListener('click', (e) => {
            e.preventDefault();
            dodgeNo();
        });
    }
}

function dodgeNo() {
    // Debounce to prevent rapid re-triggers
    if (noButtonDodging) return;
    noButtonDodging = true;
    setTimeout(() => { noButtonDodging = false; }, 300);

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

    // Get safe bounds — account for button size & safe areas
    const btnRect = btnNo.getBoundingClientRect();
    const btnW = Math.max(btnRect.width, 80);
    const btnH = Math.max(btnRect.height, 40);
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;

    // Keep within visible viewport with padding
    const padding = 15;
    const safeTop = padding + 20; // extra top padding for mobile status bar
    const safeBottom = viewH - btnH - padding - 20; // extra bottom for mobile nav
    const safeLeft = padding;
    const safeRight = viewW - btnW - padding;

    const randX = Math.max(safeLeft, Math.min(safeRight, Math.random() * (safeRight - safeLeft) + safeLeft));
    const randY = Math.max(safeTop, Math.min(safeBottom, Math.random() * (safeBottom - safeTop) + safeTop));

    btnNo.style.position = 'fixed';
    btnNo.style.left = randX + 'px';
    btnNo.style.top = randY + 'px';
    btnNo.style.transform = `scale(${currentNoSize})`;
    btnNo.style.zIndex = '100';
    btnNo.style.transition = 'left 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), top 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.25s ease, opacity 0.25s ease';

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
        btnNo.style.visibility = 'hidden';
        msgEl.textContent = "See? There's only one answer! 💖 Click YES!";
    }
}

// ---- Confetti ----
function launchConfetti() {
    const container = document.getElementById('confetti');
    const confettiEmojis = ['💖', '💕', '💗', '💓', '💘', '💝', '❤️', '🩷', '✨', '🌟', '🎉', '💐', '🌹', '🦋'];
    const burstCount = isMobile ? 20 : 40;
    const continuousInterval = isMobile ? 700 : 400;
    const continuousDuration = isMobile ? 12000 : 20000;

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
    for (let i = 0; i < burstCount; i++) {
        setTimeout(spawnConfetti, i * 80);
    }

    // Continuous gentle confetti
    const interval = setInterval(spawnConfetti, continuousInterval);
    setTimeout(() => clearInterval(interval), continuousDuration);
}

// ---- Heart Burst (center explosion on screen 3 reveal) ----
function launchHeartBurst() {
    const container = document.getElementById('heartBurst');
    const burstHearts = ['💖', '💕', '💗', '💘', '💝', '❤️', '✨'];
    const count = isMobile ? 12 : 20;
    const maxDistance = isMobile ? 120 : 250;

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.classList.add('burst-heart');
        heart.textContent = burstHearts[Math.floor(Math.random() * burstHearts.length)];

        const angle = (i / count) * 360;
        const distance = Math.random() * maxDistance + 50;
        const tx = Math.cos((angle * Math.PI) / 180) * distance;
        const ty = Math.sin((angle * Math.PI) / 180) * distance;

        heart.style.fontSize = (Math.random() * 20 + (isMobile ? 14 : 20)) + 'px';
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
    const initialCount = isMobile ? 5 : 10;
    const spawnInterval = isMobile ? 1000 : 600;

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

    for (let i = 0; i < initialCount; i++) {
        setTimeout(spawn, i * 200);
    }

    setInterval(spawn, spawnInterval);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    createSparkles('sparkles1', 20);
    initHeartTrail();
});
