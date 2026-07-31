document.addEventListener("DOMContentLoaded", () => {

  // Smooth scroll
  const shopBtn = document.querySelector(".btn");
  if (shopBtn) {
    shopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(".collections").scrollIntoView({
        behavior: "smooth"
      });
    });
  }

  // Cart counter
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartCount();

document.querySelectorAll(".product button").forEach((button, index) => {
    button.addEventListener("click", () => {

        const product = {
            id: index,
            name: document.querySelectorAll(".product h3")[index].textContent,
            price: document.querySelectorAll(".product p")[index].textContent,
            image: document.querySelectorAll(".product img")[index].src
        };

        cart.push(product);

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

        alert("✅ Ապրանքը ավելացվեց զամբյուղ։");
    });
});

function updateCartCount(){
    document.getElementById("cart-count").textContent = cart.length;
}
  // Card animation
  document.querySelectorAll(".product").forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-12px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });
  });

});
