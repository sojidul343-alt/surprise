/* ==========================================================
   EDIT THIS PART – everything personal lives in CONFIG
   ========================================================== */
const CONFIG = {
  letterTitle: "A Letter, Just For You🤗",
  envelopeLabel: "For You, Cutiee😫🎀✨",
  cakeDoneTitle: "Happy Birthday, My Girl!🥳",

  // The birthday message. Each string is one paragraph.
  letter: [
    "Happiest birthday my girl!🎂🥳",
    "I pray you achieve all your dreams, stay happy, and keep smiling the way you do...",
    "because that smile is my favorite thing🧡",
    "Everyday is your day because you are the main character... and YOU KNOW IT😏",
    "Let's share unlimited laughs, love, fights, and happiness 💙",
    "Thank you for being my partner in every sense. HAPPY BIRTHDAY FARUUU🌷🫶"
  ],

  // Passcode (digits only). Example: day + month = "0101", or ddmmyy = "010100".
  passcode: "1012",
  passcodeError: "Wrong code, try again",

  // Background music: put your song in the /music folder and set its name here.
  musicSrc: "music/song.mp3",
  musicVolume: 0.6,   // 0 (silent) to 1 (full)

  // Put your photos in the /images folder and list them here.
  // If a file is missing, a placeholder card is shown instead.
  photos: [
    { src: "images/1.jpg", caption: "Brithday Girl ♥" },
    { src: "images/2.jpg", caption: "That day ✨" },
    { src: "images/3.jpg", caption: "My favorite🎀" },
    { src: "images/4.jpg", caption: "Always laughing😍" },
    { src: "images/5.jpg", caption: "Pretty🫶" },
    { src: "images/6.jpg", caption: "Forever🌷" }
  ]
};

/* ==========================================================
   Helpers
   ========================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, ms));

function show(id) {
  $$(".screen").forEach(s => s.classList.toggle("active", s.id === id));
}

/* ---------- pixel art ---------- */
function drawMap(canvas, rows, palette) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (palette[ch]) { ctx.fillStyle = palette[ch]; ctx.fillRect(x, y, 1, 1); }
    });
  });
}

const LOCK_ROWS = [
  ".....oooooo.....",
  "....os....so....",
  "....os....so....",
  "..oooo....oooo..",
  ".obbhhoooobbbbo.",
  "obbhhbbbbbbbbbbo",
  "obhbbbbbbbbbbbbo",
  "obbbbbbbkkbbbbbo",
  "obbbbbbbkkbbbbbo",
  ".obbbbbbkkbbbbo.",
  ".obbbbbbbbbbbbo.",
  "..obbbbbbbbbbo..",
  "...obbbbbbbbo...",
  "....obbbbbbo....",
  "......oooo......"
];
const LOCK_PALETTE = { o: "#c9803f", b: "#f6b26b", h: "#ffd9a0", k: "#8a4a2b", s: "#d99a52" };

function drawLocks() {
  ["lockCanvas", "lockCanvas2", "lockCanvas3"].forEach(id => drawMap(document.getElementById(id), LOCK_ROWS, LOCK_PALETTE));
}

function drawCake(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 40, 36);
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  // doily plate
  R(3, 30, 34, 2, "#f6d27a");
  R(4, 32, 32, 2, "#f2c35a");
  for (let x = 2; x < 38; x += 3) R(x, 34, 2, 1, (x / 3) % 2 ? "#e9b445" : "#f6d27a");
  // body
  R(6, 14, 28, 16, "#f08a2e");
  R(6, 14, 28, 6, "#f7a24a");
  R(6, 20, 28, 1, "#d97420");
  R(6, 25, 28, 2, "#d97420");
  R(6, 22, 28, 1, "#ffb766");
  // drips
  for (let x = 6; x < 34; x += 4) R(x, 20, 3, 2 + ((x / 4) % 2), "#ffb766");
  // outline
  R(5, 15, 1, 15, "#b85a14"); R(34, 15, 1, 15, "#b85a14");
  R(6, 30, 28, 1, "#b85a14"); R(6, 13, 28, 1, "#b85a14");
  // berries + leaves
  for (let x = 7; x < 33; x += 5) { R(x, 11, 4, 3, "#ff9a3d"); R(x + 1, 10, 2, 1, "#6aa84f"); }
  // candles
  [10, 15, 23, 28].forEach(cx => {
    R(cx, 5, 2, 8, "#f4d35e"); R(cx, 6, 1, 6, "#fff3b0");
    R(cx, 2, 2, 3, "#ff8c1a"); R(cx, 3, 2, 1, "#ffe066");
  });
}

/* ==========================================================
   Confetti
   ========================================================== */
const confettiCanvas = $("#confetti");
const cctx = confettiCanvas.getContext("2d");
let particles = [];
let confettiRunning = false;

function sizeConfetti() {
  const d = window.devicePixelRatio || 1;
  confettiCanvas.width = innerWidth * d;
  confettiCanvas.height = innerHeight * d;
  cctx.setTransform(d, 0, 0, d, 0, 0);
}
addEventListener("resize", sizeConfetti);
sizeConfetti();

function burst(x, y, count = 140) {
  const colors = ["#8a5a33", "#a3743f", "#d99a52", "#e75480", "#f4d35e", "#c26a3d"];
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 2 + Math.random() * 7;
    particles.push({
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 3,
      w: 3 + Math.random() * 4,
      h: 2 + Math.random() * 3,
      r: Math.random() * 6,
      vr: (Math.random() - .5) * .3,
      c: colors[(Math.random() * colors.length) | 0],
      life: 90 + Math.random() * 70
    });
  }
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(tick); }
}

function tick() {
  cctx.clearRect(0, 0, innerWidth, innerHeight);
  particles = particles.filter(p => p.life > 0 && p.y < innerHeight + 20);
  for (const p of particles) {
    p.vy += .18; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
    cctx.save();
    cctx.translate(p.x, p.y);
    cctx.rotate(p.r);
    cctx.globalAlpha = Math.min(1, p.life / 40);
    cctx.fillStyle = p.c;
    cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    cctx.restore();
  }
  if (particles.length) requestAnimationFrame(tick);
  else confettiRunning = false;
}

/* ==========================================================
   1. Heart → red flood → envelope
   ========================================================== */
const flood = $("#flood");

/* ---------- background music ---------- */
const bgm = $("#bgm");
const musicBtn = $("#musicBtn");
bgm.src = CONFIG.musicSrc;
bgm.volume = CONFIG.musicVolume;

function startMusic() {
  const p = bgm.play();
  if (p && p.then) {
    p.then(() => {
      musicBtn.hidden = false;
      musicBtn.classList.add("playing");
    }).catch(() => { /* file missing or blocked: site still works silently */ });
  }
}

musicBtn.addEventListener("click", () => {
  bgm.muted = !bgm.muted;
  musicBtn.classList.toggle("muted", bgm.muted);
  musicBtn.classList.toggle("playing", !bgm.muted);
});

$("#heartBtn").addEventListener("click", async e => {
  startMusic(); // must run inside the click so the browser allows sound
  const r = e.currentTarget.getBoundingClientRect();
  flood.style.setProperty("--fx", (r.left + r.width / 2) + "px");
  flood.style.setProperty("--fy", (r.top + r.height / 2) + "px");
  flood.classList.add("grow");
  await wait(750);
  show("s-letter");
  await wait(250);
  flood.classList.add("fade");
  await wait(850);
  flood.classList.remove("grow", "fade");
});

/* ==========================================================
   2. Envelope + typewriter letter
   ========================================================== */
$("#letterTitle").textContent = CONFIG.letterTitle;
$("#envLabel").textContent = CONFIG.envelopeLabel;

const backdrop = $("#backdrop");
const paperBody = $("#paperBody");
const letterNext = $("#letterNext");
let typing = false;
let skipTyping = false;
let letterDone = false;

async function typeLetter() {
  if (letterDone) { letterNext.hidden = false; return; }
  if (typing) return;
  typing = true; skipTyping = false;
  paperBody.innerHTML = "";
  for (const text of CONFIG.letter) {
    const p = document.createElement("p");
    p.classList.add("caret");
    paperBody.appendChild(p);
    for (const ch of text) {
      if (backdrop.hidden) { typing = false; return; }
      p.textContent += ch;
      paperBody.scrollTop = paperBody.scrollHeight;
      if (!skipTyping) await wait(26);
    }
    p.classList.remove("caret");
    if (!skipTyping) await wait(220);
  }
  typing = false;
  letterDone = true;
  letterNext.hidden = false;
}

function showFullLetter() {
  paperBody.innerHTML = CONFIG.letter.map(t => `<p>${t}</p>`).join("");
}

$("#envelope").addEventListener("click", async e => {
  const env = e.currentTarget;
  env.classList.add("open");
  await wait(650);
  backdrop.hidden = false;
  if (letterDone) showFullLetter();
  typeLetter();
});

paperBody.addEventListener("click", () => { skipTyping = true; });

$("#closeLetter").addEventListener("click", () => {
  backdrop.hidden = true;
  skipTyping = true;
  if (typing) { typing = false; letterDone = true; }
  $("#envelope").classList.remove("open");
});

letterNext.addEventListener("click", () => {
  backdrop.hidden = true;
  $("#envelope").classList.remove("open");
  show("s-cake");
});

/* ==========================================================
   3. Cake – swipe to cut
   ========================================================== */
const cakeArea = $("#cakeArea");
const cakeWrap = $("#cakeWrap");
const slash = $("#slash");
const sctx = slash.getContext("2d");
let cut = false;
let dragging = false;
let path = [];
let pathLen = 0;
let touchedCake = false;

function sizeSlash() {
  const d = window.devicePixelRatio || 1;
  const r = slash.getBoundingClientRect();
  slash.width = r.width * d;
  slash.height = r.height * d;
  sctx.setTransform(d, 0, 0, d, 0, 0);
}

function slashPoint(e) {
  const r = slash.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function drawTrail() {
  const r = slash.getBoundingClientRect();
  sctx.clearRect(0, 0, r.width, r.height);
  if (path.length < 2) return;
  sctx.lineCap = "round"; sctx.lineJoin = "round";
  sctx.strokeStyle = "rgba(255, 255, 255, .9)";
  sctx.shadowColor = "rgba(255, 190, 90, .9)";
  sctx.shadowBlur = 10;
  sctx.lineWidth = 3;
  sctx.beginPath();
  path.forEach((p, i) => i ? sctx.lineTo(p.x, p.y) : sctx.moveTo(p.x, p.y));
  sctx.stroke();
}

function endTrail() {
  dragging = false; path = []; pathLen = 0; touchedCake = false;
  const r = slash.getBoundingClientRect();
  sctx.clearRect(0, 0, r.width, r.height);
}

cakeArea.addEventListener("pointerdown", e => {
  if (cut) return;
  sizeSlash();
  dragging = true; path = [slashPoint(e)]; pathLen = 0; touchedCake = false;
  cakeArea.setPointerCapture(e.pointerId);
});

cakeArea.addEventListener("pointermove", e => {
  if (!dragging || cut) return;
  const p = slashPoint(e);
  const last = path[path.length - 1];
  pathLen += Math.hypot(p.x - last.x, p.y - last.y);
  path.push(p);
  const c = cakeWrap.getBoundingClientRect();
  if (e.clientX > c.left && e.clientX < c.right && e.clientY > c.top && e.clientY < c.bottom) touchedCake = true;
  drawTrail();
  if (touchedCake && pathLen > 110) cutCake(e);
});

["pointerup", "pointercancel"].forEach(t => cakeArea.addEventListener(t, endTrail));

function cutCake() {
  cut = true;
  endTrail();
  cakeArea.classList.add("cut");
  $("#cakeTitle").textContent = CONFIG.cakeDoneTitle;
  $("#cakeHint").textContent = "Make a wish 💗";
  const c = cakeWrap.getBoundingClientRect();
  burst(c.left + c.width / 2, c.top + c.height / 3, 170);
  setTimeout(() => burst(innerWidth / 2, innerHeight * .3, 90), 450);
  setTimeout(() => { $("#cakeNext").hidden = false; }, 900);
}

$("#cakeNext").addEventListener("click", () => show("s-lock"));

/* ==========================================================
   4/5/6. Lock → keypad → unlocked
   ========================================================== */
$("#lockBtn").addEventListener("click", () => show("s-keypad"));

const dotsEl = $("#dots");
const keyPrompt = $("#keyPrompt");
const PROMPT_DEFAULT = keyPrompt.textContent;
let code = "";

function renderDots() {
  dotsEl.innerHTML = code.length
    ? code.split("").map(() => '<span class="dot"></span>').join("")
    : '<span class="placeholder">Enter Code</span>';
}

$("#keypad").addEventListener("click", async e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const k = btn.dataset.k;
  if (k === "clear") code = "";
  else if (k === "del") code = code.slice(0, -1);
  else if (code.length < CONFIG.passcode.length) code += k;
  renderDots();
  keyPrompt.textContent = PROMPT_DEFAULT;

  if (code.length === CONFIG.passcode.length) {
    await wait(220);
    if (code === CONFIG.passcode) {
      show("s-unlocked");
    } else {
      dotsEl.classList.add("shake");
      keyPrompt.textContent = CONFIG.passcodeError;
      await wait(450);
      dotsEl.classList.remove("shake");
      code = "";
      renderDots();
    }
  }
});

addEventListener("keydown", e => {
  if (!$("#s-keypad").classList.contains("active")) return;
  if (/^[0-9]$/.test(e.key)) $(`#keypad [data-k="${e.key}"]`).click();
  if (e.key === "Backspace") $('#keypad [data-k="del"]').click();
});

$("#viewBtn").addEventListener("click", () => { show("s-gallery"); layoutCoverflow(); });

/* ==========================================================
   7. Coverflow gallery
   ========================================================== */
const flow = $("#coverflow");
let index = 0;
let cards = [];

function buildGallery() {
  flow.innerHTML = "";
  cards = CONFIG.photos.map((ph, i) => {
    const fig = document.createElement("figure");
    fig.className = "photo";
    fig.style.margin = "0";
    const img = new Image();
    img.alt = ph.caption || "Memory " + (i + 1);
    img.draggable = false;
    img.onerror = () => {
      img.replaceWith(Object.assign(document.createElement("div"), {
        className: "ph",
        innerHTML: "<b>♥</b><span>Add photo " + (i + 1) + "</span>"
      }));
    };
    img.src = ph.src;
    fig.appendChild(img);
    if (ph.caption) {
      const cap = document.createElement("figcaption");
      cap.textContent = ph.caption;
      fig.appendChild(cap);
    }
    fig.addEventListener("click", () => { if (!moved) go(i); });
    flow.appendChild(fig);
    return fig;
  });
  layoutCoverflow();
}

function layoutCoverflow() {
  const spacing = Math.min(flow.clientWidth * .26, 150) || 110;
  cards.forEach((el, i) => {
    const off = i - index;
    const a = Math.abs(off);
    el.classList.toggle("current", off === 0);
    el.style.zIndex = 20 - a;
    el.style.opacity = a > 2 ? 0 : 1;
    el.style.pointerEvents = a > 2 ? "none" : "auto";
    el.style.filter = off === 0 ? "none" : "brightness(.88)";
    const s = off === 0 ? 1.08 : Math.max(.7, 1 - a * .12);
    el.style.transform =
      `translate(-50%, -50%) translateX(${off * spacing}px) translateZ(${-a * 70}px) rotateY(${-off * 28}deg) scale(${s})`;
  });
}

function go(i) {
  index = Math.max(0, Math.min(cards.length - 1, i));
  layoutCoverflow();
}

let startX = 0, dragX = 0, down = false, moved = false;
flow.addEventListener("pointerdown", e => { down = true; moved = false; startX = e.clientX; dragX = 0; });
flow.addEventListener("pointermove", e => {
  if (!down) return;
  dragX = e.clientX - startX;
  if (Math.abs(dragX) > 6) moved = true;
});
function releaseFlow() {
  if (!down) return;
  down = false;
  if (dragX < -40) go(index + 1);
  else if (dragX > 40) go(index - 1);
  setTimeout(() => { moved = false; }, 0);
}
["pointerup", "pointercancel", "pointerleave"].forEach(t => flow.addEventListener(t, releaseFlow));

flow.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") go(index + 1);
  if (e.key === "ArrowLeft") go(index - 1);
});
flow.addEventListener("wheel", e => {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) go(index + (e.deltaX > 0 ? 1 : -1));
}, { passive: true });
addEventListener("resize", layoutCoverflow);

/* ==========================================================
   Restart
   ========================================================== */
$("#restartBtn").addEventListener("click", () => {
  // letter
  letterDone = false; typing = false;
  paperBody.innerHTML = ""; letterNext.hidden = true;
  $("#envelope").classList.remove("open");
  // cake
  cut = false;
  cakeArea.classList.remove("cut");
  $("#cakeTitle").textContent = "Swipe to Cut the Cake! 🎂";
  $("#cakeHint").textContent = "Drag your finger/cursor to slice";
  $("#cakeNext").hidden = true;
  // keypad
  code = ""; renderDots(); keyPrompt.textContent = PROMPT_DEFAULT;
  // gallery
  index = 0; layoutCoverflow();
  show("s-heart");
});

/* ---------- init ---------- */
drawLocks();
$$(".cake-half").forEach(drawCake);
buildGallery();