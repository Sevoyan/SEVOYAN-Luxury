const SUPABASE_URL =
    "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const PRODUCTS_API =
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
        document.getElementById("admin-email").value.trim();

    const password =
        document.getElementById("admin-password").value;


    try {

        const response =
            await fetch(AUTH_URL, {

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
    ).style.display = "none";


    document.getElementById(
        "admin-panel"
    ).style.display = "block";


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
    ).style.display = "none";


    document.getElementById(
        "admin-login"
    ).style.display = "block";

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
// IMAGES
// =========================

function getImages(image) {

    if (!image) {
        return [];
    }


    if (Array.isArray(image)) {
        return image;
    }


    try {

        const parsed =
            JSON.parse(image);

        if (Array.isArray(parsed)) {
            return parsed;
        }

    }

    catch (error) {
    }


    return String(image)
        .split("\n")
        .map(function (url) {
            return url.trim();
        })
        .filter(function (url) {
            return url !== "";
        });

}


// =========================
// LOAD PRODUCTS
// =========================

async function loadAdminProducts() {

    const container =
        document.getElementById(
            "admin-products"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(
                PRODUCTS_API +
                "?select=*&order=id.desc",
                {
                    headers:
                        getHeaders()
                }
            );


        if (!response.ok) {

            throw new Error(
                await response.text()
            );

        }


        const products =
            await response.json();


        container.innerHTML = "";


        products.forEach(function (product) {

            const images =
                getImages(product.image);


            const item =
                document.createElement("div");

            item.className =
                "admin-product";


            const imageBox =
                document.createElement("div");

            imageBox.className =
                "admin-product-image";


            if (images.length > 0) {

                const img =
                    document.createElement("img");

                img.src =
                    images[0];

                img.alt =
                    product.name || "";

                imageBox.appendChild(img);

            }


            const info =
                document.createElement("div");

            info.className =
                "admin-product-info";


            const title =
                document.createElement("h3");

            title.textContent =
                product.name || "";


            const en =
                document.createElement("p");

            en.textContent =
                "🇬🇧 " +
                (product.name_en || "—");


            const ru =
                document.createElement("p");

            ru.textContent =
                "🇷🇺 " +
                (product.name_ru || "—");


            const price =
                document.createElement("p");

            price.textContent =
                Number(product.price || 0) +
                " ֏";


            const featured =
                document.createElement("small");

            featured.textContent =
                product.featured === true
                    ? "⭐ Գլխավոր էջում"
                    : "▫️ Միայն Խանութում";


            info.appendChild(title);
            info.appendChild(en);
            info.appendChild(ru);
            info.appendChild(price);
            info.appendChild(featured);


            const buttons =
                document.createElement("div");

            buttons.className =
                "admin-product-buttons";


            const edit =
                document.createElement("button");

            edit.className =
                "edit-product";

            edit.type =
                "button";

            edit.textContent =
                "✏️ Փոխել";


            edit.onclick =
                function () {
                    editProduct(product);
                };


            const del =
                document.createElement("button");

            del.className =
                "delete-product";

            del.type =
                "button";

            del.textContent =
                "🗑️ Ջնջել";


            del.onclick =
                function () {
                    deleteProduct(product.id);
                };


            buttons.appendChild(edit);
            buttons.appendChild(del);


            item.appendChild(imageBox);
            item.appendChild(info);
            item.appendChild(buttons);


            container.appendChild(item);

        });


        if (products.length === 0) {

            container.innerHTML =
                "<p>Ապրանքներ դեռ չկան։</p>";

        }

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


    const nameEn =
        document.getElementById(
            "product-name-en"
        ).value.trim();


    const nameRu =
        document.getElementById(
            "product-name-ru"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "product-price"
            ).value
        );


    const imageText =
        document.getElementById(
            "product-image"
        ).value.trim();


    const featured =
        document.getElementById(
            "product-featured"
        ).checked;


    const images =
        imageText
            .split("\n")
            .map(function (url) {
                return url.trim();
            })
            .filter(function (url) {
                return url !== "";
            });


    if (
        !name ||
        !nameEn ||
        !nameRu
    ) {

        alert(
            "❌ Լրացրու ապրանքի անունները 3 լեզվով։"
        );

        return;

    }


    if (
        !price ||
        price <= 0
    ) {

        alert(
            "❌ Գրիր ճիշտ գինը։"
        );

        return;

    }


    if (images.length === 0) {

        alert(
            "❌ Ավելացրու գոնե մեկ նկար։"
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

                        name:
                            name,

                        name_en:
                            nameEn,

                        name_ru:
                            nameRu,

                        price:
                            price,

                        image:
                            JSON.stringify(images),

                        featured:
                            featured

                    })

                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);

        }


        alert(
            "✅ Ապրանքը ավելացվեց"
        );


        document.getElementById(
            "product-form"
        ).reset();


        loadAdminProducts();

    }

    catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց ավելացնել ապրանքը\n\n" +
            error.message
        );

    }

}


// =========================
// DELETE
// =========================

async function deleteProduct(id) {

    if (
        !confirm(
            "Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը։"
        )
    ) {
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

                    headers:
                        getHeaders()

                }
            );


        if (!response.ok) {

            throw new Error(
                await response.text()
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

    const name =
        prompt(
            "🇦🇲 Հայերեն անունը",
            product.name || ""
        );


    if (name === null) {
        return;
    }


    const nameEn =
        prompt(
            "🇬🇧 English name",
            product.name_en || ""
        );


    if (nameEn === null) {
        return;
    }


    const nameRu =
        prompt(
            "🇷🇺 Русское название",
            product.name_ru || ""
        );


    if (nameRu === null) {
        return;
    }


    const price =
        prompt(
            "Գինը",
            product.price || 0
        );


    if (price === null) {
        return;
    }


    const oldImages =
        getImages(product.image);


    const imageText =
        prompt(
            "Նկարների հղումները՝ յուրաքանչյուր նկարը նոր տողում",
            oldImages.join("\n")
        );


    if (imageText === null) {
        return;
    }


    const featuredText =
        prompt(
            "Գլխավոր էջում ցուցադրել՞\nԳրիր YES կամ NO",
            product.featured === true
                ? "YES"
                : "NO"
        );


    if (featuredText === null) {
        return;
    }


    const images =
        imageText
            .split("\n")
            .map(function (url) {
                return url.trim();
            })
            .filter(function (url) {
                return url !== "";
            });


    const featured =
        featuredText
            .trim()
            .toLowerCase() === "yes";


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

                        name_en:
                            nameEn.trim(),

                        name_ru:
                            nameRu.trim(),

                        price:
                            Number(price),

                        image:
                            JSON.stringify(images),

                        featured:
                            featured

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                await response.text()
            );

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


        const logout =
            document.getElementById(
                "logout-btn"
            );


        if (logout) {

            logout.addEventListener(
                "click",
                logout
            );

        }


        const form =
            document.getElementById(
                "product-form"
            );


        if (form) {

            form.addEventListener(
                "submit",
                addProduct
            );

        }


        if (accessToken) {

            showAdminPanel();

        }

    }
);
