
/* Final envelope interaction timer: does not control visibility. */
document.addEventListener("DOMContentLoaded", () => {
    const envelope = document.getElementById("enterBtn");
    if (envelope) {
        window.setTimeout(() => {
            envelope.classList.add("envelope-ready");
        }, 5250);
    }
}, { once: true });




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

    if (website) {
        website.style.setProperty("display", "block", "important");
        website.style.setProperty("visibility", "visible", "important");
        website.style.setProperty("opacity", "0", "important");
        website.style.setProperty("pointer-events", "none", "important");
    }

    // Reliable opening controller for desktop and mobile.
    if (enterBtn) {
        let invitationOpening = false;

        const revealInvitation = () => {
            if (invitationOpening) return;
            invitationOpening = true;

            // 1. Physical envelope opening.
            enterBtn.classList.add("opening");

            // 2. Let the open envelope be clearly visible, then exit.
            window.setTimeout(() => {
                enterBtn.classList.add("envelope-exit");
            }, 1450);

            // 3. Start the second page fade while the opening overlay is still
            // present. This preloads the next scene behind the outgoing overlay,
            // eliminating the blank white gap seen in the previous build.
            window.setTimeout(() => {
                document.body.classList.add("invitation-reveal");
            }, 1850);

            // 4. Fade the opening overlay over the already-rendered invitation.
            window.setTimeout(() => {
                if (opening) {
                    opening.classList.add("cinematic-fade");
                }
            }, 1950);

            // 5. Remove the overlay only after its fade completes.
            window.setTimeout(() => {
                if (opening) {
                    opening.style.setProperty("display", "none", "important");
                    opening.style.setProperty("pointer-events", "none", "important");
                }
                if (website) {
                    website.style.setProperty("opacity", "1", "important");
                    website.style.setProperty("pointer-events", "auto", "important");
                }
                window.scrollTo({ top: 0, behavior: "auto" });
            }, 2700);
        };

        const triggerOpen = (event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            revealInvitation();
        };

        // Direct click handler works on desktop and normal mobile taps.
        enterBtn.onclick = triggerOpen;

        // Touch fallback for Android browsers.
        enterBtn.addEventListener("touchend", triggerOpen, {
            passive: false
        });

        // Pointer fallback.
        enterBtn.addEventListener("pointerup", triggerOpen, {
            passive: false
        });

        enterBtn.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                triggerOpen(event);
            }
        });
    }

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
            const rect = scratchCard.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const dpr = Math.max(1, window.devicePixelRatio || 1);
            scratchCanvas.width = Math.round(rect.width * dpr);
            scratchCanvas.height = Math.round(rect.height * dpr);
            scratchCanvas.style.width = rect.width + "px";
            scratchCanvas.style.height = rect.height + "px";

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.globalCompositeOperation = "source-over";
            ctx.clearRect(0, 0, rect.width, rect.height);

            /* Fully opaque antique-gold foil */
            const base = ctx.createLinearGradient(0, 0, rect.width, rect.height);
            base.addColorStop(0, "#b97c1c");
            base.addColorStop(.24, "#d9a94b");
            base.addColorStop(.5, "#b67918");
            base.addColorStop(.76, "#e4bc62");
            base.addColorStop(1, "#9b6214");
            ctx.fillStyle = base;
            ctx.fillRect(0, 0, rect.width, rect.height);

            /* Opaque center glow, still covering the reveal text */
            const glow = ctx.createRadialGradient(
                rect.width * .52, rect.height * .42, 4,
                rect.width * .52, rect.height * .42, Math.max(rect.width, rect.height) * .72
            );
            glow.addColorStop(0, "rgba(255,241,190,.52)");
            glow.addColorStop(.38, "rgba(239,191,91,.20)");
            glow.addColorStop(1, "rgba(145,89,13,.08)");
            ctx.fillStyle = glow;
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

                // Cinematic celebration immediately after the wedding date is revealed.
                if (typeof window.launchWeddingCelebration === "function") {
                    window.launchWeddingCelebration();
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
