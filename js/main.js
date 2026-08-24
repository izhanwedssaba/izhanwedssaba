/* ==========================================================
   Mohammed Izhan & Bazila Saba
   Wedding Invitation
   Version 3.0
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       OPEN INVITATION
    ====================================================== */

    const opening = document.getElementById("opening-screen");
    const website = document.getElementById("website");
    const enterBtn = document.getElementById("enterBtn");

    website.style.display = "none";

    // Keep the envelope hidden until the monogram and both names finish revealing.
    setTimeout(() => {
        enterBtn.classList.add("envelope-ready");
    }, 3300);

    enterBtn.addEventListener("click", () => {

        if (enterBtn.classList.contains("opening")) return;

        // 1. Flap opens immediately; the paper rises with the CSS delay.
        enterBtn.classList.add("opening");

        // 2. Bring in the real invitation while the envelope is floating away.
        setTimeout(() => {
            website.style.display = "block";
            website.classList.add("website-visible");
            window.scrollTo({ top: 0, behavior: "instant" });
        }, 1850);

        // 3. Fade the opening scene only after the main invitation has started floating in.
        setTimeout(() => {
            opening.classList.add("closing");
        }, 2050);

        // 4. Remove the opening layer after all motion is complete.
        setTimeout(() => {
            opening.style.display = "none";
        }, 2850);

    });


    /* ======================================================
       SCRATCH TO REVEAL — WEDDING DATE
       Opaque coating: date cannot be seen before scratching.
    ====================================================== */

    const scratchCard = document.getElementById("scratchCard");
    const scratchCanvas = document.getElementById("scratchCanvas");
    const scratchHint = document.getElementById("scratchHint");

    if (scratchCard && scratchCanvas) {
        const ctx = scratchCanvas.getContext("2d", { willReadFrequently: true });
        let drawing = false;
        let lastPoint = null;
        let hintHidden = false;
        let revealed = false;
        let resizeObserver;

        function paintScratchCoating() {
            const rect = scratchCanvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const dpr = Math.max(1, window.devicePixelRatio || 1);
            scratchCanvas.width = Math.round(rect.width * dpr);
            scratchCanvas.height = Math.round(rect.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.globalCompositeOperation = "source-over";
            ctx.clearRect(0, 0, rect.width, rect.height);

            const foil = ctx.createLinearGradient(0, 0, rect.width, rect.height);
            foil.addColorStop(0, "#9a5c0d");
            foil.addColorStop(.22, "#efc96b");
            foil.addColorStop(.48, "#b97914");
            foil.addColorStop(.72, "#ffe09a");
            foil.addColorStop(1, "#8b5208");
            ctx.fillStyle = foil;
            ctx.fillRect(0, 0, rect.width, rect.height);

            const shine = ctx.createRadialGradient(
                rect.width * .35, rect.height * .2, 4,
                rect.width * .5, rect.height * .5, rect.width
            );
            shine.addColorStop(0, "rgba(255,255,255,.68)");
            shine.addColorStop(.3, "rgba(255,240,181,.25)");
            shine.addColorStop(1, "rgba(121,68,7,.10)");
            ctx.fillStyle = shine;
            ctx.fillRect(0, 0, rect.width, rect.height);

            lastPoint = null;
            scratchCanvas.style.opacity = "1";
            scratchCanvas.style.pointerEvents = "auto";
        }

        function getPoint(event) {
            const rect = scratchCanvas.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }

        function erase(point, fromPoint) {
            const radius = Math.max(24, Math.min(scratchCard.clientWidth * .07, 48));
            ctx.save();
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = radius * 2;

            ctx.beginPath();
            if (fromPoint) {
                ctx.moveTo(fromPoint.x, fromPoint.y);
                ctx.lineTo(point.x, point.y);
            } else {
                ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
            }
            ctx.stroke();
            ctx.restore();
        }

        function hideHint() {
            if (!hintHidden && scratchHint) {
                hintHidden = true;
                scratchHint.classList.add("is-hidden");
            }
        }

        function revealIfNeeded() {
            if (revealed) return;

            const image = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
            let transparent = 0;
            let samples = 0;

            for (let i = 3; i < image.length; i += 128) {
                samples++;
                if (image[i] < 35) transparent++;
            }

            if (samples && transparent / samples > .42) {
                revealed = true;
                scratchCanvas.style.transition = "opacity .65s ease";
                scratchCanvas.style.opacity = "0";
                scratchCanvas.style.pointerEvents = "none";
                if (scratchHint) scratchHint.style.display = "none";
                scratchCard.classList.add("is-revealed");
                launchWeddingCelebration();

                // Cinematic celebration immediately after the wedding date is revealed.
                if (typeof window.launchWeddingCelebration === "function") {
                    launchWeddingCelebration();
                }
            }
        }

        scratchCanvas.addEventListener("pointerdown", (event) => {
            if (revealed) return;
            drawing = true;
            scratchCanvas.setPointerCapture(event.pointerId);
            lastPoint = getPoint(event);
            hideHint();
            erase(lastPoint);
        });

        scratchCanvas.addEventListener("pointermove", (event) => {
            if (!drawing || revealed) return;
            const point = getPoint(event);
            erase(point, lastPoint);
            lastPoint = point;
        });

        function stopDrawing() {
            if (!drawing) return;
            drawing = false;
            lastPoint = null;
            revealIfNeeded();
        }

        scratchCanvas.addEventListener("pointerup", stopDrawing);
        scratchCanvas.addEventListener("pointercancel", stopDrawing);

        requestAnimationFrame(() => {
            requestAnimationFrame(paintScratchCoating);
        });

        if ("ResizeObserver" in window) {
            resizeObserver = new ResizeObserver(() => {
                if (!revealed) paintScratchCoating();
            });
            resizeObserver.observe(scratchCard);
        } else {
            window.addEventListener("resize", () => {
                if (!revealed) paintScratchCoating();
            });
        }
    }

    /* ======================================================
       COUNTDOWN
    ====================================================== */

    const targetDate = new Date("October 18, 2026 12:15:00").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    const message = document.getElementById("countdown-message");

    function updateCountdown() {

        const now = new Date().getTime();

        const distance = targetDate - now;

        if (distance <= 0) {

            document.querySelector(".countdown").style.display = "none";

            message.innerHTML = `

            <h2 style="color:#0F5132;margin-top:25px;">
            ✨ Alhamdulillah!
            </h2>

            <p style="margin-top:15px;font-size:18px;line-height:1.8;">
            Today marks the beginning of our beautiful journey together.<br>
            Please keep us in your duas. 🤍
            </p>

            `;

            return;

        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));

        const hours = Math.floor(

            (distance % (1000 * 60 * 60 * 24))

            / (1000 * 60 * 60)

        );

        const minutes = Math.floor(

            (distance % (1000 * 60 * 60))

            / (1000 * 60)

        );

        const seconds = Math.floor(

            (distance % (1000 * 60))

            / 1000

        );

        daysEl.textContent = days;

        hoursEl.textContent = String(hours).padStart(2, "0");

        minutesEl.textContent = String(minutes).padStart(2, "0");

        secondsEl.textContent = String(seconds).padStart(2, "0");

    }

    updateCountdown();

    setInterval(updateCountdown, 1000);

    /* ======================================================
       SCROLL REVEAL
    ====================================================== */

    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                }

            });

        },

        {

            threshold: 0.15

        }

    );

    reveals.forEach(section => observer.observe(section));

});

/* ==========================================================
   PART 3B
   Add to Calendar + Final Enhancements
========================================================== */

/* ======================================================
   ADD TO CALENDAR
====================================================== */

const calendarBtn = document.getElementById("calendarBtn");

if (calendarBtn) {
    calendarBtn.addEventListener("click", () => {
        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: "Mohammed Izhan & Bazila Saba Wedding",
            dates: "20261018T064500Z/20261018T100000Z",
            ctz: "Asia/Kolkata",
            details: "Nikah at 12:15 PM followed by Valima at 2:00 PM. We warmly invite you to celebrate our special day with us.",
            location: "Masjid-e-Mitpala & VK Mahal, Vaniyambadi"
        });

        window.location.href = "https://calendar.google.com/calendar/render?" + params.toString();
    });
}

/* ======================================================
   HERO STAGGER ANIMATION
====================================================== */

window.addEventListener("load", () => {

    const heroItems=document.querySelectorAll(
".hero-top,.couple-name,.ampersand,.date,.countdown"
);

heroItems.forEach((item,index)=>{

    item.style.opacity="0";
    item.style.transform="translateY(25px)";

    setTimeout(()=>{

        item.style.transition="all .9s ease";

        item.style.opacity="1";

        item.style.transform="translateY(0)";

    },400+(index*220));

});

});

/* ======================================================
   SMOOTH BUTTON HOVER
====================================================== */

document.querySelectorAll("button, .map-btn").forEach(button => {

    button.addEventListener("mouseenter", () => {

        button.style.transform = "translateY(-3px)";

    });

    button.addEventListener("mouseleave", () => {

        button.style.transform = "translateY(0)";

    });

});

/* ======================================================
   YEAR
====================================================== */

console.log("Mohammed Izhan & Bazila Saba Wedding Website");
console.log("Version 3.0");
console.log("© 2026");


/* ======================================================
   CINEMATIC CELEBRATION — HEARTS + GOLD SPARKLES
====================================================== */
function launchWeddingCelebration() {
    const layer = document.getElementById("celebrationLayer");
    if (!layer || layer.dataset.played === "true") return;
    layer.dataset.played = "true";

    const colors = ["#c04d63", "#e97d90", "#f6b0bb", "#c7902d", "#f0c86b", "#ffffff"];
    const total = window.innerWidth < 650 ? 58 : 88;

    for (let i = 0; i < total; i++) {
        const el = document.createElement("span");
        const heart = Math.random() < .62;
        const angle = Math.random() * Math.PI * 2;
        const distance = 120 + Math.random() * (window.innerWidth < 650 ? 280 : 520);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance + 80 + Math.random() * 240;

        el.className = "celebration-particle" + (heart ? " heart" : "");
        if (heart) el.textContent = Math.random() < .8 ? "♥" : "✦";

        el.style.setProperty("--x", x + "px");
        el.style.setProperty("--y", y + "px");
        el.style.setProperty("--size", (heart ? 14 + Math.random() * 20 : 5 + Math.random() * 9) + "px");
        el.style.setProperty("--rotate", (Math.random() * 720 - 360) + "deg");
        el.style.setProperty("--duration", (1.7 + Math.random() * 1.5) + "s");
        el.style.setProperty("--particle-color", colors[Math.floor(Math.random() * colors.length)]);
        el.style.animationDelay = (Math.random() * .18) + "s";
        layer.appendChild(el);
        setTimeout(() => el.remove(), 3800);
    }

    setTimeout(() => {
        for (let i = 0; i < 22; i++) {
            const el = document.createElement("span");
            el.className = "celebration-particle heart";
            el.textContent = Math.random() < .65 ? "♥" : "✦";
            el.style.setProperty("--x", ((Math.random() - .5) * window.innerWidth * .9) + "px");
            el.style.setProperty("--y", (120 + Math.random() * window.innerHeight * .7) + "px");
            el.style.setProperty("--size", (10 + Math.random() * 18) + "px");
            el.style.setProperty("--rotate", (Math.random() * 540 - 270) + "deg");
            el.style.setProperty("--duration", (1.8 + Math.random() * 1.2) + "s");
            el.style.setProperty("--particle-color", colors[Math.floor(Math.random() * colors.length)]);
            layer.appendChild(el);
            setTimeout(() => el.remove(), 3500);
        }
    }, 260);
}
