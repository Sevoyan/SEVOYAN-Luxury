const SUPABASE_URL =
    "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const PRODUCTS_API =
    SUPABASE_URL + "/rest/v1/products";

const AUTH_URL =
    SUPABASE_URL + "/auth/v1/token?grant_type=password";

let accessToken =
    localStorage.getItem("admin_access_token");


// ==================================================
// LOGIN
// ==================================================

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


// ==================================================
// SHOW ADMIN
// ==================================================

function showAdminPanel() {

    const login =
        document.getElementById("admin-login");

    const panel =
        document.getElementById("admin-panel");

    if (login) {
        login.style.display = "none";
    }

    if (panel) {
        panel.style.display = "block";
    }

    loadAdminProducts();
}


// ==================================================
// LOGOUT
// ==================================================

function logout() {

    localStorage.removeItem(
        "admin_access_token"
    );

    accessToken = null;

    const panel =
        document.getElementById("admin-panel");

    const login =
        document.getElementById("admin-login");

    if (panel) {
        panel.style.display = "none";
    }

    if (login) {
        login.style.display = "block";
    }
}


// ==================================================
// HEADERS
// ==================================================

function getHeaders() {

    return {
        "apikey": SUPABASE_KEY,

        "Authorization":
            "Bearer " + accessToken,

        "Content-Type":
            "application/json"
    };
}


// ==================================================
// IMAGE PARSER
// ==================================================

function getProductImages(imageData) {

    if (!imageData) {
        return [];
    }

    // Եթե արդեն array է
    if (Array.isArray(imageData)) {
        return imageData
            .map(url => String(url).trim())
            .filter(url => url !== "");
    }

    const text =
        String(imageData).trim();

    if (!text) {
        return [];
    }

    // Եթե JSON array է
    if (text.startsWith("[")) {

        try {

            const parsed =
                JSON.parse(text);

            if (Array.isArray(parsed)) {

                return parsed
                    .map(url => String(url).trim())
                    .filter(url => url !== "");
            }

        } catch (error) {

            console.log(
                "Image JSON parse error"
            );
        }
    }

    // Եթե յուրաքանչյուր նկար նոր տողում է
    if (text.includes("\n")) {

        return text
            .split("\n")
            .map(url => url.trim())
            .filter(url => url !== "");
    }

    // Միայն մեկ նկար
    return [text];
}


// ==================================================
// LOAD PRODUCTS
// ==================================================

async function loadAdminProducts() {

    const container =
        document.getElementById("admin-products");

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(
                PRODUCTS_API +
                "?select=*&order=id.desc",
                {
                    method: "GET",
                    headers: getHeaders(),

                    cache: "no-store"
                }
            );

        const responseText =
            await response.text();

        if (!response.ok) {

            console.error(
                "Supabase error:",
                responseText
            );

            throw new Error(
                responseText ||
                "Չհաջողվեց բեռնել ապրանքները"
            );
        }

        const products =
            JSON.parse(responseText);

        container.innerHTML = "";

        if (!products.length) {

            container.innerHTML =
                "<p>Ապրանքներ դեռ չկան։</p>";

            return;
        }


        products.forEach(function (product) {

            const item =
                document.createElement("div");

            item.className =
                "admin-product";


            const images =
                getProductImages(
                    product.image
                );

            const firstImage =
                images.length > 0
                    ? images[0]
                    : "";


            item.innerHTML = `

                <div class="admin-product-image">

                    ${
                        firstImage
                        ? `<img
                            src="${firstImage}"
                            alt="${product.name || ""}"
                          >`
                        : <div>📷 Նկար չկա</div>
                    }

                </div>

                <div class="admin-product-info">

                    <h3>
                        ${product.name || "Անանուն ապրանք"}
                    </h3>

                    <p>
                        ${product.price || 0} ֏
                    </p>

                    <small>
                        🖼️ ${images.length} նկար
                    </small>

                </div>

                <div class="admin-product-buttons">

                    <button
                        class="edit-product"
                        type="button"
                    >
                        ✏️ Փոխել
                    </button>

                    <button
                        class="delete-product"
                        type="button"
                    >
                        🗑️ Ջնջել
                    </button>

                </div>
            `;


            const editButton =
                item.querySelector(
                    ".edit-product"
                );

            const deleteButton =
                item.querySelector(
                    ".delete-product"
                );


            editButton.addEventListener(
                "click",
                function () {

                    editProduct(product);
                }
            );


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteProduct(product.id);
                }
            );


            container.appendChild(item);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p style="color:red;">
                ❌ ${error.message}
            </p>
        `;
    }
}


// ==================================================
// ADD PRODUCT
// ==================================================

async function addProduct(event) {

    event.preventDefault();


    const nameInput =
        document.getElementById(
            "product-name"
        );

    const priceInput =
        document.getElementById(
            "product-price"
        );

    const imageInput =
        document.getElementById(
            "product-image"
        );


    if (!nameInput || !priceInput || !imageInput) {

        alert(
            "❌ Ապրանքի դաշտերը չեն գտնվել։"
        );

        return;
    }


    const name =
        nameInput.value.trim();

    const price =
        Number(priceInput.value);

    const images =
        getProductImages(
            imageInput.value
        );


    if (!name) {

        alert(
            "❌ Գրիր ապրանքի անունը։"
        );

        return;
    }


    if (!price || price <= 0) {

        alert(
            "❌ Գրիր ճիշտ գին։"
        );

        return;
    }


    if (images.length === 0) {

        alert(
            "❌ Ավելացրու գոնե մեկ նկարի հղում։"
        );

        return;
    }


    try {

        const response =
            await fetch(
                PRODUCTS_API,
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

                        // Պահում ենք որպես JSON
                        // որպեսզի մի քանի նկար աշխատի
                        image:
                            JSON.stringify(images)
                    })
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            console.error(
                "ADD PRODUCT ERROR:",
                responseText
            );

            throw new Error(
                responseText ||
                "Supabase-ը չթույլատրեց ավելացնել ապրանքը"
            );
        }


        console.log(
            "Product added:",
            responseText
        );


        alert(
            "✅ Ապրանքը հաջողությամբ ավելացվեց"
        );


        const form =
            document.getElementById(
                "product-form"
            );

        if (form) {
            form.reset();
        }


        await loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց ավելացնել ապրանքը\n\n" +
            error.message
        );
    }
}


// ==================================================
// DELETE PRODUCT
// ==================================================

async function deleteProduct(id) {

    const answer =
        confirm(
            "Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը։"
        );

    if (!answer) {
        return;
    }


    try {

        const response =
            await fetch(
                PRODUCTS_API +
                "?id=eq." +
                encodeURIComponent(id),
                {
                    method: "DELETE",
                    headers: getHeaders()
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            console.error(
                "DELETE ERROR:",
                responseText
            );

            throw new Error(
                responseText ||
                "Չհաջողվեց ջնջել ապրանքը"
            );
        }


        alert(
            "🗑️ Ապրանքը ջնջվեց"
        );


        await loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց ջնջել ապրանքը\n\n" +
            error.message
        );
    }
}


// ==================================================
// EDIT PRODUCT
// ==================================================

async function editProduct(product) {

    const name =
        prompt(
            "Ապրանքի անունը",
            product.name || ""
        );


    if (name === null) {
        return;
    }


    const price =
        prompt(
            "Ապրանքի գինը",
            product.price || 0
        );


    if (price === null) {
        return;
    }


    const oldImages =
        getProductImages(
            product.image
        );


    const imageText =
        prompt(
            "Նկարների հղումները՝ յուրաքանչյուր նկարը նոր տողում",
            oldImages.join("\n")
        );


    if (imageText === null) {
        return;
    }


    const images =
        getProductImages(
            imageText
        );


    try {

        const response =
            await fetch(
                PRODUCTS_API +
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

                        name:
                            name.trim(),

                        price:
                            Number(price),

                        image:
                            JSON.stringify(images)
                    })
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            console.error(
                "EDIT ERROR:",
                responseText
            );

            throw new Error(
                responseText ||
                "Չհաջողվեց փոխել ապրանքը"
            );
        }


        alert(
            "✅ Ապրանքը փոխվեց"
        );


        await loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց փոխել ապրանքը\n\n" +
            error.message
        );
    }
}


// ==================================================
// START
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

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


        const logoutButton =
            document.getElementById(
                "logout-btn"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
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
