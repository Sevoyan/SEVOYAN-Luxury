const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const PRODUCTS_API = SUPABASE_URL + "/rest/v1/products";

const AUTH_URL = SUPABASE_URL + "/auth/v1/token?grant_type=password";

let accessToken = localStorage.getItem("admin_access_token");


// ===============================
// LOGIN
// ===============================

async function adminLogin(event) {
    event.preventDefault();

    const emailElement = document.getElementById("admin-email");
    const passwordElement = document.getElementById("admin-password");

    if (!emailElement || !passwordElement) {
        alert("❌ Login դաշտերը չեն գտնվել");
        return;
    }

    const email = emailElement.value.trim();
    const password = passwordElement.value;

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
                data.message ||
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
        console.error("LOGIN ERROR:", error);

        alert(
            "❌ Մուտքը չստացվեց\n\n" +
            error.message
        );
    }
}


// ===============================
// SHOW ADMIN PANEL
// ===============================

function showAdminPanel() {

    const login = document.getElementById("admin-login");
    const panel = document.getElementById("admin-panel");

    if (login) {
        login.style.display = "none";
    }

    if (panel) {
        panel.style.display = "block";
    }

    loadAdminProducts();
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("admin_access_token");

    accessToken = null;

    const login = document.getElementById("admin-login");
    const panel = document.getElementById("admin-panel");

    if (panel) {
        panel.style.display = "none";
    }

    if (login) {
        login.style.display = "block";
    }
}


// ===============================
// HEADERS
// ===============================

function getHeaders() {

    return {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
    };
}


// ===============================
// IMAGE PARSER
// ===============================

function getProductImages(imageData) {

    if (!imageData) {
        return [];
    }

    if (Array.isArray(imageData)) {

        return imageData
            .map(function(url) {
                return String(url).trim();
            })
            .filter(function(url) {
                return url !== "";
            });
    }

    const text = String(imageData).trim();

    if (!text) {
        return [];
    }


    // JSON ARRAY

    if (text.startsWith("[")) {

        try {

            const parsed = JSON.parse(text);

            if (Array.isArray(parsed)) {

                return parsed
                    .map(function(url) {
                        return String(url).trim();
                    })
                    .filter(function(url) {
                        return url !== "";
                    });
            }

        } catch (error) {

            console.log(
                "Image JSON parse error:",
                error
            );
        }
    }


    // MULTIPLE LINES

    if (text.includes("\n")) {

        return text
            .split("\n")
            .map(function(url) {
                return url.trim();
            })
            .filter(function(url) {
                return url !== "";
            });
    }


    // SINGLE IMAGE

    return [text];
}


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadAdminProducts() {

    const container =
        document.getElementById("admin-products");

    if (!container) {
        return;
    }

    if (!accessToken) {
        container.innerHTML =
            "<p>🔐 Մուտք գործիր Admin</p>";
        return;
    }

    try {

        const response = await fetch(
            PRODUCTS_API +
            "?select=*&order=id.desc",
            {
                method: "GET",
                headers: getHeaders(),
                cache: "no-store"
            }
        );

        const text = await response.text();

        if (!response.ok) {

            console.error(
                "SUPABASE LOAD ERROR:",
                text
            );

            throw new Error(
                text ||
                "Չհաջողվեց բեռնել ապրանքները"
            );
        }

        const products = JSON.parse(text);

        container.innerHTML = "";

        if (!products.length) {

            container.innerHTML =
                "<p>📦 Ապրանքներ դեռ չկան։</p>";

            return;
        }


        products.forEach(function(product) {

            const item =
                document.createElement("div");

            item.className =
                "admin-product";


            const images =
                getProductImages(product.image);


            const firstImage =
                images.length > 0
                    ? images[0]
                    : "";


            // IMAGE

            const imageBox =
                document.createElement("div");

            imageBox.className =
                "admin-product-image";


            if (firstImage) {

                const img =
                    document.createElement("img");

                img.src = firstImage;
                img.alt = product.name || "";

                imageBox.appendChild(img);

            } else {

                imageBox.textContent =
                    "📷 Նկար չկա";
            }


            // INFO

            const info =
                document.createElement("div");

            info.className =
                "admin-product-info";


            const title =
                document.createElement("h3");

            title.textContent =
                product.name || "Անանուն ապրանք";


            const price =
                document.createElement("p");

            price.textContent =
                (product.price || 0) + " ֏";


            const imageCount =
                document.createElement("small");

            imageCount.textContent =
                "🖼️ " + images.length + " նկար";


            info.appendChild(title);
            info.appendChild(price);
            info.appendChild(imageCount);


            // BUTTONS

            const buttons =
                document.createElement("div");

            buttons.className =
                "admin-product-buttons";


            const editButton =
                document.createElement("button");

            editButton.type = "button";
            editButton.className = "edit-product";
            editButton.textContent = "✏️ Փոխել";


            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-product";
            deleteButton.textContent = "🗑️ Ջնջել";


            editButton.addEventListener(
                "click",
                function() {
                    editProduct(product);
                }
            );


            deleteButton.addEventListener(
                "click",
                function() {
                    deleteProduct(product.id);
                }
            );


            buttons.appendChild(editButton);
            buttons.appendChild(deleteButton);


            item.appendChild(imageBox);
            item.appendChild(info);
            item.appendChild(buttons);


            container.appendChild(item);

        });


    } catch (error) {

        console.error(
            "LOAD PRODUCTS ERROR:",
            error
        );

        container.innerHTML =
            "<p style='color:red;'>❌ " +
            error.message +
            "</p>";
    }
}


// ===============================
// ADD PRODUCT
// ===============================

async function addProduct(event) {

    event.preventDefault();


    const nameInput =
        document.getElementById("product-name");

    const priceInput =
        document.getElementById("product-price");

    const imageInput =
        document.getElementById("product-image");


    if (!nameInput || !priceInput || !imageInput) {

        alert(
            "❌ Ապրանքի դաշտերը չեն գտնվել"
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
            "❌ Գրիր ճիշտ գինը։"
        );

        return;
    }


    if (images.length === 0) {

        alert(
            "❌ Գրիր գոնե մեկ նկարի հղում։"
        );

        return;
    }


    try {

        const response = await fetch(
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
                    image: JSON.stringify(images)
                })
            }
        );


        const text =
            await response.text();


        if (!response.ok) {

            console.error(
                "ADD PRODUCT ERROR:",
                text
            );

            throw new Error(
                text ||
                "Ապրանքը չավելացավ"
            );
        }


        alert(
            "✅ Ապրանքը ավելացվեց"
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

        console.error(
            "ADD ERROR:",
            error
        );

        alert(
            "❌ Չհաջողվեց ավելացնել ապրանքը\n\n" +
            error.message
        );
    }
}


// ===============================
// DELETE PRODUCT
// ===============================

async function deleteProduct(id) {

    const answer =
        confirm(
            "Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը։"
        );


    if (!answer) {
        return;
    }


    try {

        const response = await fetch(
            PRODUCTS_API +
            "?id=eq." +
            encodeURIComponent(id),
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );


        const text =
            await response.text();


        if (!response.ok) {

            console.error(
                "DELETE ERROR:",
                text
            );

            throw new Error(
                text ||
                "Delete error"
            );
        }


        alert(
            "🗑️ Ապրանքը ջնջվեց"
        );


        await loadAdminProducts();


    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );

        alert(
            "❌ Չհաջողվեց ջնջել ապրանքը\n\n" +
            error.message
        );
    }
}


// ===============================
// EDIT PRODUCT
// ===============================

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


    const numericPrice =
        Number(price);


    if (!name.trim()) {

        alert(
            "❌ Անունը դատարկ է"
        );

        return;
    }


    if (!numericPrice || numericPrice <= 0) {

        alert(
            "❌ Գինը սխալ է"
        );

        return;
    }


    try {

        const response = await fetch(
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
                    name: name.trim(),
                    price: numericPrice,
                    image: JSON.stringify(images)
                })
            }
        );


        const text =
            await response.text();


        if (!response.ok) {

            console.error(
                "EDIT ERROR:",
                text
            );

            throw new Error(
                text ||
                "Edit error"
            );
        }


        alert(
            "✅ Ապրանքը փոխվեց"
        );


        await loadAdminProducts();


    } catch (error) {

        console.error(
            "EDIT ERROR:",
            error
        );

        alert(
            "❌ Չհաջողվեց փոխել ապրանքը\n\n" +
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
