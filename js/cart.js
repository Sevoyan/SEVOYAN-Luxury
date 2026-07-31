let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");

function renderCart() {

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <h2 style="text-align:center;margin-top:40px;">
                🛒 Ձեր զամբյուղը դատարկ է
            </h2>
        `;
        return;
    }

    let total = 0;

    cartItems.innerHTML = "";

    cart.forEach((product, index) => {

        const price = parseInt(product.price.replace(/[^\d]/g, "")) || 0;
        total += price;

        cartItems.innerHTML += `
            <div class="product" style="margin:30px auto;max-width:350px;">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>

                <button onclick="removeItem(${index})">
                    ❌ Հեռացնել
                </button>
            </div>
        `;
    });

    cartItems.innerHTML += `
        <h2 style="text-align:center;margin:40px 0;">
            Ընդհանուր՝ ${total}
        </h2>

        <div style="text-align:center;">
            <a href="checkout.html" class="btn">
                Շարունակել պատվերը
            </a>
        </div>
    `;
}

function removeItem(index){

    cart.splice(index,1);

    localStorage.setItem("cart",JSON.stringify(cart));

    renderCart();

}

renderCart();
