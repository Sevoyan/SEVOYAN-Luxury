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
// IMAGE PARSER
// =========================

function getProductImages(product) {

    if (!product.image) {
        return [];
    }


    if (Array.isArray(product.image)) {
        return product.image;
    }


    try {

        const parsed =
            JSON.parse(product.image);

        if (Array.isArray(parsed)) {
            return parsed;
        }

    }

    catch (error) {
    }


    return String(product.image)
        .split("\n")
        .map(function (item) {
            return item.trim();
        })
        .filter(function (item) {
            return item !== "";
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


        products.forEach(function (product) {

            const images =
                getProductImages(product);


            const item =
                document.createElement("div");

            item.className =
                "admin-product";


            const imageBox =
                document.createElement("div");

            imageBox.className =
                "admin-product-image";


            const image =
                document.createElement("img");


            image.src =
                images[0] || "";


            image.alt =
                product.name || "";


            imageBox.appendChild(image);


            const info =
                document.createElement("div");

            info.className =
                "admin-product-info";


            const title =
                document.createElement("h3");

            title.textContent =
                product.name || "";


            const price =
                document.createElement("p");

            price.textContent =
                Number(product.price || 0) +
                " ֏";


            const count =
                document.createElement("small");

            count.textContent =
                "🖼️ " +
                images.length +
                " նկար";


            const featured =
                document.createElement("p");


            featured.className =
                "featured-status";


            if (product.featured === true) {

                featured.textContent =
                    "⭐ Ցուցադրվում է գլխավոր էջում";

            } else {

                featured.textContent =
                    "▫️ Գլխավոր էջում չի ցուցադրվում";

            }


            info.appendChild(title);
            info.appendChild(price);
            info.appendChild(count);
            info.appendChild(featured);


            const buttons =
                document.createElement("div");

            buttons.className =
                "admin-product-buttons";


            const editButton =
                document.createElement("button");

            editButton.className =
                "edit-product";

            editButton.type =
                "button";

            editButton.textContent =
                "✏️ Փոխել";


            editButton.addEventListener(
                "click",
                function () {
                    editProduct(product);
                }
            );


            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "delete-product";

            deleteButton.type =
                "button";

            deleteButton.textContent =
                "🗑️ Ջնջել";


            deleteButton.addEventListener(
                "click",
                function () {
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

    }

    catch (error) {

        console.error(
            "PRODUCT LOAD ERROR:",
            error
        );


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


    if (images.length === 0) {

        alert(
            "❌ Ավելացրու գոնե մեկ նկար"
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

            console.error(error);

            throw new Error(error);

        }


        alert(
            featured
                ? "✅ Ապրանքը ավելացվեց և կերևա գլխավոր էջում"
                : "✅ Ապրանքը ավելացվեց։ Կերևա Խանութում"
        );


        document.getElementById(
            "product-form"
        ).reset();


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
                id,
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


    const images =
        getProductImages(product);


    const imageText =
        prompt(
            "Նկարների հղումները՝ յուրաքանչյուր նկարը նոր տողում",
            images.join("\n")
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


    const newImages =
        imageText
            .split("\n")
            .map(function (url) {
                return url.trim();
            })
            .filter(function (url) {
                return url !== "";
            });


    const isFeatured =
        featuredText
            .trim()
            .toLowerCase() === "yes";


    try {

        const response =
            await fetch(
                PRODUCTS_API +
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
                            JSON.stringify(newImages),

                        featured:
                            isFeatured

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
