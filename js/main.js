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
