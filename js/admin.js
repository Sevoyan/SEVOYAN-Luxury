const SUPABASE_URL =
    "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const PRODUCTS_API =
    SUPABASE_URL + "/rest/v1/products";

const COLLECTIONS_API =
    SUPABASE_URL + "/rest/v1/collections";

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

                "Content-Type":
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
// ADMIN PANEL
// =========================

function showAdminPanel() {

    document.getElementById(
        "admin-login"
    ).style.display = "none";


    document.getElementById(
        "admin-panel"
    ).style.display = "block";


    loadAdminProducts();

    loadAdminCollections();

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


// ==================================================
// PRODUCTS
// ==================================================

async function loadAdminProducts() {

    const container =
        document.getElementById(
            "admin-products"
        );


    if (!container) return;


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
                "Չհաջողվեց բեռնել ապրանքները"
            );

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
            function (product) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "admin-product";


                item.innerHTML = `

                    <img
                        src="${product.image || ""}"
                        alt=""
                    >

                    <div>

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            ${product.price} ֏
                        </p>

                    </div>

                    <button class="edit-product">
                        ✏️ Փոխել
                    </button>

                    <button class="delete-product">
                        🗑️ Ջնջել
                    </button>

                `;


                item
                    .querySelector(
                        ".edit-product"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            editProduct(
                                product
                            );

                        }
                    );


                item
                    .querySelector(
                        ".delete-product"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            deleteProduct(
                                product.id
                            );

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


    const image =
        document.getElementById(
            "product-image"
        ).value.trim();


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

                        image: image

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
            "❌ Չհաջողվեց ավելացնել ապրանքը"
        );

    }

}


// =========================
// DELETE PRODUCT
// =========================

async function deleteProduct(id) {

    if (
        !confirm(
            "Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը։"
        )
    ) return;


    try {

        const response =
            await fetch(
                PRODUCTS_API +
                "?id=eq." + id,
                {

                    method: "DELETE",

                    headers:
                        getHeaders()

                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete error"
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
// EDIT PRODUCT
// =========================

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
            "Նկարի հղումը",
            product.image || ""
        );


    if (image === null) return;


    try {

        const response =
            await fetch(
                PRODUCTS_API +
                "?id=eq." + product.id,
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

            throw new Error(
                "Edit error"
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


// ==================================================
// COLLECTIONS
// ==================================================

async function loadAdminCollections() {

    const container =
        document.getElementById(
            "admin-collections"
        );


    if (!container) return;


    try {

        const response =
            await fetch(
                COLLECTIONS_API +
                "?select=*&order=id.desc",
                {
                    headers:
                        getHeaders()
                }
            );


        if (!response.ok) {

            throw new Error(
                "Չհաջողվեց բեռնել հավաքածուները"
            );

        }


        const collections =
            await response.json();


        container.innerHTML = "";


        if (collections.length === 0) {

            container.innerHTML =
                "<p>Հավաքածուներ դեռ չկան։</p>";

            return;

        }


        collections.forEach(
            function (collection) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "admin-collection";


                let images =
                    collection.images || [];


                if (!Array.isArray(images)) {

                    images = [];

                }


                let imageHTML = "";


                images.forEach(
                    function (image) {

                        imageHTML += `

                            <img
                                src="${image}"
                                alt=""
                            >

                        `;

                    }
                );


                item.innerHTML = `

                    <div class="collection-images">

                        ${imageHTML}

                    </div>

                    <h3>
                        ${collection.name}
                    </h3>

                    <p>
                        ${collection.price || 0} ֏
                    </p>

                    <p>
                        🖼️ ${images.length} նկար
                    </p>

                    <button class="edit-collection">
                        ✏️ Փոխել
                    </button>

                    <button class="delete-collection">
                        🗑️ Ջնջել
                    </button>

                `;


                item
                    .querySelector(
                        ".edit-collection"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            editCollection(
                                collection
                            );

                        }
                    );


                item
                    .querySelector(
                        ".delete-collection"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            deleteCollection(
                                collection.id
                            );

                        }
                    );


                container.appendChild(item);

            }
        );

    }

    catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>❌ Չհաջողվեց բեռնել հավաքածուները</p>";

    }

}


// =========================
// ADD COLLECTION
// =========================

async function addCollection(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "collection-name"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "collection-price"
            ).value
        );


    const text =
        document.getElementById(
            "collection-images"
        ).value.trim();


    const images =
        text
            .split("\n")
            .map(
                function (url) {
                    return url.trim();
                }
            )
            .filter(
                function (url) {
                    return url !== "";
                }
            );


    if (images.length === 0) {

        alert(
            "❌ Ավելացրու գոնե մեկ նկար"
        );

        return;

    }


    try {

        const response =
            await fetch(
                COLLECTIONS_API,
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

                        images: images

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
            "✅ Հավաքածուն ավելացվեց"
        );


        document.getElementById(
            "collection-form"
        ).reset();


        loadAdminCollections();

    }

    catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց ավելացնել հավաքածուն"
        );

    }

}


// =========================
// DELETE COLLECTION
// =========================

async function deleteCollection(id) {

    if (
        !confirm(
            "Վստա՞հ ես, որ ուզում ես ջնջել այս հավաքածուն։"
        )
    ) return;


    try {

        const response =
            await fetch(
                COLLECTIONS_API +
                "?id=eq." + id,
                {

                    method: "DELETE",

                    headers:
                        getHeaders()

                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete error"
            );

        }


        alert(
            "🗑️ Հավաքածուն ջնջվեց"
        );


        loadAdminCollections();

    }

    catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց ջնջել հավաքածուն"
        );

    }

}


// =========================
// EDIT COLLECTION
// =========================

async function editCollection(collection) {

    const name =
        prompt(
            "Հավաքածուի անունը",
            collection.name
        );


    if (name === null) return;


    const price =
        prompt(
            "Հավաքածուի գինը",
            collection.price || 0
        );


    if (price === null) return;


    const oldImages =
        Array.isArray(
            collection.images
        )
            ? collection.images.join("\n")
            : "";


    const imagesText =
        prompt(
            "Նկարների հղումները՝ յուրաքանչյուր նկարը նոր տողում",
            oldImages
        );


    if (imagesText === null) return;


    const images =
        imagesText
            .split("\n")
            .map(
                function (url) {
                    return url.trim();
                }
            )
            .filter(
                function (url) {
                    return url !== "";
                }
            );


    try {

        const response =
            await fetch(
                COLLECTIONS_API +
                "?id=eq." +
                collection.id,
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

                        images:
                            images

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
            "✅ Հավաքածուն փոխվեց"
        );


        loadAdminCollections();

    }

    catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց փոխել հավաքածուն"
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


        const collectionForm =
            document.getElementById(
                "collection-form"
            );


        if (collectionForm) {

            collectionForm.addEventListener(
                "submit",
                addCollection
            );

        }


        if (accessToken) {

            showAdminPanel();

        }

    }
);
