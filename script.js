document.addEventListener("DOMContentLoaded", () => {

    // Hero button
    const heroBtn = document.querySelector(".hero button");
    if (heroBtn) {
        heroBtn.addEventListener("click", () => {
            document.querySelector("#shop").scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    // Add to cart
    let cart = 0;
    const buttons = document.querySelectorAll(".card button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            cart++;
            button.innerHTML = "✅ Ավելացվեց";
            button.disabled = true;

            alert("Ապրանքը ավելացվեց զամբյուղ (" + cart + ")");
        });
    });

    // Card animation
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-12px)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0)";
        });
    });

});
