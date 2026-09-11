document.addEventListener("DOMContentLoaded", function () {

    const orderInfo = document.getElementById("order-info");

    if (!orderInfo) return;

    const savedOrder = localStorage.getItem("order");

    if (!savedOrder) {
        orderInfo.innerHTML = `
            <p>❌ Պատվերի տվյալները չեն գտնվել։</p>
        `;
        return;
    }

    try {

        const order = JSON.parse(savedOrder);

        const fullname = order.fullname || "";
        const phone = order.phone || "";
        const address = order.address || "";
        const cart = Array.isArray(order.cart) ? order.cart : [];

        if (cart.length === 0) {
            orderInfo.innerHTML = `
                <p>❌ Պատվերի ապրանքները չեն գտնվել։</p>
            `;
            return;
        }

        let total = 0;

        let productsHTML = "";

        cart.forEach(function (item) {

            // Աջակցում է և՛ quantity-ին, և՛ qty-ին
            const quantity = Number(
                item.quantity || item.qty || 1
            );

            const price = Number(item.price) || 0;

            const itemTotal = price * quantity;

            total += itemTotal;

            productsHTML += `
                <div class="order-product">

                    <h3>
                        ${item.name || "Ապրանք"}
                    </h3>

                    <p>
                        Քանակ՝ ${quantity}
                    </p>

                    <p>
                        Գին՝ ${price.toLocaleString()} ֏
                    </p>

                    <p>
                        Ապրանքի ընդհանուր՝
                        ${itemTotal.toLocaleString()} ֏
                    </p>

                </div>
            `;
        });


        orderInfo.innerHTML = `

            <div class="order-customer">

                <p>
                    👤 Անուն՝
                    <strong>${fullname}</strong>
                </p>

                <p>
                    📞 Հեռախոս՝
                    <strong>${phone}</strong>
                </p>

                <p>
                    📍 Հասցե՝
                    <strong>${address}</strong>
                </p>

            </div>


            <h3>
                🛍 Պատվերի ապրանքները
            </h3>


            ${productsHTML}


            <div class="order-total">

                <h2>
                    💰 Ընդհանուր՝
                    ${total.toLocaleString()} ֏
                </h2>

            </div>

        `;

    } catch (error) {

        console.error(
            "Success page error:",
            error
        );

        orderInfo.innerHTML = `
            <p>
                ❌ Պատվերի տվյալները կարդալ չհաջողվեց։
            </p>
        `;
    }

});
