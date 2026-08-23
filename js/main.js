// Function to handle opening the envelope
function openEnvelope() {
  const overlay = document.getElementById('envelope-overlay');
  const mainContent = document.getElementById('main-content');
  
  overlay.classList.add('fade-out');
  
  setTimeout(() => {
    overlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
  }, 800);
}

// Countdown Timer logic
const weddingDate = new Date('October 18, 2026 12:15:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    document.querySelector('.countdown-container').innerHTML = "<h3>The Wedding Day is Here!</h3>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000To create and host this website completely free using GitHub Pages, you will create a single-page HTML application with integrated CSS styling and JavaScript functionality. 

      // Open Envelope
document.getElementById('open-btn').addEventListener('click', function() {
  const overlay = document.getElementById('envelope-overlay');
  const mainContent = document.getElementById('main-content');
  
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.display = 'none';
    mainContent.classList.remove('hidden');
  }, 800);
});

// Scratch to reveal card simple tap interaction
document.getElementById('scratch-cover').addEventListener('click', function() {
  this.style.opacity = '0';
  setTimeout(() => {
    this.style.display = 'none';
  }, 500);
});

// Countdown Timer logic target: Oct 18, 2026 12:15:00
const targetDate = new Date('October 18, 2026 12:15:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();
