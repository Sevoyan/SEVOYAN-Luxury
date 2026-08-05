// SEVOYAN Luxury - shop.js

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const badge = document.getElementById("cart-count");

    if (badge) {
        let total = 0;
        cart.forEach(item => total += item.qty);
        badge.innerText = total;
    }
}

function addToCart(name, price, image = "") {
    let cart = getCart();

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            qty: 1
        });
    }

    saveCart(cart);
    updateCartCount();

    alert("✅ Ապրանքը ավելացվեց զամբյուղ");
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
});
