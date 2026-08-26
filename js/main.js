

/* ==========================================================
   RELIABLE HEART SPARKLE CELEBRATION
   ========================================================== */
window.launchWeddingCelebration = function(origin) {
    if (window.__weddingCelebrationPlayed) return;
    window.__weddingCelebrationPlayed = true;

    const rect = origin ? origin.getBoundingClientRect() : {
        left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0
    };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const layer = document.createElement("div");
    layer.className = "wedding-heart-burst";
    document.body.appendChild(layer);

    const symbols = ["♥", "♡", "✦", "♥", "✧", "♡"];
    const colors = ["#f4b7c1", "#f9d4dc", "#f1c978", "#ffffff", "#d68b9a"];

    for (let i = 0; i < 52; i++) {
        const angle = (Math.PI * 2 * i / 52) + (Math.random() - .5) * .22;
        const distance = 70 + Math.random() * Math.min(innerWidth, 260);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance * .72;

        const particle = document.createElement("span");
        particle.className = "wedding-heart-particle";
        particle.textContent = symbols[i % symbols.length];
        particle.style.left = `${cx}px`;
        particle.style.top = `${cy}px`;
        particle.style.setProperty("--tx", `${x}px`);
        particle.style.setProperty("--ty", `${y}px`);
        particle.style.setProperty("--delay", `${Math.random() * 180}ms`);
        particle.style.setProperty("--size", `${12 + Math.random() * 22}px`);
        particle.style.color = colors[i % colors.length];
        layer.appendChild(particle);
    }

    const flash = document.createElement("div");
    flash.className = "wedding-reveal-glow";
    document.body.appendChild(flash);

    window.setTimeout(() => {
        layer.remove();
        flash.remove();
    }, 2200);
};


/* ==========================================================
   HEART COMPLETION DETECTOR
   Works even when the existing scratch code does not emit an event.
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const canvas =
        document.getElementById("scratchCanvas") ||
        document.querySelector(".scratch-canvas");

    if (!canvas) return;

    let celebrated = false;

    const complete = () => {
        if (celebrated) return;
        celebrated = true;

        canvas.classList.add("scratch-complete", "revealed");
        romanticHeartCelebration(canvas);

        const dateContent =
            document.querySelector(".scratch-date-content") ||
            document.querySelector(".scratch-reveal-content");

        if (dateContent) dateContent.classList.add("revealed");
    };

    const checkProgress = () => {
        if (celebrated) return;

        try {
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            const w = canvas.width;
            const h = canvas.height;
            if (!w || !h) return;

            const step = Math.max(12, Math.floor(Math.min(w, h) / 34));
            let total = 0;
            let clear = 0;

            for (let y = step; y < h; y += step) {
                for (let x = step; x < w; x += step) {
                    total++;
                    if (ctx.getImageData(x, y, 1, 1).data[3] < 25) clear++;
                }
            }

            if (total && clear / total >= 0.30) {
                complete();
            }
        } catch (_) {
            // If another implementation owns the canvas, completion events below
            // still provide a fallback.
        }
    };

    // Existing custom event support.
    canvas.addEventListener("scratchcomplete", complete);

    // Check after every completed finger/mouse stroke.
    ["pointerup", "touchend", "mouseup"].forEach(type => {
        canvas.addEventListener(type, () => {
            window.setTimeout(checkProgress, 60);
        }, { passive: true });
    });

    // Also check periodically while the user is actively scratching.
    ["pointermove", "touchmove", "mousemove"].forEach(type => {
        canvas.addEventListener(type, () => {
            window.setTimeout(checkProgress, 0);
        }, { passive: true });
    });

    // Class observer fallback.
    new MutationObserver(() => {
        if (
            canvas.classList.contains("scratch-complete") ||
            canvas.classList.contains("revealed")
        ) {
            complete();
        }
    }).observe(canvas, {
        attributes: true,
        attributeFilter: ["class"]
    });
}, { once: true });


/* ==========================================================
   ROMANTIC CANVAS SKIN + HEART SPARKLE COMPLETION
   ========================================================== */
function applyRomanticScratchSkin(canvas) {
    if (!canvas) return;

    const parent = canvas.parentElement;
    const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const w = rect.width;
            const h = rect.height;

            // Romantic dusty-rose → blush → champagne coating.
            const gradient = ctx.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, "#b77780");
            gradient.addColorStop(.46, "#d9a3a7");
            gradient.addColorStop(1, "#c6848c");

            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // Soft champagne glow.
            const glow = ctx.createRadialGradient(w * .72, h * .22, 0, w * .72, h * .22, Math.max(w, h) * .72);
            glow.addColorStop(0, "rgba(246,215,159,.55)");
            glow.addColorStop(.45, "rgba(255,255,255,.08)");
            glow.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, w, h);

            // Fine sparkle texture.
            for (let i = 0; i < 110; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h;
                const r = Math.random() * 1.4 + .25;
                ctx.fillStyle = i % 3 === 0
                    ? "rgba(255,244,235,.70)"
                    : "rgba(255,255,255,.34)";
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Subtle heart motifs.
            ctx.save();
            ctx.globalAlpha = .28;
            ctx.fillStyle = "#fff6ef";
            ctx.font = `${Math.max(16, Math.min(28, w * .07))}px serif`;
            ["♡", "♥", "♡", "✦", "♡", "♥"].forEach((symbol, i) => {
                ctx.fillText(symbol, w * (.12 + i * .14), h * (.25 + (i % 2) * .45));
            });
            ctx.restore();

            canvas.dataset.romanticSkinned = "true";
        }
    };

    resizeCanvas();
    new ResizeObserver(resizeCanvas).observe(parent || canvas);
}

document.addEventListener("DOMContentLoaded", () => {
    const canvas =
        document.getElementById("scratchCanvas") ||
        document.querySelector(".scratch-canvas");

    if (!canvas) return;

    // Wait for the existing scratch script to finish sizing the canvas,
    // then paint the romantic coating directly onto it.
    window.setTimeout(() => applyRomanticScratchSkin(canvas), 150);

    let celebrated = false;
    const celebrate = () => {
        if (celebrated) return;
        celebrated = true;
        romanticHeartCelebration(canvas);
    };

    // Detect the existing completion state or custom completion event.
    canvas.addEventListener("scratchcomplete", celebrate);

    const observer = new MutationObserver(() => {
        if (
            canvas.classList.contains("revealed") ||
            canvas.classList.contains("scratch-complete") ||
            document.querySelector(".scratch-date-content.revealed") ||
            document.querySelector(".scratch-reveal-content.revealed")
        ) {
            celebrate();
        }
    });

    observer.observe(canvas, { attributes: true, attributeFilter: ["class"] });
}, { once: true });


/* ==========================================================
   ROMANTIC HEART SPARKLE CELEBRATION
   ========================================================== */
function romanticHeartCelebration(originElement) {
    const rect = originElement
        ? originElement.getBoundingClientRect()
        : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const glow = document.createElement("div");
    glow.className = "scratch-celebration-glow";
    document.body.appendChild(glow);
    glow.addEventListener("animationend", () => glow.remove(), { once: true });

    const colors = ["#f8d5dd", "#eab1bd", "#d9a0a0", "#f2d18c", "#fff4dc"];

    for (let i = 0; i < 42; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 45 + Math.random() * 180;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance * 0.78;
        const heart = document.createElement("span");
        heart.className = "heart-sparkle";
        heart.style.left = `${cx}px`;
        heart.style.top = `${cy}px`;
        heart.style.setProperty("--burst-x", `${x}px`);
        heart.style.setProperty("--burst-y", `${y}px`);
        heart.style.setProperty("--heart-size", `${8 + Math.random() * 13}px`);
        heart.style.setProperty("--heart-color", colors[i % colors.length]);
        heart.style.animationDelay = `${Math.random() * 0.18}s`;
        document.body.appendChild(heart);
        heart.addEventListener("animationend", () => heart.remove(), { once: true });
    }
}

/* Observe the existing scratch reveal and celebrate exactly once. */
document.addEventListener("DOMContentLoaded", () => {
    const scratchTarget =
        document.getElementById("scratchCanvas") ||
        document.querySelector(".scratch-canvas") ||
        document.querySelector(".scratch-container") ||
        document.querySelector("[data-scratch]");

    if (!scratchTarget) return;

    let celebrated = false;

    const celebrateOnce = () => {
        if (celebrated) return;
        celebrated = true;
        romanticHeartCelebration(scratchTarget);
    };

    // Existing implementations often toggle one of these reveal classes.
    const observer = new MutationObserver(() => {
        const revealed =
            scratchTarget.classList.contains("revealed") ||
            scratchTarget.classList.contains("scratch-complete") ||
            document.querySelector(".scratch-date-content.revealed") ||
            document.querySelector(".scratch-reveal-content.revealed");

        if (revealed) celebrateOnce();
    });

    observer.observe(scratchTarget, {
        attributes: true,
        attributeFilter: ["class"]
    });

    // Fallback custom event for scratch implementations.
    scratchTarget.addEventListener("scratchcomplete", celebrateOnce);
}, { once: true });


/* ==========================================================
   SEAMLESS PAGE HANDOFF
   ========================================================== */
function beginSmoothInvitationTransition() {
    const opening = document.getElementById("opening-screen");
    const website = document.getElementById("website");

    document.body.classList.add("transition-handoff");

    // Put page 2 underneath immediately so there can never be a blank gap.
    if (website) {
        website.style.setProperty("display", "block", "important");
        website.style.setProperty("visibility", "visible", "important");
        website.style.setProperty("pointer-events", "none", "important");
        website.style.setProperty("opacity", "0", "important");
    }

    // Force the browser to paint page 2 before starting the cross-fade.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add("invitation-reveal");

            if (website) {
                website.style.removeProperty("opacity");
                website.style.removeProperty("pointer-events");
            }

            if (opening) {
                opening.classList.add("transitioning", "cinematic-fade");
            }
        });
    });

    // Remove the opening layer only after both fade animations finish.
    window.setTimeout(() => {
        if (opening) {
            opening.style.setProperty("display", "none", "important");
            opening.style.setProperty("pointer-events", "none", "important");
        }
    }, 820);
}


/* ==========================================================
   OPEN BUTTON READINESS + INTERACTION BRIDGE
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const envelopeButton = document.getElementById("enterBtn");
    if (!envelopeButton) return;

    // The previous build kept the CSS reveal, but no longer restored the
    // envelope-ready class after removing competing handlers.
    window.setTimeout(() => {
        envelopeButton.classList.add("envelope-ready");
        envelopeButton.style.setProperty("pointer-events", "auto", "important");
    }, 4250);

    // Mobile browsers can dispatch pointer and click differently.
    // Forward click to the existing authoritative pointerup controller only
    // when the pointerup path did not already run.
    let handled = false;

    envelopeButton.addEventListener("pointerup", () => {
        handled = true;
    }, true);

    envelopeButton.addEventListener("click", (event) => {
        if (handled) {
            handled = false;
            return;
        }
        event.preventDefault();

        const synthetic = new PointerEvent("pointerup", {
            bubbles: true,
            cancelable: true,
            pointerType: "touch"
        });
        envelopeButton.dispatchEvent(synthetic);
    });
}, { once: true });

/* ==========================================================
   SAFE SCROLL UNLOCK
   Called only after the envelope animation has completed.
   ========================================================== */
function unlockInvitationScrollAfterEnvelope() {
    const root = document.documentElement;
    const body = document.body;
    const website = document.getElementById("website");

    root.classList.add("invitation-open");
    body.classList.remove("opening-locked-page");
    body.classList.add("invitation-reveal");

    // Release the first-page mobile scroll lock now, not when the envelope is tapped.
    body.style.removeProperty("position");
    body.style.removeProperty("inset");
    body.style.removeProperty("height");
    body.style.removeProperty("max-height");
    body.style.removeProperty("overflow");
    body.style.removeProperty("overflow-y");

    root.style.removeProperty("height");
    root.style.removeProperty("max-height");
    root.style.removeProperty("overflow");
    root.style.removeProperty("overflow-y");

    if (website) {
        website.style.setProperty("display", "block", "important");
        website.style.setProperty("visibility", "visible", "important");
        website.style.setProperty("opacity", "1", "important");
        website.style.setProperty("pointer-events", "auto", "important");
        website.style.setProperty("height", "auto", "important");
        website.style.setProperty("max-height", "none", "important");
        website.style.setProperty("overflow", "visible", "important");
    }
}






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

    // Single authoritative envelope opening controller.
    // No early scroll unlock or overlay removal is allowed.
    if (enterBtn) {
        let invitationOpening = false;

        const revealInvitation = () => {
            if (invitationOpening) return;
            invitationOpening = true;

            // Stop floating and begin the physical envelope opening.
            enterBtn.classList.remove("envelope-exit");
            enterBtn.classList.add("opening");
            enterBtn.setAttribute("aria-disabled", "true");

            // Keep the fully opened envelope visible during the handoff.
            // Page 2 will fade in underneath before the opening scene disappears.

            // Only after the envelope animation is complete, reveal page 2.
            window.setTimeout(() => {
                unlockInvitationScrollAfterEnvelope();
                beginSmoothInvitationTransition();
            }, 2550);

            // Remove the opening overlay after its fade, then ensure page 2 is active.
            window.setTimeout(() => {
                unlockInvitationScrollAfterEnvelope();
                window.scrollTo({ top: 0, behavior: "auto" });
            }, 3250);
        };

        const triggerOpen = (event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            revealInvitation();
        };

        // Use one primary interaction path. Pointer events cover modern Android
        // and desktop without triggering duplicate touch/click transitions.
        enterBtn.addEventListener("pointerup", triggerOpen, { passive: false });

        // Keyboard accessibility.
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

            const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
            scratchCanvas.width = Math.round(rect.width * dpr);
            scratchCanvas.height = Math.round(rect.height * dpr);
            scratchCanvas.style.width = rect.width + "px";
            scratchCanvas.style.height = rect.height + "px";

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.globalCompositeOperation = "source-over";
            ctx.clearRect(0, 0, rect.width, rect.height);

            // Romantic blush → dusty rose → champagne scratch surface.
            const base = ctx.createLinearGradient(0, 0, rect.width, rect.height);
            base.addColorStop(0, "#9f5f69");
            base.addColorStop(.34, "#c98790");
            base.addColorStop(.62, "#dca9a7");
            base.addColorStop(1, "#b86f79");
            ctx.fillStyle = base;
            ctx.fillRect(0, 0, rect.width, rect.height);

            // Soft champagne glow.
            const glow = ctx.createRadialGradient(
                rect.width * .5, rect.height * .34, 8,
                rect.width * .5, rect.height * .34, Math.max(rect.width, rect.height) * .72
            );
            glow.addColorStop(0, "rgba(255,241,213,.58)");
            glow.addColorStop(.46, "rgba(255,222,225,.18)");
            glow.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, rect.width, rect.height);

            // Fine sparkle texture directly on the real scratch canvas.
            for (let i = 0; i < 150; i++) {
                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;
                const r = Math.random() * 1.35 + .25;
                ctx.fillStyle = i % 4 === 0
                    ? "rgba(255,238,199,.82)"
                    : "rgba(255,255,255,.40)";
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }

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
            const w = scratchCanvas.width;
            const h = scratchCanvas.height;
            const step = Math.max(8, Math.floor(Math.min(w, h) / 42));
            let transparent = 0;
            let samples = 0;

            // Sample only points inside the heart silhouette.
            for (let py = step; py < h; py += step) {
                for (let px = step; px < w; px += step) {
                    const x = (px / w) * 2.2 - 1.1;
                    const y = 1.05 - (py / h) * 2.1;
                    const heart = Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3);

                    if (heart <= 0) {
                        samples++;
                        const alpha = image[(py * w + px) * 4 + 3];
                        if (alpha < 40) transparent++;
                    }
                }
            }

            if (samples && transparent / samples > .24) {
                revealed = true;
                scratchCanvas.style.transition = "opacity .7s ease";
                scratchCanvas.style.opacity = "0";
                scratchCanvas.style.pointerEvents = "none";
                if (scratchHint) scratchHint.style.display = "none";

                // Reliable sparkle celebration.
                if (typeof window.launchWeddingCelebration === "function") {
                    window.launchWeddingCelebration(scratchCard);
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


/* ==========================================================
   INDEPENDENT SCRATCH COMPLETION CELEBRATION — FINAL FIX
   ========================================================== */
(() => {
    let played = false;
    let lastCanvas = null;

    function burstFromScratch(canvas) {
        if (played || !canvas) return;
        played = true;

        const r = canvas.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        const layer = document.createElement("div");
        layer.className = "scratch-sparkle-layer";
        document.body.appendChild(layer);

        const glyphs = ["♥", "✦", "♡", "✧", "♥", "✦"];
        const colors = ["#f2aebb", "#f8d7dd", "#e7bf70", "#ffffff", "#d9879a"];

        for (let i = 0; i < 64; i++) {
            const a = (Math.PI * 2 * i / 64) + (Math.random() - .5) * .18;
            const d = 55 + Math.random() * 210;
            const particle = document.createElement("span");
            particle.className = "scratch-sparkle-particle";
            particle.textContent = glyphs[i % glyphs.length];
            particle.style.left = `${cx}px`;
            particle.style.top = `${cy}px`;
            particle.style.setProperty("--x", `${Math.cos(a) * d}px`);
            particle.style.setProperty("--y", `${Math.sin(a) * d * .72}px`);
            particle.style.setProperty("--size", `${12 + Math.random() * 22}px`);
            particle.style.setProperty("--delay", `${Math.random() * 140}ms`);
            particle.style.color = colors[i % colors.length];
            layer.appendChild(particle);
        }

        setTimeout(() => layer.remove(), 2400);
    }

    function detectCompletion(canvas) {
        if (!canvas || played) return;
        try {
            const style = getComputedStyle(canvas);
            if (
                canvas.style.pointerEvents === "none" ||
                parseFloat(canvas.style.opacity || style.opacity) < 0.25 ||
                canvas.classList.contains("revealed") ||
                canvas.classList.contains("scratch-complete")
            ) {
                burstFromScratch(canvas);
            }
        } catch (_) {}
    }

    document.addEventListener("DOMContentLoaded", () => {
        const canvas = document.getElementById("scratchCanvas") || document.querySelector(".scratch-canvas");
        if (!canvas) return;
        lastCanvas = canvas;

        // Mutation observer catches the exact completion state from existing code.
        new MutationObserver(() => detectCompletion(canvas)).observe(canvas, {
            attributes: true,
            attributeFilter: ["style", "class"]
        });

        // Also poll briefly after each interaction as a guaranteed fallback.
        ["pointerup", "touchend", "mouseup"].forEach(evt => {
            canvas.addEventListener(evt, () => {
                setTimeout(() => detectCompletion(canvas), 50);
                setTimeout(() => detectCompletion(canvas), 300);
                setTimeout(() => detectCompletion(canvas), 750);
            }, { passive: true });
        });
    });

  /* ==========================================================
   CHAMPAGNE GOLD + IVORY SCRATCH PATCH
   Add this block at the VERY END of js/main.js
   ========================================================== */

(() => {
  let celebrationPlayed = false;

  function launchCelebration(origin){
    if (celebrationPlayed || !origin) return;
    celebrationPlayed = true;

    const rect = origin.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const layer = document.createElement("div");
    layer.className = "champagne-celebration";
    document.body.appendChild(layer);

    const glyphs = ["♥","✦","♡","✧","❋"];
    const colors = ["#c9a86a","#e6d0a2","#fffdf8","#b89252","#f1e8d7"];

    for(let i=0;i<62;i++){
      const angle = (Math.PI*2*i/62) + (Math.random()-.5)*.2;
      const distance = 55 + Math.random()*225;

      const p = document.createElement("span");
      p.className = "champagne-particle";
      p.textContent = glyphs[i % glyphs.length];
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.style.setProperty("--tx", `${Math.cos(angle)*distance}px`);
      p.style.setProperty("--ty", `${Math.sin(angle)*distance*.72}px`);
      p.style.setProperty("--delay", `${Math.random()*170}ms`);
      p.style.setProperty("--size", `${10 + Math.random()*21}px`);
      p.style.color = colors[i % colors.length];
      layer.appendChild(p);
    }

    setTimeout(() => layer.remove(), 2350);
  }

  function paintChampagneIvory(canvas){
    const rect = canvas.getBoundingClientRect();
    if(!rect.width || !rect.height) return;

    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = Math.round(rect.width*dpr);
    canvas.height = Math.round(rect.height*dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.globalCompositeOperation = "source-over";

    const g = ctx.createLinearGradient(0,0,rect.width,rect.height);
    g.addColorStop(0,"#b89252");
    g.addColorStop(.32,"#c9a86a");
    g.addColorStop(.64,"#e6d0a2");
    g.addColorStop(1,"#c3a06a");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,rect.width,rect.height);

    const glow = ctx.createRadialGradient(
      rect.width*.5, rect.height*.34, 8,
      rect.width*.5, rect.height*.34, Math.max(rect.width,rect.height)*.72
    );
    glow.addColorStop(0,"rgba(255,253,248,.52)");
    glow.addColorStop(.48,"rgba(230,208,162,.24)");
    glow.addColorStop(1,"rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0,0,rect.width,rect.height);

    for(let i=0;i<155;i++){
      ctx.fillStyle = i%4===0
        ? "rgba(255,250,235,.88)"
        : "rgba(255,255,255,.42)";
      ctx.beginPath();
      ctx.arc(
        Math.random()*rect.width,
        Math.random()*rect.height,
        Math.random()*1.35+.25,
        0, Math.PI*2
      );
      ctx.fill();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const canvas =
      document.getElementById("scratchCanvas") ||
      document.querySelector(".scratch-canvas");

    if(!canvas) return;

    setTimeout(() => paintChampagneIvory(canvas), 120);

    const launchIfComplete = () => {
      const style = getComputedStyle(canvas);
      const complete =
        canvas.style.pointerEvents === "none" ||
        canvas.classList.contains("scratch-complete") ||
        canvas.classList.contains("revealed") ||
        parseFloat(canvas.style.opacity || style.opacity) < .25;

      if(complete) launchCelebration(canvas);
    };

    new MutationObserver(launchIfComplete).observe(canvas,{
      attributes:true,
      attributeFilter:["style","class"]
    });

    ["pointerup","touchend","mouseup"].forEach(type => {
      canvas.addEventListener(type, () => {
        setTimeout(launchIfComplete,80);
        setTimeout(launchIfComplete,450);
      }, {passive:true});
    });

    canvas.addEventListener("scratchcomplete", () => launchCelebration(canvas));
  }, {once:true});
})();
