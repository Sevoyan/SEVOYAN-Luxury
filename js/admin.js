const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const API_URL =
    SUPABASE_URL + "/rest/v1/products";

const AUTH_URL =
    SUPABASE_URL +
    "/auth/v1/token?grant_type=password";


let accessToken =
    localStorage.getItem("admin_access_token");


// =========================
// LOGIN
// =========================

async function adminLogin(event) {

    event.preventDefault();

    const email =
        document.getElementById("admin-email")
        .value
        .trim();

    const password =
        document.getElementById("admin-password")
        .value;

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


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error_description ||
                data.msg ||
                "Email-ը կամ գաղտնաբառը սխալ է"
            );

        }


        accessToken =
            data.access_token;


        localStorage.setItem(
            "admin_access_token",
            accessToken
        );


        showAdminPanel();

    }

    catch (error) {

        console.error(error);

        alert(
            "❌ " + error.message
        );

    }

}


// =========================
// SHOW ADMIN
// =========================

function showAdminPanel() {

    document.getElementById(
        "admin-login"
    ).classList.add("hidden");


    document.getElementById(
        "admin-panel"
    ).classList.remove("hidden");


    loadAdminProducts();

}


// =========================
// LOGOUT
// =========================

function logout() {

    localStorage.removeItem(
        "admin_access_token"
    );

    accessToken = null;


    document.getElementById(
        "admin-panel"
    ).classList.add("hidden");


    document.getElementById(
        "admin-login"
    ).classList.remove("hidden");

}


// =========================
// HEADERS
// =========================

function getHeaders() {

    return {

        "apikey": SUPABASE_KEY,

        "Authorization":
            "Bearer " + accessToken,

        "Content-Type":
            "application/json"

    };

}


// =========================
// LOAD PRODUCTS
// =========================

async function loadAdminProducts() {

    const container =
        document.getElementById(
            "admin-products"
        );


    if (!container) return;


    try {

        const response =
            await fetch(
                API_URL +
                "?select=*&order=id.desc",
                {
                    headers:
                        getHeaders()
                }
            );


        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(text);

        }


        const products =
            await response.json();


        container.innerHTML = "";


        if (products.length === 0) {

            container.innerHTML =
                "<p>Ապրանքներ դեռ չկան։</p>";

            return;

        }


        products.forEach(
            function(product) {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "admin-product";


                // Նկարների ցուցակ

                const images =
                    (product.image || "")
                    .split(/\r?\n/)
                    .map(
                        function(url) {
                            return url.trim();
                        }
                    )
                    .filter(Boolean);


                const firstImage =
                    images[0] || "";


                item.innerHTML = `

                    <img
                        src="${firstImage}"
                        alt="${product.name}"
                    >

                    <div class="admin-product-info">

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            💰 ${product.price} ֏
                        </p>

                        <p>
                            🖼️ ${images.length} նկար
                        </p>

                    </div>

                    <div class="admin-product-buttons">

                        <button
                            class="admin-btn edit-btn"
                        >
                            ✏️ Փոխել
                        </button>

                        <button
                            class="admin-btn delete-btn"
                        >
                            🗑️ Ջնջել
                        </button>

                    </div>

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

            }
        );

    }

    catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>❌ Չհաջողվեց բեռնել ապրանքները</p>";

    }

}


// =========================
// ADD PRODUCT
// =========================

async function addProduct(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "product-name"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "product-price"
            ).value
        );


    const imageText =
        document.getElementById(
            "product-images"
        ).value.trim();


    if (!name) {

        alert(
            "❌ Գրիր ապրանքի անունը"
        );

        return;

    }


    if (!price || price <= 0) {

        alert(
            "❌ Գրիր ճիշտ գին"
        );

        return;

    }


    if (!imageText) {

        alert(
            "❌ Ավելացրու գոնե 1 նկար"
        );

        return;

    }


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {

                        ...getHeaders(),

                        "Prefer":
                            "return=representation"

                    },

                    body: JSON.stringify({

                        name: name,

                        price: price,

                        image: imageText

                    })

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText
            );

        }


        alert(
            "✅ Ապրանքը ավելացվեց"
        );


        document
            .getElementById(
                "product-form"
            )
            .reset();


        loadAdminProducts();

    }

    catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց ավելացնել ապրանքը"
        );

    }

}


// =========================
// DELETE
// =========================

async function deleteProduct(id) {

    const answer =
        confirm(
            "Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը։"
        );


    if (!answer) return;


    try {

        const response =
            await fetch(
                API_URL +
                "?id=eq." +
                encodeURIComponent(id),

                {

                    method: "DELETE",

                    headers:
                        getHeaders()

                }
            );


        if (!response.ok) {

            throw new Error(
                "Չհաջողվեց ջնջել"
            );

        }


        alert(
            "🗑️ Ապրանքը ջնջվեց"
        );


        loadAdminProducts();

    }

    catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց ջնջել ապրանքը"
        );

    }

}


// =========================
// EDIT
// =========================

async function editProduct(product) {

    const newName =
        prompt(
            "Ապրանքի անունը",
            product.name
        );


    if (newName === null) return;


    const newPrice =
        prompt(
            "Ապրանքի գինը",
            product.price
        );


    if (newPrice === null) return;


    const newImages =
        prompt(
            "Նկարների հղումները՝ ամեն մեկը նոր տողում",
            product.image || ""
        );


    if (newImages === null) return;


    const price =
        Number(newPrice);


    if (!price || price <= 0) {

        alert(
            "❌ Գինը սխալ է"
        );

        return;

    }


    try {

        const response =
            await fetch(

                API_URL +
                "?id=eq." +
                encodeURIComponent(
                    product.id
                ),

                {

                    method: "PATCH",

                    headers: {

                        ...getHeaders(),

                        "Prefer":
                            "return=representation"

                    },

                    body: JSON.stringify({

                        name:
                            newName.trim(),

                        price:
                            price,

                        image:
                            newImages.trim()

                    })

                }

            );


        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(text);

        }


        alert(
            "✅ Ապրանքը փոխվեց"
        );


        loadAdminProducts();

    }

    catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց փոխել ապրանքը"
        );

    }

}


// =========================
// START
// =========================

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
