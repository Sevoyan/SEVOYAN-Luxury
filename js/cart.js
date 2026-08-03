let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");

function renderCart() {
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = "<h2>🛒 Ձեր զամբյուղը դատարկ է</h2>";
        return;
    }

    let html = "";

    cart.forEach((item, index) => {
        html += `
        <div class="cart-item">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            <button onclick="removeItem(${index})">❌ Հեռացնել</button>
        </div>
        `;
    });

    cartItems.innerHTML = html;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

renderCart();
