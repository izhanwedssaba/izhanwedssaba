// ====== OVERLAY ANIMATION CONTROLLERS ======
document.getElementById('waxSeal').addEventListener('click', function() {
    document.getElementById('envelopeWrapper').classList.add('dismiss-envelope');
    document.getElementById('mainContent').classList.add('display-website');
    
    // Play audio under browser user action verification rules
    const audioTrack = document.getElementById('bg-music');
    if (audioTrack.paused) {
        audioTrack.play().catch(() => console.log("Audio browser security initialization blocked automatic track playback"));
    }
    
    // Core canvas needs accurate layout geometry execution after tracking transition completes
    initScratchCard();
});

function toggleMusic() {
    const audioTrack = document.getElementById('bg-music');
    const button = document.querySelector('.audio-control');
    if (audioTrack.paused) {
        audioTrack.play();
        button.innerText = "🔊";
    } else {
        audioTrack.pause();
        button.innerText = "🔇";
    }
}

// ====== HTML5 CANVAS LAYER MASK CONTROLLER ======
function initScratchCard() {
    const canvas = document.getElementById('scratchCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('scratchContainer');
    
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    // Gold Scratchable Fill Cover Mask Paint
    ctx.fillStyle = '#ebdcb9'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text instructions placement layout parameters
    ctx.font = 'bold 12px Montserrat';
    ctx.fillStyle = '#8a651a';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH WITH FINGER', canvas.width / 2, canvas.height / 2 + 4);

    let isDrawing = false;

    function scratch(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        // Fallback checks mapping mouse or mobile touch coordinate variants
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        // Use composite blending to clear tracking paths
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    // Touch Context Bindings
    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); });
}

// ====== LIVE COUNTDOWN DATA CONFIGURATION ======
// Explicit configuration targeting requested date parameter variant: October 18, 2026
const targetDate = new Date('Oct 18, 2026 16:00:00').getTime();

const countdownInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.querySelector('.countdown-section').innerHTML = "<h3 class='section-heading'>OUR JOURNEY HAS BEGUN!</h3>";
    }
}, 1000);
