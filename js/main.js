/* =========================
   OPEN ENVELOPE
========================= */
const openButton = document.getElementById("openInvitation");
const openingScreen = document.getElementById("openingScreen");
const website = document.getElementById("website");

let openingStarted = false;

openButton.addEventListener("click", () => {
  if (openingStarted) return;
  openingStarted = true;

  openButton.classList.add("is-open");

  setTimeout(() => {
    openingScreen.classList.add("is-leaving");
    website.setAttribute("aria-hidden", "false");
    website.classList.add("is-visible");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, 1250);
});


/* =========================
   HEART SCRATCH TO REVEAL
========================= */
const canvas = document.getElementById("scratchCanvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const scratchHint = document.getElementById("scratchHint");

let isDrawing = false;
let hasRevealed = false;
let lastPoint = null;

function setupScratchCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.max(window.devicePixelRatio || 1, 1);

  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);

  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, "#7c4b0b");
  gradient.addColorStop(0.20, "#f0cf78");
  gradient.addColorStop(0.48, "#b87818");
  gradient.addColorStop(0.76, "#ffe3a0");
  gradient.addColorStop(1, "#87500b");

  context.globalCompositeOperation = "source-over";
  context.fillStyle = gradient;
  context.fillRect(0, 0, rect.width, rect.height);

  // subtle foil texture
  for (let i = 0; i < 900; i++) {
    context.fillStyle = `rgba(255,255,255,${Math.random() * 0.09})`;
    context.fillRect(
      Math.random() * rect.width,
      Math.random() * rect.height,
      1,
      1
    );
  }

  context.globalCompositeOperation = "destination-out";
}

function getPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function eraseAt(event) {
  if (!isDrawing || hasRevealed) return;

  event.preventDefault();

  const point = getPoint(event);

  context.lineWidth = 36;
  context.lineCap = "round";
  context.lineJoin = "round";

  context.beginPath();

  if (lastPoint) {
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(point.x, point.y);
  } else {
    context.arc(point.x, point.y, 18, 0, Math.PI * 2);
  }

  context.stroke();

  lastPoint = point;

  scratchHint.style.opacity = "0";

  checkScratchProgress();
}

function checkScratchProgress() {
  const imageData = context.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  ).data;

  let transparentPixels = 0;
  let sampledPixels = 0;

  // Sample instead of checking every pixel for better mobile performance.
  for (let i = 3; i < imageData.length; i += 64) {
    sampledPixels++;

    if (imageData[i] < 20) {
      transparentPixels++;
    }
  }

  const clearedPercentage = transparentPixels / sampledPixels;

  if (clearedPercentage > 0.30) {
    revealDate();
  }
}

function revealDate() {
  if (hasRevealed) return;

  hasRevealed = true;

  scratchHint.style.display = "none";

  canvas.style.transition = "opacity .65s ease";
  canvas.style.opacity = "0";

  triggerCelebration();

  setTimeout(() => {
    canvas.style.pointerEvents = "none";
  }, 700);
}

canvas.addEventListener("pointerdown", (event) => {
  isDrawing = true;
  lastPoint = getPoint(event);
  canvas.setPointerCapture(event.pointerId);
  eraseAt(event);
});

canvas.addEventListener("pointermove", eraseAt);

canvas.addEventListener("pointerup", () => {
  isDrawing = false;
  lastPoint = null;
});

canvas.addEventListener("pointercancel", () => {
  isDrawing = false;
  lastPoint = null;
});

canvas.addEventListener("pointerleave", () => {
  if (isDrawing) {
    isDrawing = false;
    lastPoint = null;
  }
});

setupScratchCanvas();

window.addEventListener("resize", () => {
  if (!hasRevealed) {
    setupScratchCanvas();
  }
});


/* =========================
   CINEMATIC CELEBRATION
========================= */
function triggerCelebration() {
  const layer = document.getElementById("celebrationLayer");

  const icons = ["♥", "♥", "✦", "✧", "❦", "•"];
  const colors = [
    "#c95f70",
    "#e98e9b",
    "#bf8b31",
    "#f3cf72",
    "#fff7e7"
  ];

  const count = 110;

  for (let index = 0; index < count; index++) {
    const particle = document.createElement("span");

    particle.className = "particle";
    particle.textContent =
      icons[Math.floor(Math.random() * icons.length)];

    const xDistance =
      (Math.random() - 0.5) * Math.min(window.innerWidth, 1000);

    const yDistance =
      (Math.random() * window.innerHeight * 0.78) - 120;

    particle.style.setProperty(
      "--particle-color",
      colors[Math.floor(Math.random() * colors.length)]
    );

    particle.style.setProperty(
      "--particle-size",
      `${8 + Math.random() * 22}px`
    );

    particle.style.setProperty(
      "--particle-x",
      `${xDistance}px`
    );

    particle.style.setProperty(
      "--particle-y",
      `${yDistance}px`
    );

    particle.style.setProperty(
      "--particle-rotate",
      `${-360 + Math.random() * 720}deg`
    );

    particle.style.setProperty(
      "--particle-duration",
      `${1.8 + Math.random() * 1.9}s`
    );

    layer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 4200);
  }
}


/* =========================
   COUNTDOWN
========================= */
const weddingDate = new Date("2026-10-18T00:00:00+05:30").getTime();

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

function updateCountdown() {
  let remainingTime = Math.max(
    0,
    weddingDate - Date.now()
  );

  const days = Math.floor(
    remainingTime / (1000 * 60 * 60 * 24)
  );

  remainingTime %= (1000 * 60 * 60 * 24);

  const hours = Math.floor(
    remainingTime / (1000 * 60 * 60)
  );

  remainingTime %= (1000 * 60 * 60);

  const minutes = Math.floor(
    remainingTime / (1000 * 60)
  );

  remainingTime %= (1000 * 60);

  const seconds = Math.floor(
    remainingTime / 1000
  );

  daysElement.textContent =
    String(days).padStart(2, "0");

  hoursElement.textContent =
    String(hours).padStart(2, "0");

  minutesElement.textContent =
    String(minutes).padStart(2, "0");

  secondsElement.textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
