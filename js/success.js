document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("order-info");

    const order = JSON.parse(localStorage.getItem("order"));

    if (!order) {
        container.innerHTML = `
            <p>Պատվերի տվյալները չեն գտնվել։</p>
        `;
        return;
    }

    let total = 0;
    let productsHTML = "";

    order.cart.forEach(item => {

        const qty = item.qty || 1;
        const price = Number(item.price) * qty;

        total += price;

        productsHTML += `
            <div style="
                padding: 12px;
                margin: 10px 0;
                border: 1px solid #d4af37;
                border-radius: 10px;
            ">
                <strong>${item.name}</strong>
                <br>
                Քանակ՝ ${qty}
                <br>
                Գին՝ ${price.toLocaleString()} ֏
            </div>
        `;
    });

    container.innerHTML = `

        <h3>📋 Պատվերի տվյալները</h3>

        <p>
            👤 <strong>Անուն՝</strong>
            ${order.fullname}
        </p>

        <p>
            📞 <strong>Հեռախոս՝</strong>
            ${order.phone}
        </p>

        <p>
            📍 <strong>Հասցե՝</strong>
            ${order.address}
        </p>

        <hr>

        <h3>🛍 Ապրանքներ</h3>

        ${productsHTML}

        <h2 style="color:#d4af37;">
            💰 Ընդհանուր՝ ${total.toLocaleString()} ֏
        </h2>
    `;
});
