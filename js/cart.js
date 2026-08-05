function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<h2>🛒 Զամբյուղը դատարկ է</h2>";
        return;
    }

    let total = 0;
    let html = "";

    cart.forEach((item, index) => {
        total += item.price * (item.qty || 1);

        html += `
        <div class="product-card">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            <p>Քանակ՝ ${item.qty || 1}</p>

            <button onclick="removeItem(${index})">
                ❌ Հեռացնել
            </button>
        </div>
        `;
    });

    html += `
        <h2 style="margin-top:30px;">
            Ընդամենը՝ $${total}
        </h2>
    `;

    container.innerHTML = html;
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}

document.addEventListener("DOMContentLoaded", loadCart);
