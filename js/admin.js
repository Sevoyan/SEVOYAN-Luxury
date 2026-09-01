const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const API_URL = ${SUPABASE_URL}/rest/v1/products;

const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": Bearer ${SUPABASE_KEY,
    "Content-Type": "application/json"
};


// Ապրանքների բեռնում
async function loadProducts() {

    const response = await fetch(API_URL, {
        headers: headers
    });

    const products = await response.json();

    const container = document.getElementById("admin-products");

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
            <div class="admin-product">

                <img src="${product.image || ''}">

                <div>
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                </div>

                <button onclick="deleteProduct(${product.id})">
                    🗑️ Ջնջել
                </button>

            </div>
        `;
    });
}


// Ապրանք ավելացնել
document.getElementById("product-form").addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("product-name").value;

    const price = document.getElementById("product-price").value;

    const image = document.getElementById("product-image").value;


    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            ...headers,
            "Prefer": "return=representation"
        },

        body: JSON.stringify({
            name: name,
            price: Number(price),
            image: image
        })

    });


    if (response.ok) {

        alert("✅ Ապրանքը ավելացվեց");

        document.getElementById("product-form").reset();

        loadProducts();

    } else {

        const error = await response.text();

        alert("❌ Սխալ: " + error);

    }

});


// Ապրանք ջնջել
async function deleteProduct(id) {

    if (!confirm("Ջնջե՞լ այս ապրանքը")) return;


    const response = await fetch(
        ${API_URL}?id=eq.${id},
        {
            method: "DELETE",
            headers: headers
        }
    );


    if (response.ok) {

        loadProducts();

    } else {

        alert("❌ Չհաջողվեց ջնջել");

    }

}


// Էջը բացելիս բեռնել ապրանքները
document.addEventListener("DOMContentLoaded", loadProducts);
