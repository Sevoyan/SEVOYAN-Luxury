const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const API_URL = ${SUPABASE_URL}/rest/v1/products;

const headers = {
    apikey: SUPABASE_KEY,
    Authorization: Bearer ${SUPABASE_KEY},
    "Content-Type": "application/json"
};


// ԱՊՐԱՆՔՆԵՐԻ ԲԵՌՆՈՒՄ
async function loadAdminProducts() {

    const container = document.getElementById("admin-products");

    if (!container) return;

    try {

        const response = await fetch(
            ${API_URL}?select=*&order=id.desc,
            {
                headers: headers
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Չհաջողվեց բեռնել ապրանքները");
        }

        const products = await response.json();

        container.innerHTML = "";

        if (products.length === 0) {
            container.innerHTML = "<p>Ապրանքներ դեռ չկան։</p>";
            return;
        }

        products.forEach(product => {

            container.innerHTML += `
                <div class="admin-product">

                    <img
                        src="${product.image || ""}"
                        alt="${product.name}"
                    >

                    <div class="admin-product-info">
                        <h3>${product.name}</h3>
                        <p>${product.price} ֏</p>
                    </div>

                    <button onclick="editProduct(${product.id})">
                        ✏️ Փոխել
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${product.id})"
                    >
                        🗑️ Ջնջել
                    </button>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p>❌ ${error.message}</p>
        `;

    }

}


// ԱՊՐԱՆՔ ԱՎԵԼԱՑՆԵԼ
async function addProduct(event) {

    event.preventDefault();

    const name = document
        .getElementById("product-name")
        .value
        .trim();

    const price = Number(
        document.getElementById("product-price").value
    );

    const image = document
        .getElementById("product-image")
        .value
        .trim();


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                ...headers,
                Prefer: "return=representation"
            },

            body: JSON.stringify({
                name: name,
                price: price,
                image: image
            })

        });


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(
                errorText || "Չհաջողվեց ավելացնել ապրանքը"
            );

        }


        alert("✅ Ապրանքը ավելացվեց");

        document
            .getElementById("product-form")
            .reset();

        loadAdminProducts();

    } catch (error) {

        console.error(error);

        alert("❌ Չհաջողվեց ավելացնել ապրանքը");

    }

}


// ԱՊՐԱՆՔ ՋՆՋԵԼ
async function deleteProduct(id) {

    if (!confirm("Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը")) {
        return;
    }

    try {

        const response = await fetch(
            ${API_URL}?id=eq.${id},
            {
                method: "DELETE",
                headers: headers
            }
        );

        if (!response.ok) {
            throw new Error("Չհաջողվեց ջնջել");
        }

        alert("🗑️ Ապրանքը ջնջվեց");

        loadAdminProducts();

    } catch (error) {

        console.error(error);

        alert("❌ Չհաջողվեց ջնջել");

    }

}


// ԱՊՐԱՆՔ ՓՈԽԵԼ
async function editProduct(id) {

    const name = prompt("Նոր ապրանքի անունը");

    if (name === null) return;


    const price = prompt("Նոր գինը");

    if (price === null) return;


    const image = prompt("Նոր նկարի հղումը");

    if (image === null) return;


    try {

        const response = await fetch(
            ${API_URL}?id=eq.${id},
            {

                method: "PATCH",

                headers: {
                    ...headers,
                    Prefer: "return=representation"
                },

                body: JSON.stringify({
                    name: name,
                    price: Number(price),
                    image: image
                })

            }
        );


        if (!response.ok) {
            throw new Error("Չհաջողվեց փոխել");
        }


        alert("✅ Ապրանքը փոխվեց");

        loadAdminProducts();

    } catch (error) {

        console.error(error);

        alert("❌ Չհաջողվեց փոխել ապրանքը");

    }

}


// ԷՋԸ ԲԱՑԵԼԻՍ
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("product-form");

    if (form) {
        form.addEventListener("submit", addProduct);
    }

    loadAdminProducts();

});
