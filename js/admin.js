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


// LOGIN
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


// SHOW ADMIN
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


// LOGOUT
function logout() {

    localStorage.removeItem(
        "admin_access_token"
    );

    accessToken = null;

    const login =
        document.getElementById("admin-login");

    const panel =
        document.getElementById("admin-panel");

    if (panel) {
        panel.style.display = "none";
    }

    if (login) {
        login.style.display = "block";
    }

}


// HEADERS
function getHeaders() {

    return {

        "apikey": SUPABASE_KEY,

        "Authorization":
            "Bearer " + accessToken,

        "Content-Type":
            "application/json"

    };

}


// IMAGES
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

    const text =
        String(imageData).trim();

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

            console.log(error);

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


// LOAD PRODUCTS
async function loadAdminProducts() {

    const container =
        document.getElementById("admin-products");

    if (!container) {
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

        const text =
            await response.text();

        if (!response.ok) {

            throw new Error(
                text || "Չհաջողվեց բեռնել ապրանքները"
            );

        }

        const products =
            JSON.parse(text);

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

            const images =
                getProductImages(product.image);

            const firstImage =
                images.length > 0
                    ? images[0]
                    : "";

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


            const homeStatus =
                document.createElement("div");

            homeStatus.className =
                product.show_on_home
                    ? "home-status home-yes"
                    : "home-status home-no";

            homeStatus.textContent =
                product.show_on_home
                    ? "⭐ Գլխավոր էջում՝ ԱՅՈ"
                    : "Գլխավոր էջում՝ ՈՉ";


            info.appendChild(title);
            info.appendChild(price);
            info.appendChild(imageCount);
            info.appendChild(homeStatus);


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
                function() {
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

        console.error(error);

        container.innerHTML =
            "<p style='color:red;'>❌ " +
            error.message +
            "</p>";

    }

}


// ADD PRODUCT
async function addProduct(event) {

    event.preventDefault();

    const name =
        document.getElementById("product-name")
            .value.trim();

    const price =
        Number(
            document.getElementById("product-price")
                .value
        );

    const imageText =
        document.getElementById("product-image")
            .value;

    const showOnHome =
        document.getElementById("show-on-home")
            .checked;

    const images =
        getProductImages(imageText);


    if (!name) {

        alert("❌ Գրիր ապրանքի անունը։");
        return;

    }

    if (!price || price <= 0) {

        alert("❌ Գրիր ճիշտ գինը։");
        return;

    }

    if (images.length === 0) {

        alert("❌ Գրիր գոնե մեկ նկարի հղում։");
        return;

    }


    try {

        const response =
            await fetch(PRODUCTS_API, {

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

                    show_on_home:
                        showOnHome

                })

            });


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text || "Ապրանքը չավելացավ"
            );

        }


        alert("✅ Ապրանքը ավելացվեց");


        document
            .getElementById("product-form")
            .reset();


        await loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց ավելացնել ապրանքը\n\n" +
            error.message
        );

    }

}


// DELETE
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
                    headers: getHeaders()
                }

            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text || "Delete error"
            );

        }


        alert("🗑️ Ապրանքը ջնջվեց");

        await loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց ջնջել ապրանքը\n\n" +
            error.message
        );

    }

}


// EDIT
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
        getProductImages(product.image);


    const imageText =
        prompt(
            "Նկարների հղումները՝ յուրաքանչյուր նկարը նոր տողում",
            oldImages.join("\n")
        );


    if (imageText === null) {
        return;
    }


    const homeAnswer =
        prompt(
            "Ցուցադրել գլխավոր էջում՞\n\nԳրիր՝ այո կամ ոչ",
            product.show_on_home ? "այո" : "ոչ"
        );


    if (homeAnswer === null) {
        return;
    }


    const images =
        getProductImages(imageText);


    const showOnHome =
        homeAnswer.trim().toLowerCase() === "այո";


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
                            JSON.stringify(images),

                        show_on_home:
                            showOnHome

                    })

                }

            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text || "Edit error"
            );

        }


        alert("✅ Ապրանքը փոխվեց");

        await loadAdminProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Չհաջողվեց փոխել ապրանքը\n\n" +
            error.message
        );

    }

}


// START
document.addEventListener(
    "DOMContentLoaded",
    function() {

        const loginForm =
            document.getElementById("login-form");

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                adminLogin
            );

        }


        const logoutButton =
            document.getElementById("logout-btn");

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );

        }


        const productForm =
            document.getElementById("product-form");

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
