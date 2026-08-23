document.addEventListener("DOMContentLoaded", function () {
const user = localStorage.getItem("user");
const userArea = document.getElementById("user-area");

if (!userArea) return;

if (user) {
    userArea.innerHTML = `
        <span style="color:#D4AF37;">
            👤 ${user}
        </span>
        <button onclick="logout()" style="
            margin-left:10px;
            padding:8px 12px;
            border:none;
            border-radius:6px;
            background:#D4AF37;
            color:#111;
            cursor:pointer;
            font-weight:bold;
        ">
            🚪 Դուրս գալ
        </button>
    `;
} else {
    userArea.innerHTML = `
        <a href="login.html">👤 Մուտք</a>
    `;
}
});
function logout() { localStorage.removeItem("user"); window.location.href = "index.html"; }
