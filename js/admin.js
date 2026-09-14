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


// ===============================
// LOGIN
// ===============================

async function adminLogin(event) {

    event.preventDefault();

    const email =
        document
            .getElementById("admin-email")
            .value
            .trim();

    const password =
        document
            .getElementById("admin-password")
            .value;


    try {

        const response =
            await fetch(
                AUTH_URL,
                {
                    method: "POST",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


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

    } catch (error) {

        console.error(error);

        alert(
            "❌ " + error.message
        );
    }
}


// ===============================
// SHOW PANEL
// ===============================

function showAdminPanel() {

    document.getElementById(
        "admin-login"
    ).style.display = "none";


    document.getElementById(
        "admin-panel"
    ).style.display = "block";


    loadAdminProducts();
}


// ===============================
// LOGOUT
// ===============================

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


// ===============================
// HEADERS
// ===============================

function getHeaders() {

    return {

        "apikey": SUPABASE_KEY,

        "Authorization":
            "Bearer " + accessToken,

        "Content-Type":
            "application/json"
    };
}


// ===============================
// IMAGE LIST
// ===============================

function getImages(imageValue) {

    if (!imageValue) {
        return [];
    }


    return imageValue
        .split(/\n|,/)
        .map(function(url) {
            return url.trim();
        })
        .filter(function(url) {
            return url !== "";
        });
}


// ===============================
// LOAD PRODUCTS
// ===============================

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
                    method: "GET",

                    headers:
                        getHeaders(),

                    cache: "no-store"
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


        products.forEach(
            function(product) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "admin-product";


                const images =
                    getImages(
                        product.image
                    );


                let imageHTML = "";


                if (images.length > 0) {

                    imageHTML =
                        images.map(
                            function(url) {

                                return `
                                    <img
                                        src="${url}"
                                        alt=""
                                        style="
                                            width:80px;
                                            height:80px;
                                            object-fit:cover;
                                            margin:5px;
                                            border-radius:8px;
                                        "
                                    >
                                `;
                            }
                        ).join("");

                } else {

                    imageHTML =
                        "<div>📷 Նկար չկա</div>";
                }


                item.innerHTML = `

                    <div>
                        ${imageHTML}
                    </div>

                    <div>

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            ${product.price} ֏
                        </p>

                        <p>
                            📸 Նկարներ՝
                            ${images.length}
                        </p>

                    </div>

                    <button class="edit-btn">
                        ✏️ Փոխել
                    </button>

                    <button class="delete-btn">
                        🗑️ Ջնջել
                    </button>

                `;


                item
                    .querySelector(
                        ".edit-btn"
                    )
                    .addEventListener(
                        "click",
                        function() {
                            editProduct(product);
                        }
                    );


                item
                    .querySelector(
                        ".delete-btn"
                    )
                    .addEventListener(
                        "click",
                        function() {
                            deleteProduct(
                                product.id
                            );
                        }
                    );


                container.appendChild(item);
            }
        );

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>❌ " +
            error.message +
            "</p>";
    }
}


// ===============================
// ADD PRODUCT
// ===============================

async function addProduct(event) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "product-name"
            )
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById(
                    "product-price"
                )
                .value
        );


    const image =
        document
            .getElementById(
                "product-image"
            )
            .value
            .trim();


    if (!name || !price) {

        alert(
            "❌ Լրացրու անունը և գինը"
        );

        return;
    }


    if (!accessToken) {

        alert(
            "❌ Admin մուտքը ավարտվել է։"
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

                        image: image
                    })
                }
            );


        const result =
            await response.text();


        if (!response.ok) {

            alert(
                "❌ Չհաջողվեց ավելացնել\n\n" +
                result
            );

            return;
        }


        alert(
            "✅ Ապրանքը ավելացվեց"
        );


        document
            .getElementById(
                "product-form"
            )
            .reset();


        await loadAdminProducts();

    } catch (error) {

        console.error(error);

        alert(
            "❌ Սխալ՝ " +
            error.message
        );
    }
}


// ===============================
// DELETE
// ===============================

async function deleteProduct(id) {

    if (
        !confirm(
            "Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                API_URL +
                "?id=eq." +
                id,
                {
                    method: "DELETE",

                    headers:
                        getHeaders()
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(errorText);
        }


        alert(
            "🗑️ Ապրանքը ջնջվեց"
        );


        await loadAdminProducts();

    } catch (error) {

        console.error(error);

        alert(
            "❌ " +
            error.message
        );
    }
}


// ===============================
// EDIT
// ===============================

async function editProduct(product) {

    const name =
        prompt(
            "Ապրանքի անունը",
            product.name
        );


    if (name === null) return;


    const price =
        prompt(
            "Ապրանքի գինը",
            product.price
        );


    if (price === null) return;


    const image =
        prompt(
            "Նկարների հղումները\n\n" +
            "Ամեն նկարը գրիր նոր տողում",
            product.image || ""
        );


    if (image === null) return;


    try {

        const response =
            await fetch(
                API_URL +
                "?id=eq." +
                product.id,
                {
                    method: "PATCH",

                    headers: {

                        ...getHeaders(),

                        "Prefer":
                            "return=representation"
                    },

                    body: JSON.stringify({

                        name:
                            name.trim(),

                        price:
                            Number(price),

                        image:
                            image.trim()
                    })
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(errorText);
        }


        alert(
            "✅ Ապրանքը փոխվեց"
        );


        await loadAdminProducts();

    } catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց փոխել\n\n" +
            error.message
        );
    }
}


// ===============================
// START
// ===============================

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
