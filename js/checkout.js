// SEVOYAN Luxury - checkout.js

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("checkout-form");

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const fullname =
            document.getElementById("fullname").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const address =
            document.getElementById("address").value.trim();

        if (!fullname  !phone  !address) {

            alert("⚠️ Խնդրում ենք լրացնել բոլոր դաշտերը");

            return;
        }

        const cart =
            JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {

            alert("🛒 Ձեր զամբյուղը դատարկ է");

            return;
        }

        const order = {

            fullname: fullname,

            phone: phone,

            address: address,

            products: cart,

            date: new Date().toLocaleString("hy-AM")

        };

        localStorage.setItem(
            "lastOrder",
            JSON.stringify(order)
        );

        // Մաքրում ենք զամբյուղը
        localStorage.removeItem("cart");

        // Ուղարկում ենք հաջողության էջ
        window.location.href = "success.html";

    });

});
