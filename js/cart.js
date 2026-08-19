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

        const itemTotal = price * qty;

        total += itemTotal;

        html += `
            <div class="product-card">

                ${
                    item.image
                    ? `
                        <img
                            src="${item.image}"
                            alt="${item.name}"
                            style="width:120px; border-radius:10px;">
                    `
                    : ""
                }

                <h3>${item.name}</h3>

                <p>
                    Գին՝ ${price.toLocaleString("hy-AM")} ֏
                </p>

                <div style="margin:15px 0;">

                    <button onclick="decreaseQty(${index})">
                        −
                    </button>

                    <span style="margin:0 15px; font-size:20px;">
                        ${qty}
                    </span>

                    <button onclick="increaseQty(${index})">
                        +
                    </button>

                </div>

                <p>
                    Ապրանքի ընդհանուր գինը՝
                    <strong>
                        ${itemTotal.toLocaleString("hy-AM")} ֏
                    </strong>
                </p>

                <button onclick="removeItem(${index})">
                    ❌ Ջնջել
                </button>

            </div>
        `;
    });

    html += `
        <div class="product-card">

            <h2 style="color:#d4af37;">
                💰 Ընդհանուր՝
                ${total.toLocaleString("hy-AM")} ֏
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


// Ավելացնել քանակը
function increaseQty(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].qty = (Number(cart[index].qty) || 1) + 1;

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


// Նվազեցնել քանակը
function decreaseQty(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].qty = (Number(cart[index].qty) || 1) - 1;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


// Ջնջել ապրանքը
function removeItem(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


document.addEventListener("DOMContentLoaded", function () {
    loadCart();
});
