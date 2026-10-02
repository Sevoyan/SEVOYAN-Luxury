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


        const emailElement =
            document.getElementById("login-email");

        const passwordElement =
            document.getElementById("login-password");


        if (!emailElement || !passwordElement) {
            message.textContent =
                "❌ Մուտքի դաշտերը չեն գտնվել։";
            return;
        }


        const email =
            emailElement.value.trim();

        const password =
            passwordElement.value;


        if (!email || !password) {

            message.textContent =
                "❌ Լրացրեք email-ը և գաղտնաբառը։";

            return;
        }


        message.textContent =
            "⏳ Մուտք է կատարվում...";


        try {

            const response =
                await fetch(LOGIN_URL, {

                    method: "POST",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Content-Type":
                            "application/json",
                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })

                });


            const data =
                await response.json();


            if (!response.ok) {

                let errorMessage =
                    "Email-ը կամ գաղտնաբառը սխալ է։";


                if (data.error_description) {
                    errorMessage =
                        data.error_description;
                }
                else if (data.msg) {
                    errorMessage =
                        data.msg;
                }
                else if (data.message) {
                    errorMessage =
                        data.message;
                }


                throw new Error(errorMessage);
            }


            // Պահպանում ենք օգտատիրոջ տվյալները

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.user?.id || "",
                    email:
                        data.user?.email || email
                })
            );


            // Supabase session

            localStorage.setItem(
                "access_token",
                data.access_token
            );


            if (data.refresh_token) {

                localStorage.setItem(
                    "refresh_token",
                    data.refresh_token
                );

            }


            message.textContent =
                "✅ Մուտքը հաջողությամբ կատարվեց։";


            setTimeout(function () {

                window.location.href =
                    "index.html";

            }, 700);


        }
        catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            message.textContent =
                "❌ " + error.message;

        }

    });

});
