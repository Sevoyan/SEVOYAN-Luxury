// SEVOYAN Luxury - cart.js

function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="product-card">
                <h2>🛒 Զամբյուղը դատարկ է</h2>
                <a href="shop.html">
                    <button>🛍 Գնալ խանութ</button>
                </a>
            </div>
        `;
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, index) => {

        const price = Number(item.price);
        const qty = Number(item.qty) || 1;

        total += price * qty;

        html += `
            <div class="product-card">

                ${item.image ? `
                    <img 
                        src="${item.image}" 
                        alt="${item.name}"
                        style="width:120px; border-radius:10px;">
                ` : ""}

                <h3>${item.name}</h3>

                <p>Գին՝ ${price.toLocaleString("hy-AM")} ֏</p>

                <p>Քանակ՝ ${qty}</p>

                <p>
                    Ընդհանուր՝ ${(price * qty).toLocaleString("hy-AM")} ֏
                </p>

                <button onclick="removeItem(${index})">
                    ❌ Ջնջել
                </button>

            </div>
        `;
    });

    html += `
        <div class="product-card">

            <h2>
                💰 Ընդհանուր՝ ${total.toLocaleString("hy-AM")} ֏
            </h2>

            <a href="checkout.html">
                <button>
                    ✅ Ձևակերպել պատվերը
                </button>
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


document.addEventListener("DOMContentLoaded", function () {
    loadCart();
});
