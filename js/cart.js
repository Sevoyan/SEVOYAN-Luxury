function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<h2>Զամբյուղը դատարկ է</h2>";
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += Number(item.price);

        html += `
        <div class="product-card">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            <button onclick="removeItem(${index})">
                ❌ Ջնջել
            </button>
        </div>`;
    });

    html += `
        <h2 style="margin-top:30px">
            Ընդհանուր՝ $${total}
        </h2>`;

    container.innerHTML = html;
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

document.addEventListener("DOMContentLoaded", loadCart);
