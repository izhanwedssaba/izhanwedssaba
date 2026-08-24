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

        function resizeScratchCanvas() {
            const rect = scratchCard.getBoundingClientRect();
            const dpr = Math.max(1, window.devicePixelRatio || 1);

            scratchCanvas.width = Math.round(rect.width * dpr);
            scratchCanvas.height = Math.round(rect.height * dpr);
            scratchCanvas.style.width = rect.width + "px";
            scratchCanvas.style.height = rect.height + "px";

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Premium antique-gold foil effect.
            const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
            gradient.addColorStop(0, "#b67d21");
            gradient.addColorStop(.22, "#e5bd67");
            gradient.addColorStop(.5, "#b77b20");
            gradient.addColorStop(.78, "#e8c66f");
            gradient.addColorStop(1, "#9d6517");

            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, rect.width, rect.height);

            // Soft foil highlights.
            const shine = ctx.createLinearGradient(0, 0, rect.width, 0);
            shine.addColorStop(0, "rgba(255,255,255,0)");
            shine.addColorStop(.45, "rgba(255,255,255,.28)");
            shine.addColorStop(.62, "rgba(255,255,255,.08)");
            shine.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = shine;
            ctx.fillRect(0, 0, rect.width, rect.height);

            lastPoint = null;
        }

        function getPoint(event) {
            const rect = scratchCanvas.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }

        function erase(point, fromPoint) {
            const radius = Math.max(24, Math.min(scratchCard.clientWidth * .065, 46));

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
            const sampleStep = 64;

            for (let i = 3; i < image.length; i += sampleStep) {
                if (image[i] < 40) transparent++;
            }

            const sampled = Math.ceil(image.length / sampleStep);
            if (transparent / sampled > .46) {
                revealed = true;
                scratchCanvas.style.transition = "opacity .65s ease";
                scratchCanvas.style.opacity = "0";
                scratchCanvas.style.pointerEvents = "none";
                if (scratchHint) scratchHint.style.display = "none";
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
        scratchCanvas.addEventListener("pointerleave", () => {
            if (drawing) stopDrawing();
        });

        resizeScratchCanvas();

        window.addEventListener("resize", () => {
            if (!revealed) resizeScratchCanvas();
        });
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

        const start = new Date("2026-10-18T12:15:00");
        const end = new Date("2026-10-18T15:30:00");

        function formatDate(date) {
            return date
                .toISOString()
                .replace(/[-:]/g, "")
                .split(".")[0] + "Z";
        }

        const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Mohammed Izhan & Bazila Saba Wedding
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
LOCATION:Masjid-e-Mitpala & VK Mahal, Vaniyambadi
DESCRIPTION:With the blessings of our parents, we warmly invite you to our Nikah and Valima. Your presence and duas will mean a lot to us.
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([ics], {
            type: "text/calendar;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "Mohammed_Izhan_Bazila_Saba_Wedding.ics";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

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
