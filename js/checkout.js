document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("checkout-form");

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();

       if (!fullname  !phone  !address) {
            alert("Խնդրում ենք լրացնել բոլոր դաշտերը։");
            return;
        }

        const order = {
            fullname: fullname,
            phone: phone,
            address: address,
            cart: JSON.parse(localStorage.getItem("cart")) || [],
            date: new Date().toLocaleString()
        };

        localStorage.setItem("order", JSON.stringify(order));

        alert("✅ Պատվերը հաջողությամբ ընդունվեց։");

        localStorage.removeItem("cart");

        window.location.href = "success.html";
    });

});
