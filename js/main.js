const opening = document.getElementById("opening-screen");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {

    opening.style.opacity = "0";

    setTimeout(() => {

        opening.style.display = "none";

    },1000);

});
