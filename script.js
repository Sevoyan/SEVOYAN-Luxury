document.addEventListener("DOMContentLoaded", () => {

const button = document.querySelector("button");

button.addEventListener("click", () => {
    alert("Բարի գալուստ SEVOYAN Luxury ✨");
});

const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.boxShadow = "0 0 25px gold";
    });

    card.addEventListener("mouseleave", () => {
        card.style.boxShadow = "none";
    });
});

});
