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
  let cartCount = 0;

  document.querySelectorAll(".product button").forEach(button => {
    button.addEventListener("click", () => {
      cartCount++;
      button.textContent = "✅ Added";
      button.disabled = true;

      alert(`Ապրանքը ավելացվեց զամբյուղ։ (${cartCount})`);
    });
  });

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
