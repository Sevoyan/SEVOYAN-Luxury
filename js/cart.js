let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    cart.push({
        name: name,
        price: price
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(name + " ավելացվեց զամբյուղ։");
}

function updateCartCount() {
    const count = document.getElementById("cart-count");

    if (count) {
        count.textContent = cart.length;
    }
}

updateCartCount();
