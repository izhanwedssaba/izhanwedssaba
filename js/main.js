document.addEventListener("DOMContentLoaded", () => {

    const opening = document.getElementById("opening-screen");
    const enterBtn = document.getElementById("enterBtn");

    if (!opening || !enterBtn) return;

    enterBtn.addEventListener("click", () => {

        opening.style.opacity = "0";

        setTimeout(() => {
            opening.style.display = "none";
        }, 1000);

    });

});
const weddingDate = new Date("October 18, 2026 12:15:00").getTime();

setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdown = document.getElementById("countdown");

    if (countdown) {
        countdown.innerHTML =
            `${days} Days • ${hours} Hours • ${minutes} Minutes • ${seconds} Seconds`;
    }

    if (distance < 0 && countdown) {
        countdown.innerHTML = "✨ Today is our Wedding Day ✨";
    }
}, 1000);
