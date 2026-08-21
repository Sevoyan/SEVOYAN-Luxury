document.addEventListener("DOMContentLoaded", function () {

    const user = localStorage.getItem("user");
    const userArea = document.getElementById("user-area");

    if (!userArea) return;

    if (user) {

        userArea.innerHTML = `
            <span>👤 ${user}</span>

            <button onclick="logout()">
                🚪 Դուրս գալ
            </button>
        `;

    } else {

        userArea.innerHTML = `
            <a href="login.html">
                👤 Մուտք
            </a>
        `;
    }
});


function logout() {

    localStorage.removeItem("user");

    alert("✅ Դուք դուրս եկաք հաշվից");

    window.location.href = "index.html";
}
