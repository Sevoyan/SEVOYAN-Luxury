// SEVOYAN Luxury - shop.js

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price, image = "") {
    let cart = getCart();

    cart.push({
        name: name,
        price: price,
        image: image,
        qty: 1
    });

    saveCart(cart);

    alert("✅ Ապրանքը ավելացվեց զամբյուղ");
}

function cartCount() {
    const cart = getCart();
    const badge = document.getElementById("cart-count");

    if (badge) {
        badge.innerText = cart.length;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    cartCount();
});
