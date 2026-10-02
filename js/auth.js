const AUTH_SUPABASE_URL =
    "https://ultbqgkrckapevjllqwe.supabase.co";

const AUTH_SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";


function getLoggedUser() {

    try {

        return JSON.parse(
            localStorage.getItem("user")
        );

    } catch (error) {

        return null;
    }
}


function logoutUser() {

    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth_expires_at");

    window.location.href = "index.html";
}


async function refreshAuthToken() {

    const refreshToken =
        localStorage.getItem("refresh_token");

    if (!refreshToken) return false;


    try {

        const response =
            await fetch(
                AUTH_SUPABASE_URL +
                "/auth/v1/token?grant_type=refresh_token",
                {
                    method: "POST",

                    headers: {
                        "apikey":
                            AUTH_SUPABASE_KEY,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            refresh_token:
                                refreshToken
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            return false;
        }


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


        localStorage.setItem(
            "auth_expires_at",
            String(
                Date.now() +
                ((data.expires_in || 3600) * 1000)
            )
        );


        if (data.user) {

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id:
                        data.user.id || "",

                    email:
                        data.user.email || "",

                    name:
                        data.user.user_metadata?.name || ""
                })
            );
        }


        return true;


    } catch (error) {

        console.error(
            "TOKEN REFRESH ERROR:",
            error
        );

        return false;
    }
}


async function checkAuth() {

    const token =
        localStorage.getItem("access_token");

    const user =
        getLoggedUser();


    if (!token || !user) {

        updateLoginLink(null);

        return;
    }


    const expiresAt =
        Number(
            localStorage.getItem(
                "auth_expires_at"
            )
        );


    /*
     Token-ը եթե շուտով ավարտվում է,
     refresh ենք անում։
    */

    if (
        !expiresAt ||
        Date.now() > expiresAt - 60000
    ) {

        const refreshed =
            await refreshAuthToken();


        if (!refreshed) {

            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("auth_expires_at");

            updateLoginLink(null);

            return;
        }
    }


    updateLoginLink(
        getLoggedUser()
    );
}


function updateLoginLink(user) {

    const links =
        document.querySelectorAll(
            'a[data-i18n="login"], a[href="login.html"]'
        );


    links.forEach(function (link) {

        if (!user) {

            link.href = "login.html";

            if (
                link.getAttribute("data-i18n") ===
                "login"
            ) {

                /*
                 language.js-ը կթարգմանի
                */

            } else {

                link.textContent =
                    "👤 Մուտք";
            }


            return;
        }


        link.removeAttribute("data-i18n");

        link.href = "#";

        link.textContent =
            "👤 " +
            (
                user.name ||
                user.email ||
                "Account"
            );


        link.onclick =
            function (event) {

                event.preventDefault();

                showAccountMenu(link, user);
            };

    });
}


function showAccountMenu(link, user) {

    const oldMenu =
        document.getElementById(
            "sevoyan-account-menu"
        );


    if (oldMenu) {

        oldMenu.remove();

        return;
    }


    const menu =
        document.createElement("div");


    menu.id =
        "sevoyan-account-menu";


    menu.style.position =
        "absolute";

    menu.style.top =
        "55px";

    menu.style.right =
        "20px";

    menu.style.background =
        "#111";

    menu.style.border =
        "1px solid #D4AF37";

    menu.style.borderRadius =
        "10px";

    menu.style.padding =
        "15px";

    menu.style.zIndex =
        "9999";

    menu.style.minWidth =
        "220px";


    menu.innerHTML = `

        <div style="
            color:#D4AF37;
            margin-bottom:10px;
            word-break:break-word;
        ">
            ${user.email || ""}
        </div>

        <button
            id="sevoyan-logout"
            style="
                width:100%;
                padding:10px;
                border:1px solid #D4AF37;
                background:#D4AF37;
                color:#111;
                cursor:pointer;
                border-radius:6px;
            "
        >
            Դուրս գալ
        </button>
    `;


    document.body.appendChild(menu);


    document
        .getElementById("sevoyan-logout")
        .addEventListener(
            "click",
            logoutUser
        );
}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkAuth();

    }
);
