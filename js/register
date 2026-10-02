const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";
const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const REGISTER_URL =
    SUPABASE_URL + "/auth/v1/signup";


document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("register-form");

    const message =
        document.getElementById("register-message");


    if (!form) return;


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("register-name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("register-email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("register-password")
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "register-password-confirm"
                    )
                    .value;


            if (!name || !email || !password) {

                message.textContent =
                    "❌ Լրացրեք բոլոր դաշտերը";

                return;
            }


            if (password.length < 6) {

                message.textContent =
                    "❌ Գաղտնաբառը պետք է լինի առնվազն 6 նիշ";

                return;
            }


            if (password !== confirmPassword) {

                message.textContent =
                    "❌ Գաղտնաբառերը չեն համընկնում";

                return;
            }


            message.textContent =
                "⏳ Գրանցվում եք...";


            try {

                const response =
                    await fetch(
                        REGISTER_URL,
                        {
                            method: "POST",

                            headers: {
                                "apikey":
                                    SUPABASE_KEY,

                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email: email,
                                    password: password,

                                    data: {
                                        name: name
                                    }
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error_description ||
                        data.msg ||
                        data.message ||
                        "Գրանցումը չհաջողվեց"
                    );
                }


                /*
                 Եթե email confirmation-ը
                 անջատված է, session կլինի։
                */

                if (data.session) {

                    localStorage.setItem(
                        "access_token",
                        data.session.access_token
                    );


                    localStorage.setItem(
                        "refresh_token",
                        data.session.refresh_token || ""
                    );


                    localStorage.setItem(
                        "auth_expires_at",
                        String(
                            Date.now() +
                            (
                                (data.session.expires_in || 3600)
                                * 1000
                            )
                        )
                    );


                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            id:
                                data.user?.id || "",

                            email:
                                data.user?.email || email,

                            name: name
                        })
                    );


                    message.textContent =
                        "✅ Գրանցումը հաջողվեց։";


                    setTimeout(function () {

                        window.location.href =
                            "index.html";

                    }, 800);

                } else {

                    /*
                     Email confirmation-ը միացված է։
                    */

                    message.textContent =
                        "✅ Գրանցումը հաջողվեց։ Ստուգեք ձեր email-ը և հաստատեք հաշիվը։";

                }


            } catch (error) {

                console.error(
                    "REGISTER ERROR:",
                    error
                );


                message.textContent =
                    "❌ " + error.message;
            }

        }
    );

});
