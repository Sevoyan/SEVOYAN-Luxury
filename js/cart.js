function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                🛒 Զամբյուղը դատարկ է
            </div>
        `;
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, index) => {

        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;

        total += price * quantity;

        html += `
            <div class="cart-item">

                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Գին՝ ${price.toLocaleString()} ֏</p>

                    <div style="margin-top:15px;">
                        <button onclick="decreaseQuantity(${index})">
                            −
                        </button>

                        <span style="margin:0 15px;">
                            ${quantity}
                        </span>

                        <button onclick="increaseQuantity(${index})">
                            +
                        </button>
                    </div>
                </div>

                <button
                    class="remove-btn"
                    onclick="removeItem(${index})">
                    🗑️ Ջնջել
                </button>

            </div>
        `;
    });

    html += `
        <div class="cart-total">
            Ընդհանուր՝ ${total.toLocaleString()} ֏
        </div>

        <a href="checkout.html" class="checkout-btn">
            ✅ Պատվիրել
        </a>
    `;

    container.innerHTML = html;
}


function increaseQuantity(index) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart[index].quantity) {
        cart[index].quantity = 1;
    }

    cart[index].quantity++;

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


function decreaseQuantity(index) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart[index].quantity) {
        cart[index].quantity = 1;
    }

    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


function removeItem(index) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


document.addEventListener("DOMContentLoaded", loadCart);
