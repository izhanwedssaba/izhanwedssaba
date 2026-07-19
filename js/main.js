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

enterBtn.addEventListener("click", () => {

    console.log("ENVELOPE CLICKED");

    enterBtn.classList.add("opening");

});

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
