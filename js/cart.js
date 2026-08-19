// SEVOYAN Luxury - cart.js

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {

    const cart = getCart();
    const container = document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="cart-empty">
                <h2>🛒 Զամբյուղը դատարկ է</h2>
                <a href="shop.html" class="cart-checkout-btn">
                    🛍 Գնալ խանութ
                </a>
            </div>
        `;

        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, index) => {

        const price = Number(item.price) || 0;
        const qty = Number(item.qty) || 1;
        const itemTotal = price * qty;

        total += itemTotal;

        html += `
            <div class="cart-item">

                <div class="cart-image">
                    ${
                        item.image
                        ? <img src="${item.image}" alt="${item.name}">
                        : <div class="no-image">🛍</div>
                    }
                </div>

                <div class="cart-info">

                    <h3>${item.name}</h3>

                    <p class="cart-price">
                        Գին՝ ${price.toLocaleString("hy-AM")} ֏
                    </p>

                    <div class="quantity">

                        <button onclick="decreaseQty(${index})">
                            −
                        </button>

                        <span>${qty}</span>

                        <button onclick="increaseQty(${index})">
                            +
                        </button>

                    </div>

                    <p class="cart-item-total">
                        Ընդհանուր՝
                        <strong>
                            ${itemTotal.toLocaleString("hy-AM")} ֏
                        </strong>
                    </p>

                    <button
                        class="remove-btn"
                        onclick="removeItem(${index})">
                        ❌ Ջնջել
                    </button>

                </div>

            </div>
        `;
    });

    html += `
        <div class="cart-total">

            <h2>
                💰 Ընդհանուր՝
                ${total.toLocaleString("hy-AM")} ֏
            </h2>

            <a href="checkout.html" class="cart-checkout-btn">
                ✅ Ձևակերպել պատվերը
            </a>

        </div>
    `;

    container.innerHTML = html;
}


function increaseQty(index) {

    const cart = getCart();

    cart[index].qty = (Number(cart[index].qty) || 1) + 1;

    saveCart(cart);

    loadCart();
}


function decreaseQty(index) {

    const cart = getCart();

    cart[index].qty = (Number(cart[index].qty) || 1) - 1;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);

    loadCart();
}


function removeItem(index) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    loadCart();
}


document.addEventListener("DOMContentLoaded", loadCart);
