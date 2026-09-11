// ================================
// ԶԱՄԲՅՈՒՂԻ ՏՎՅԱԼՆԵՐ
// ================================

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}


function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ================================
// ԱՊՐԱՆՔ ԱՎԵԼԱՑՆԵԼ ԶԱՄԲՅՈՒՂ
// ================================

function addToCart(name, price, image) {

    const cart = getCart();

    const existingProduct = cart.find(
        item => item.name === name
    );


    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;

    } else {

        cart.push({
            name: name,
            price: Number(price) || 0,
            image: image || "",
            quantity: 1
        });

    }


    saveCart(cart);

    updateCartCount();

    alert("✅ Ապրանքը ավելացվեց զամբյուղ");


    // Եթե զամբյուղի էջում ենք՝ թարմացնել
    if (document.getElementById("cart-items")) {
        loadCart();
    }

}


// ================================
// ԶԱՄԲՅՈՒՂԻ ՔԱՆԱԿԸ
// ================================

function updateCartCount() {

    const cart = getCart();

    const countElement =
        document.getElementById("cart-count");

    if (!countElement) return;


    const totalQuantity = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 1),
        0
    );


    countElement.textContent = totalQuantity;

}


// ================================
// ԶԱՄԲՅՈՒՂԸ ՑՈՒՅՑ ՏԱԼ
// ================================

function loadCart() {

    const cart = getCart();

    const container =
        document.getElementById("cart-items");

    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                🛒 Զամբյուղը դատարկ է
            </div>
        `;

        updateCartCount();

        return;
    }


    let html = "";

    let total = 0;


    cart.forEach((item, index) => {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;


        total += price * quantity;


        html += `
            <div class="cart-item">

                ${
                    item.image
                    ? `<img
                        src="${item.image}"
                        alt="${item.name}"
                        class="cart-item-image"
                    >`
                    : ""
                }

                <div class="cart-item-info">

                    <h3>${item.name}</h3>

                    <p>
                        Գին՝
                        ${price.toLocaleString()} ֏
                    </p>


                    <div style="margin-top:15px;">

                        <button
                            onclick="decreaseQuantity(${index})">
                            −
                        </button>


                        <span style="margin:0 15px;">
                            ${quantity}
                        </span>


                        <button
                            onclick="increaseQuantity(${index})">
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

            Ընդհանուր՝
            ${total.toLocaleString()} ֏

        </div>


        <a
            href="checkout.html"
            class="checkout-btn">

            ✅ Պատվիրել

        </a>

    `;


    container.innerHTML = html;

    updateCartCount();

}


// ================================
// ԱՎԵԼԱՑՆԵԼ ՔԱՆԱԿԸ
// ================================

function increaseQuantity(index) {

    const cart = getCart();


    if (!cart[index]) return;


    cart[index].quantity =
        Number(cart[index].quantity || 1) + 1;


    saveCart(cart);

    loadCart();

    updateCartCount();

}


// ================================
// ՊԱԿԱՍԵՑՆԵԼ ՔԱՆԱԿԸ
// ================================

function decreaseQuantity(index) {

    const cart = getCart();


    if (!cart[index]) return;


    const quantity =
        Number(cart[index].quantity || 1);


    if (quantity > 1) {

        cart[index].quantity = quantity - 1;

    } else {

        cart.splice(index, 1);

    }


    saveCart(cart);

    loadCart();

    updateCartCount();

}


// ================================
// ՋՆՋԵԼ ԱՊՐԱՆՔԸ
// ================================

function removeItem(index) {

    const cart = getCart();


    cart.splice(index, 1);


    saveCart(cart);

    loadCart();

    updateCartCount();

}


// ================================
// ԷՋԸ ԲԱՑԵԼԻՍ
// ================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        loadCart();

    }
);
