const SUPABASE_URL =
    "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const API_URL =
    SUPABASE_URL + "/rest/v1/products";

const AUTH_URL =
    SUPABASE_URL +
    "/auth/v1/token?grant_type=password";


let accessToken =
    localStorage.getItem("admin_access_token");



/* =========================
   LOGIN
========================= */

async function adminLogin(event) {

    event.preventDefault();

    const email =
        document.getElementById("admin-email").value.trim();

    const password =
        document.getElementById("admin-password").value;


    try {

        const response = await fetch(AUTH_URL, {

            method: "POST",

            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
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
                "Email-ը կամ գաղտնաբառը սխալ է"
            );

        }


        accessToken = data.access_token;

        localStorage.setItem(
            "admin_access_token",
            accessToken
        );


        showAdminPanel();


    } catch (error) {

        console.error(error);

        alert("❌ " + error.message);

    }

}



/* =========================
   SHOW ADMIN
========================= */

function showAdminPanel() {

    document.getElementById(
        "admin-login"
    ).style.display = "none";


    document.getElementById(
        "admin-panel"
    ).style.display = "block";


    loadAdminProducts();

}



/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "admin_access_token"
    );

    accessToken = null;


    document.getElementById(
        "admin-panel"
    ).style.display = "none";


    document.getElementById(
        "admin-login"
    ).style.display = "block";

}



/* =========================
   HEADERS
========================= */

function getHeaders() {

    return {

        "apikey": SUPABASE_KEY,

        "Authorization":
            "Bearer " + accessToken,

        "Content-Type":
            "application/json"

    };

}



/* =========================
   LOAD PRODUCTS
========================= */

async function loadAdminProducts() {

    const container =
        document.getElementById(
            "admin-products"
        );


    if (!container) return;


    try {

        const response = await fetch(

            API_URL +
            "?select=*&order=id.desc",

            {
                method: "GET",
                headers: getHeaders()
            }

        );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(errorText);

        }


        const products =
            await response.json();


        container.innerHTML = "";


        if (products.length === 0) {

            container.innerHTML =
                "<p>Ապրանքներ դեռ չկան։</p>";

            return;

        }


        products.forEach(function(product) {

            const item =
                document.createElement("div");

            item.className =
                "admin-product";


            /* Առաջին նկարը */

            let firstImage = "";

            if (product.image) {

                firstImage =
                    product.image
                        .split(/\r?\n/)
                        .map(function(url) {
                            return url.trim();
                        })
                        .filter(Boolean)[0] || "";

            }


            item.innerHTML = `

                <img
                    src="${firstImage}"
                    alt="${product.name || ""}"
                >

                <div class="admin-product-info">

                    <h3>
                        ${product.name || ""}
                    </h3>

                    <p>
                        ${product.price || 0} ֏
                    </p>

                    <small>
                        🖼️ Նկարներ՝
                        ${
                            product.image
                            ? product.image
                                .split(/\r?\n/)
                                .filter(Boolean)
                                .length
                            : 0
                        }
                    </small>

                </div>

                <button
                    class="edit-btn"
                    type="button"
                >
                    ✏️ Փոխել
                </button>

                <button
                    class="delete-btn"
                    type="button"
                >
                    🗑️ Ջնջել
                </button>

            `;


            item
                .querySelector(".edit-btn")
                .addEventListener(
                    "click",
                    function() {
                        editProduct(product);
                    }
                );


            item
                .querySelector(".delete-btn")
                .addEventListener(
                    "click",
                    function() {
                        deleteProduct(product.id);
                    }
                );


            container.appendChild(item);

        });


    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>❌ Չհաջողվեց բեռնել ապրանքները</p>";

    }

}



/* =========================
   ADD PRODUCT
========================= */

async function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById("product-name").value.trim();
    const price = Number(document.getElementById("product-price").value);
    const image = document.getElementById("product-image").value.trim();
    const collection = document.getElementById("product-collection").value;

    if (!name || !price) {
        alert("❌ Լրացրու անունը և գինը");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                ...getHeaders(),
                "Prefer": "return=representation"
            },
            body: JSON.stringify({
                name: name,
                price: price,
                image: image,
                collection: collection
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        alert("✅ Ապրանքը ավելացվեց նոր հավաքածուում");

        document.getElementById("product-form").reset();

        loadAdminProducts();

    } catch (error) {
        console.error(error);
        alert("❌ Չհաջողվեց ավելացնել ապրանքը");
    }
}


        alert(
            "✅ Ապրանքը ավելացվեց"
        );


        document
            .getElementById("product-form")
            .reset();


        loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ " + error.message
        );

    }

}



/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(id) {

    const answer =
        confirm(
            "Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը։"
        );


    if (!answer) return;


    try {

        const response = await fetch(

            API_URL +
            "?id=eq." +
            encodeURIComponent(id),

            {

                method: "DELETE",

                headers: getHeaders()

            }

        );


        if (!response.ok) {

            throw new Error(
                "Չհաջողվեց ջնջել ապրանքը"
            );

        }


        alert(
            "🗑️ Ապրանքը ջնջվեց"
        );


        loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ " + error.message
        );

    }

}



/* =========================
   EDIT PRODUCT
========================= */

async function editProduct(product) {

    const name =
        prompt(
            "Ապրանքի անունը",
            product.name || ""
        );


    if (name === null) return;


    const price =
        prompt(
            "Ապրանքի գինը ֏",
            product.price || ""
        );


    if (price === null) return;


    const image =
        prompt(
            "Նկարների հղումները՝ ամեն մեկը նոր տողով",
            product.image || ""
        );


    if (image === null) return;


    const newPrice =
        Number(price);


    if (!name.trim()) {

        alert(
            "❌ Ապրանքի անունը դատարկ է"
        );

        return;

    }


    if (isNaN(newPrice)) {

        alert(
            "❌ Գինը սխալ է"
        );

        return;

    }


    try {

        const response = await fetch(

            API_URL +
            "?id=eq." +
            encodeURIComponent(product.id),

            {

                method: "PATCH",

                headers: {

                    ...getHeaders(),

                    "Prefer":
                        "return=representation"

                },

                body: JSON.stringify({

                    name: name.trim(),

                    price: newPrice,

                    image: image.trim()

                })

            }

        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(errorText);

            throw new Error(
                "Չհաջողվեց փոխել ապրանքը"
            );

        }


        alert(
            "✅ Ապրանքը փոխվեց"
        );


        loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ " + error.message
        );

    }

}



/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const loginForm =
            document.getElementById(
                "login-form"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                adminLogin
            );

        }


        const logoutBtn =
            document.getElementById(
                "logout-btn"
            );


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                logout
            );

        }


        const productForm =
            document.getElementById(
                "product-form"
            );


        if (productForm) {

            productForm.addEventListener(
                "submit",
                addProduct
            );

        }


        if (accessToken) {

            showAdminPanel();

        }

    }
);
