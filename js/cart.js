function loadCart() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <h2>🛒 Զամբյուղը դատարկ է</h2>
                <a href="shop.html">Գնալ խանութ</a>
            </div>
        `;

        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, index) => {

        const qty = item.qty || 1;
        const price = Number(item.price) || 0;
        const itemTotal = price * qty;

        total += itemTotal;

        html += `
            <div class="product-card">

                ${item.image ? `
                    <img src="${item.image}" alt="${item.name}">
                ` : ""}

                <h3>${item.name}</h3>

                <p>${price.toLocaleString()} ֏</p>

                <p>Քանակ՝ ${qty}</p>

                <p>
                    Ընդհանուր՝ ${itemTotal.toLocaleString()} ֏
                </p>

                <button onclick="removeItem(${index})">
                    ❌ Ջնջել
                </button>

            </div>
        `;
    });

    html += `
        <div class="cart-total">

            <h2>
                Ընդհանուր՝ ${total.toLocaleString()} ֏
            </h2>

            <a href="checkout.html">
                Գնալ վճարման
            </a>

        </div>
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
