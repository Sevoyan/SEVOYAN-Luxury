const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";
const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const LOGIN_URL =
    SUPABASE_URL + "/auth/v1/token?grant_type=password";

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("login-form");
    const message = document.getElementById("login-message");

    if (!form) return;

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document
            .getElementById("login-email")
            .value
            .trim();

        const password = document
            .getElementById("login-password")
            .value;

        if (!email || !password) {
            message.textContent = "❌ Լրացրեք բոլոր դաշտերը";
            return;
        }

        message.textContent = "⏳ Մուտք է կատարվում...";

        try {

            const response = await fetch(LOGIN_URL, {
                method: "POST",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error_description ||
                    data.msg ||
                    data.message ||
                    "Invalid login credentials"
                );
            }

            localStorage.setItem(
                "access_token",
                data.access_token
            );

            localStorage.setItem(
                "refresh_token",
                data.refresh_token || ""
            );

            localStorage.setItem(
                "auth_expires_at",
                String(
                    Date.now() +
                    ((data.expires_in || 3600) * 1000)
                )
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.user?.id || "",
                    email: data.user?.email || email,
                    name:
                        data.user?.user_metadata?.name ||
                        ""
                })
            );

            message.textContent =
                "✅ Մուտքը հաջողությամբ կատարվեց";

            setTimeout(function () {
                window.location.href = "index.html";
            }, 700);

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            message.textContent =
                "❌ " + error.message;
        }

    });

});
