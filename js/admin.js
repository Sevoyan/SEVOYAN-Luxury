const SUPABASE_URL =
    "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const PRODUCTS_API =
    SUPABASE_URL + "/rest/v1/products";

const COLLECTIONS_API =
    SUPABASE_URL + "/rest/v1/collections";

const AUTH_URL =
    SUPABASE_URL + "/auth/v1/token?grant_type=password";

const REFRESH_URL =
    SUPABASE_URL + "/auth/v1/token?grant_type=refresh_token";


let accessToken =
    localStorage.getItem("admin_access_token");

let refreshToken =
    localStorage.getItem("admin_refresh_token");


// ==================================================
// SAVE SESSION
// ==================================================

function saveSession(data) {

    if (data.access_token) {

        accessToken =
            data.access_token;

        localStorage.setItem(
            "admin_access_token",
            accessToken
        );
    }


    if (data.refresh_token) {

        refreshToken =
            data.refresh_token;

        localStorage.setItem(
            "admin_refresh_token",
            refreshToken
        );
    }
}


// ==================================================
// CLEAR SESSION
// ==================================================

function clearSession() {

    accessToken = null;
    refreshToken = null;

    localStorage.removeItem(
        "admin_access_token"
    );

    localStorage.removeItem(
        "admin_refresh_token"
    );
}


// ==================================================
// LOGIN
// ==================================================

async function adminLogin(event) {

    event.preventDefault();


    const emailElement =
        document.getElementById(
            "admin-email"
        );


    const passwordElement =
        document.getElementById(
            "admin-password"
        );


    const email =
        emailElement.value.trim();


    const password =
        passwordElement.value;


    try {

        const response =
            await fetch(
                AUTH_URL,
                {
                    method: "POST",

                    headers: {
                        "apikey":
                            SUPABASE_KEY,

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
                data.message ||
                "Email-ը կամ գաղտնաբառը սխալ է"
            );
        }


        saveSession(data);


        showAdminPanel();


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        alert(
            "❌ Մուտքը չստացվեց\n\n" +
            error.message
        );
    }
}


// ==================================================
// REFRESH TOKEN
// ==================================================

async function refreshSession() {

    if (!refreshToken) {

        return false;
    }


    try {

        const response =
            await fetch(
                REFRESH_URL,
                {
                    method: "POST",

                    headers: {
                        "apikey":
                            SUPABASE_KEY,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        refresh_token:
                            refreshToken
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            clearSession();

            return false;
        }


        saveSession(data);

        return true;


    } catch (error) {

        console.error(
            "REFRESH ERROR:",
            error
        );

        clearSession();

        return false;
    }
}


// ==================================================
// API FETCH
// Automatically refreshes expired JWT
// ==================================================

async function apiFetch(
    url,
    options
) {

    options =
        options || {};


    options.headers =
        options.headers || {};


    options.headers.apikey =
        SUPABASE_KEY;


    options.headers.Authorization =
        "Bearer " + accessToken;


    let response =
        await fetch(
            url,
            options
        );


    if (response.status === 401) {

        const refreshed =
            await refreshSession();


        if (refreshed) {

            options.headers.Authorization =
                "Bearer " + accessToken;


            response =
                await fetch(
                    url,
                    options
                );
        }
    }


    return response;
}


// ==================================================
// SHOW ADMIN
// ==================================================

function showAdminPanel() {

    const login =
        document.getElementById(
            "admin-login"
        );


    const panel =
        document.getElementById(
            "admin-panel"
        );


    if (login) {

        login.style.display =
            "none";
    }


    if (panel) {

        panel.style.display =
            "block";
    }


    loadAdminProducts();

    loadAdminCollections();
}


// ==================================================
// LOGOUT
// ==================================================

function logout() {

    clearSession();


    const login =
        document.getElementById(
            "admin-login"
        );


    const panel =
        document.getElementById(
            "admin-panel"
        );


    if (panel) {

        panel.style.display =
            "none";
    }


    if (login) {

        login.style.display =
            "block";
    }
}


// ==================================================
// IMAGE PARSER
// ==================================================

function getImages(data) {

    if (!data) {

        return [];
    }


    if (Array.isArray(data)) {

        return data
            .map(function(url) {

                return String(url).trim();

            })
            .filter(function(url) {

                return url !== "";

            });
    }


    const text =
        String(data).trim();


    if (!text) {

        return [];
    }


    if (text.startsWith("[")) {

        try {

            const parsed =
                JSON.parse(text);


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
                "JSON image error:",
                error
            );
        }
    }


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


    return [text];
}


// ==================================================
// LOAD PRODUCTS
// ==================================================

async function loadAdminProducts() {

    const container =
        document.getElementById(
            "admin-products"
        );


    if (!container) {

        return;
    }


    if (!accessToken) {

        container.innerHTML =
            "<p>🔐 Մուտք գործիր Admin</p>";

        return;
    }


    try {

        const response =
            await apiFetch(
                PRODUCTS_API +
                "?select=*&order=id.desc",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                "Չհաջողվեց բեռնել ապրանքները"
            );
        }


        const products =
            JSON.parse(text);


        container.innerHTML =
            "";


        if (products.length === 0) {

            container.innerHTML =
                "<p>📦 Ապրանքներ դեռ չկան։</p>";

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


                const imageBox =
                    document.createElement(
                        "div"
                    );


                imageBox.className =
                    "admin-product-image";


                if (images.length > 0) {

                    const img =
                        document.createElement(
                            "img"
                        );


                    img.src =
                        images[0];


                    img.alt =
                        product.name || "";


                    imageBox.appendChild(
                        img
                    );

                } else {

                    imageBox.textContent =
                        "📷 Նկար չկա";
                }


                const info =
                    document.createElement(
                        "div"
                    );


                info.className =
                    "admin-product-info";


                const title =
                    document.createElement(
                        "h3"
                    );


                title.textContent =
                    product.name ||
                    "Անանուն ապրանք";


                const price =
                    document.createElement(
                        "p"
                    );


                price.textContent =
                    (product.price || 0) +
                    " ֏";


                const count =
                    document.createElement(
                        "small"
                    );


                count.textContent =
                    "🖼️ " +
                    images.length +
                    " նկար";


                info.appendChild(title);
                info.appendChild(price);
                info.appendChild(count);


                const buttons =
                    document.createElement(
                        "div"
                    );


                buttons.className =
                    "admin-product-buttons";


                const editButton =
                    document.createElement(
                        "button"
                    );


                editButton.type =
                    "button";


                editButton.className =
                    "edit-product";


                editButton.textContent =
                    "✏️ Փոխել";


                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.type =
                    "button";


                deleteButton.className =
                    "delete-product";


                deleteButton.textContent =
                    "🗑️ Ջնջել";


                editButton.addEventListener(
                    "click",
                    function() {

                        editProduct(
                            product
                        );

                    }
                );


                deleteButton.addEventListener(
                    "click",
                    function() {

                        deleteProduct(
                            product.id
                        );

                    }
                );


                buttons.appendChild(
                    editButton
                );


                buttons.appendChild(
                    deleteButton
                );


                item.appendChild(
                    imageBox
                );


                item.appendChild(
                    info
                );


                item.appendChild(
                    buttons
                );


                container.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        console.error(
            "PRODUCT LOAD ERROR:",
            error
        );


        container.innerHTML =
            "<p style='color:red;'>❌ " +
            error.message +
            "</p>";
    }
}


// ==================================================
// ADD PRODUCT
// ==================================================

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


    const imageText =
        document
            .getElementById(
                "product-image"
            )
            .value;


    const images =
        getImages(
            imageText
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

        const response =
            await apiFetch(
                PRODUCTS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Prefer":
                            "return=representation"
                    },

                    body: JSON.stringify({
                        name: name,
                        price: price,
                        image:
                            JSON.stringify(
                                images
                            )
                    })
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                "Ապրանքը չավելացավ"
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


    } catch (error) {

        console.error(
            "ADD PRODUCT ERROR:",
            error
        );


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

    if (
        !confirm(
            "Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը։"
        )
    ) {

        return;
    }


    try {

        const response =
            await apiFetch(
                PRODUCTS_API +
                "?id=eq." +
                encodeURIComponent(id),
                {
                    method: "DELETE"
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                "Delete error"
            );
        }


        alert(
            "🗑️ Ապրանքը ջնջվեց"
        );


        loadAdminProducts();


    } catch (error) {

        console.error(
            "DELETE PRODUCT ERROR:",
            error
        );


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
        getImages(
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
        getImages(
            imageText
        );


    const newPrice =
        Number(price);


    if (!name.trim()) {

        alert(
            "❌ Անունը դատարկ է"
        );

        return;
    }


    if (!newPrice || newPrice <= 0) {

        alert(
            "❌ Գինը սխալ է"
        );

        return;
    }


    try {

        const response =
            await apiFetch(
                PRODUCTS_API +
                "?id=eq." +
                encodeURIComponent(
                    product.id
                ),
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Prefer":
                            "return=representation"
                    },

                    body: JSON.stringify({
                        name:
                            name.trim(),

                        price:
                            newPrice,

                        image:
                            JSON.stringify(
                                images
                            )
                    })
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                "Edit error"
            );
        }


        alert(
            "✅ Ապրանքը փոխվեց"
        );


        loadAdminProducts();


    } catch (error) {

        console.error(
            "EDIT PRODUCT ERROR:",
            error
        );


        alert(
            "❌ Չհաջողվեց փոխել ապրանքը\n\n" +
            error.message
        );
    }
}


// ==================================================
// LOAD COLLECTIONS
// ==================================================

async function loadAdminCollections() {

    const container =
        document.getElementById(
            "admin-collections"
        );


    if (!container) {

        return;
    }


    if (!accessToken) {

        container.innerHTML =
            "<p>🔐 Մուտք գործիր Admin</p>";

        return;
    }


    try {

        const response =
            await apiFetch(
                COLLECTIONS_API +
                "?select=*&order=id.desc",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                "Չհաջողվեց բեռնել հավաքածուները"
            );
        }


        const collections =
            JSON.parse(text);


        container.innerHTML =
            "";


        if (collections.length === 0) {

            container.innerHTML =
                "<p>💎 Հավաքածուներ դեռ չկան։</p>";

            return;
        }


        collections.forEach(
            function(collection) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "admin-collection";


                const images =
                    getImages(
                        collection.images
                    );


                const imageBox =
                    document.createElement(
                        "div"
                    );


                imageBox.className =
                    "collection-images";


                images.forEach(
                    function(url) {

                        const img =
                            document.createElement(
                                "img"
                            );


                        img.src =
                            url;


                        img.alt =
                            collection.name || "";


                        imageBox.appendChild(
                            img
                        );

                    }
                );


                const title =
                    document.createElement(
                        "h3"
                    );


                title.textContent =
                    collection.name ||
                    "Անանուն հավաքածու";


                const price =
                    document.createElement(
                        "p"
                    );


                price.textContent =
                    (collection.price || 0) +
                    " ֏";


                const count =
                    document.createElement(
                        "p"
                    );


                count.textContent =
                    "🖼️ " +
                    images.length +
                    " նկար";


                const buttons =
                    document.createElement(
                        "div"
                    );


                buttons.className =
                    "admin-collection-buttons";


                const editButton =
                    document.createElement(
                        "button"
                    );


                editButton.type =
                    "button";


                editButton.className =
                    "edit-collection";


                editButton.textContent =
                    "✏️ Փոխել";


                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.type =
                    "button";


                deleteButton.className =
                    "delete-collection";


                deleteButton.textContent =
                    "🗑️ Ջնջել";


                editButton.addEventListener(
                    "click",
                    function() {

                        editCollection(
                            collection
                        );

                    }
                );


                deleteButton.addEventListener(
                    "click",
                    function() {

                        deleteCollection(
                            collection.id
                        );

                    }
                );


                buttons.appendChild(
                    editButton
                );


                buttons.appendChild(
                    deleteButton
                );


                item.appendChild(
                    imageBox
                );


                item.appendChild(
                    title
                );


                item.appendChild(
                    price
                );


                item.appendChild(
                    count
                );


                item.appendChild(
                    buttons
                );


                container.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        console.error(
            "COLLECTION LOAD ERROR:",
            error
        );


        container.innerHTML =
            "<p style='color:red;'>❌ " +
            error.message +
            "</p>";
    }
}


// ==================================================
// ADD COLLECTION
// ==================================================

async function addCollection(event) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "collection-name"
            )
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById(
                    "collection-price"
                )
                .value
        );


    const imageText =
        document
            .getElementById(
                "collection-images"
            )
            .value;


    const images =
        getImages(
            imageText
        );


    if (!name) {

        alert(
            "❌ Գրիր հավաքածուի անունը։"
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

        const response =
            await apiFetch(
                COLLECTIONS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Prefer":
                            "return=representation"
                    },

                    body: JSON.stringify({
                        name:
                            name,

                        price:
                            price,

                        images:
                            images
                    })
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                "Հավաքածուն չավելացավ"
            );
        }


        alert(
            "✅ Հավաքածուն ավելացվեց"
        );


        document
            .getElementById(
                "collection-form"
            )
            .reset();


        loadAdminCollections();


    } catch (error) {

        console.error(
            "ADD COLLECTION ERROR:",
            error
        );


        alert(
            "❌ Չհաջողվեց ավելացնել հավաքածուն\n\n" +
            error.message
        );
    }
}


// ==================================================
// DELETE COLLECTION
// ==================================================

async function deleteCollection(id) {

    if (
        !confirm(
            "Վստա՞հ ես, որ ուզում ես ջնջել այս հավաքածուն։"
        )
    ) {

        return;
    }


    try {

        const response =
            await apiFetch(
                COLLECTIONS_API +
                "?id=eq." +
                encodeURIComponent(id),
                {
                    method: "DELETE"
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                "Delete error"
            );
        }


        alert(
            "🗑️ Հավաքածուն ջնջվեց"
        );


        loadAdminCollections();


    } catch (error) {

        console.error(
            "DELETE COLLECTION ERROR:",
            error
        );


        alert(
            "❌ Չհաջողվեց ջնջել հավաքածուն\n\n" +
            error.message
        );
    }
}


// ==================================================
// EDIT COLLECTION
// ==================================================

async function editCollection(collection) {

    const name =
        prompt(
            "Հավաքածուի անունը",
            collection.name || ""
        );


    if (name === null) {

        return;
    }


    const price =
        prompt(
            "Հավաքածուի գինը",
            collection.price || 0
        );


    if (price === null) {

        return;
    }


    const oldImages =
        getImages(
            collection.images
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
        getImages(
            imageText
        );


    const newPrice =
        Number(price);


    if (!name.trim()) {

        alert(
            "❌ Անունը դատարկ է"
        );

        return;
    }


    if (!newPrice || newPrice <= 0) {

        alert(
            "❌ Գինը սխալ է"
        );

        return;
    }


    if (images.length === 0) {

        alert(
            "❌ Պետք է գոնե մեկ նկար"
        );

        return;
    }


    try {

        const response =
            await apiFetch(
                COLLECTIONS_API +
                "?id=eq." +
                encodeURIComponent(
                    collection.id
                ),
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Prefer":
                            "return=representation"
                    },

                    body: JSON.stringify({
                        name:
                            name.trim(),

                        price:
                            newPrice,

                        images:
                            images
                    })
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                "Edit error"
            );
        }


        alert(
            "✅ Հավաքածուն փոխվեց"
        );


        loadAdminCollections();


    } catch (error) {

        console.error(
            "EDIT COLLECTION ERROR:",
            error
        );


        alert(
            "❌ Չհաջողվեց փոխել հավաքածուն\n\n" +
            error.message
        );
    }
}


// ==================================================
// CHECK SAVED SESSION
// ==================================================

async function checkSavedSession() {

    if (!accessToken) {

        return;
    }


    try {

        const response =
            await apiFetch(
                SUPABASE_URL +
                "/auth/v1/user",
                {
                    method: "GET"
                }
            );


        if (response.ok) {

            showAdminPanel();

            return;
        }


        clearSession();


    } catch (error) {

        console.error(
            "SESSION CHECK ERROR:",
            error
        );

        clearSession();
    }
}


// ==================================================
// START
// ==================================================

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


        checkSavedSession();

    }
);
