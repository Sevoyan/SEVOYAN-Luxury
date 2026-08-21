document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("login-form");
    const message = document.getElementById("login-message");

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (username === "" || password === "") {
            message.textContent = "❌ Լրացրեք բոլոր դաշտերը";
            return;
        }

        localStorage.setItem("user", username);

        message.textContent = "✅ Մուտքը հաջողությամբ կատարվեց";

        setTimeout(function () {
            window.location.href = "index.html";
        }, 800);
    });

});
