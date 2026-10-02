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


// ========================================
// HEADERS
// ========================================

function getHeaders() {

    return {
        "apikey": SUPABASE_KEY,

        "Authorization":
            "Bearer " + accessToken,

        "Content-Type":
            "application/json"
    };
}


// ========================================
// LOGIN
// ========================================

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


    if (!email || !password) {

        alert("❌ Լրացրու Email-ը և գաղտնաբառը");

        return;
    }


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

                    body:
                        JSON.stringify({
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

        console.error(
            "LOGIN ERROR:",
            error
        );

        alert(
            "❌ " +
            error.message
        );
    }
}


// ========================================
// SHOW ADMIN PANEL
// ========================================

function showAdminPanel() {

    const loginBox =
        document.getElementById(
            "admin-login"
        );

    const adminPanel =
        document.getElementById(
            "admin-panel"
        );


    if (loginBox) {

        loginBox.style.display =
            "none";
    }


    if (adminPanel) {

        adminPanel.style.display =
            "block";
    }


    loadAdminProducts();
}


// ========================================
// LOGOUT
// ========================================

function logoutAdmin() {

    localStorage.removeItem(
        "admin_access_token"
    );

    accessToken = null;


    const adminPanel =
        document.getElementById(
            "admin-panel"
        );

    const loginBox =
        document.getElementById(
            "admin-login"
        );


    if (adminPanel) {

        adminPanel.style.display =
            "none";
    }


    if (loginBox) {

        loginBox.style.display =
            "block";
    }
}


// ========================================
// IMAGES
// ========================================

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

    } catch (error) {
    }


    return String(image)
        .split("\n")
        .map(function(url) {

            return url.trim();

        })
        .filter(function(url) {

            return url !== "";

        });
}


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadAdminProducts() {

    const container =
        document.getElementById(
            "admin-products"
        );


    if (!container) {

        return;
    }


    container.innerHTML =
        "<p>Բեռնում է...</p>";


    try {

        const response =
            await fetch(
                PRODUCTS_API +
                "?select=*&order=id.desc",
                {
                    method: "GET",

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


        container.innerHTML =
            "";


        if (
            !products ||
            products.length === 0
        ) {

            container.innerHTML =
                `
                <p style="
                    text-align:center;
                    color:#D4AF37;
                    padding:20px;
                ">
                    Ապրանքներ դեռ չկան։
                </p>
                `;

            return;
        }


        products.forEach(
            function(product) {

                createAdminProduct(
                    product,
                    container
                );

            }
        );

    } catch (error) {

        console.error(
            "LOAD ADMIN PRODUCTS ERROR:",
            error
        );


        container.innerHTML =
            `
            <p style="
                text-align:center;
                color:#ff5555;
                padding:20px;
            ">
                ❌ Չհաջողվեց բեռնել ապրանքները
            </p>
            `;
    }
}


// ========================================
// CREATE ADMIN PRODUCT
// ========================================

function createAdminProduct(
    product,
    container
) {

    const images =
        getImages(
            product.image
        );


    const item =
        document.createElement(
            "div"
        );

    item.className =
        "admin-product";


    // IMAGE

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

        img.onerror =
            function() {

                this.style.display =
                    "none";
            };

        imageBox.appendChild(
            img
        );
    }


    // INFO

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
        product.name || "";


    const english =
        document.createElement(
            "p"
        );

    english.textContent =
        "🇬🇧 " +
        (
            product.name_en ||
            "—"
        );


    const russian =
        document.createElement(
            "p"
        );

    russian.textContent =
        "🇷🇺 " +
        (
            product.name_ru ||
            "—"
        );


    const price =
        document.createElement(
            "p"
        );

    price.textContent =
        Number(
            product.price || 0
        ).toLocaleString(
            "hy-AM"
        ) +
        " ֏";


    const featured =
        document.createElement(
            "small"
        );


    featured.textContent =
        product.featured === true
            ? "⭐ Գլխավոր էջում"
            : "▫️ Միայն Խանութում";


    info.appendChild(title);
    info.appendChild(english);
    info.appendChild(russian);
    info.appendChild(price);
    info.appendChild(featured);


    // BUTTONS

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


    editButton.addEventListener(
        "click",
        function() {

            editProduct(
                product
            );
        }
    );


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


// ========================================
// ADD PRODUCT
// ========================================

async function addProduct(event) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "product-name"
            )
            .value
            .trim();


    const nameEn =
        document
            .getElementById(
                "product-name-en"
            )
            .value
            .trim();


    const nameRu =
        document
            .getElementById(
                "product-name-ru"
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
            .value
            .trim();


    const featured =
        document
            .getElementById(
                "product-featured"
            )
            .checked;


    if (!name) {

        alert(
            "❌ Գրիր ապրանքի հայերեն անունը"
        );

        return;
    }


    if (!nameEn) {

        alert(
            "❌ Գրիր ապրանքի անգլերեն անունը"
        );

        return;
    }


    if (!nameRu) {

        alert(
            "❌ Գրիր ապրանքի ռուսերեն անունը"
        );

        return;
    }


    if (!price || price <= 0) {

        alert(
            "❌ Գրիր ճիշտ գինը"
        );

        return;
    }


    const images =
        imageText
            .split("\n")
            .map(function(url) {

                return url.trim();

            })
            .filter(function(url) {

                return url !== "";

            });


    if (images.length === 0) {

        alert(
            "❌ Ավելացրու գոնե մեկ նկարի հղում"
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

                    body:
                        JSON.stringify({

                            name:
                                name,

                            name_en:
                                nameEn,

                            name_ru:
                                nameRu,

                            price:
                                price,

                            image:
                                JSON.stringify(
                                    images
                                ),

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
            "✅ Ապրանքը հաջողությամբ ավելացվեց"
        );


        document
            .getElementById(
                "product-form"
            )
            .reset();


        await loadAdminProducts();

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


// ========================================
// DELETE PRODUCT
// ========================================

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


// ========================================
// EDIT PRODUCT
// ========================================

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
            "Գինը ֏",
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
            .map(function(url) {

                return url.trim();

            })
            .filter(function(url) {

                return url !== "";

            });


    const featured =
        featuredText
            .trim()
            .toLowerCase() ===
        "yes";


    try {

        const response =
            await fetch(
                PRODUCTS_API +
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

                    body:
                        JSON.stringify({

                            name:
                                name.trim(),

                            name_en:
                                nameEn.trim(),

                            name_ru:
                                nameRu.trim(),

                            price:
                                Number(price),

                            image:
                                JSON.stringify(
                                    images
                                ),

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


// ========================================
// START
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // LOGIN

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


        // LOGOUT

        const logoutButton =
            document.getElementById(
                "logout-btn"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutAdmin
            );
        }


        // PRODUCT FORM

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


        // EXISTING LOGIN

        if (accessToken) {

            showAdminPanel();
        }

    }
);
