const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const API_URL = ${SUPABASE_URL}/rest/v1/products;

async function loadAdminProducts() {
    const container = document.getElementById("admin-products");

    try {
        const response = await fetch(
            ${API_URL}?select=*&order=id.desc,
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": Bearer ${SUPABASE_KEY}
                }
            }
        );

        const products = await response.json();

        container.innerHTML = "";

        if (!products || products.length === 0) {
            container.innerHTML = "<p>Ապրանքներ դեռ չկան։</p>";
            return;
        }

        products.forEach(product => {
            container.innerHTML += `
                <div class="admin-product">

                    <img 
                        src="${product.image || 'https://via.placeholder.com/100'}"
                        alt="${product.name}"
                    >

                    <div>
                        <h3>${product.name}</h3>
                        <p>${product.price} ֏</p>
                    </div>

                    <button onclick="deleteProduct(${product.id})">
                        🗑 Ջնջել
                    </button>

                </div>
            `;
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>❌ Ապրանքները չհաջողվեց բեռնել</p>";
    }
}


document.getElementById("product-form").addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const image = document.getElementById("product-image").value;

    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": Bearer ${SUPABASE_KEY},
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                name: name,
                price: Number(price),
                image: image
            })
        });

        if (!response.ok) {
            throw new Error("Չհաջողվեց ավելացնել");
        }

        alert("✅ Ապրանքը հաջողությամբ ավելացվեց");

        document.getElementById("product-form").reset();

        loadAdminProducts();

    } catch (error) {

        console.error(error);

        alert("❌ Ապրանքը չհաջողվեց ավելացնել");

    }

});


async function deleteProduct(id) {

    const confirmDelete = confirm("Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը");

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            ${API_URL}?id=eq.${id},
            {
                method: "DELETE",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": Bearer ${SUPABASE_KEY}
                }
            }
        );

        if (!response.ok) {
            throw new Error("Չհաջողվեց ջնջել");
        }

        alert("🗑 Ապրանքը ջնջվեց");

        loadAdminProducts();

    } catch (error) {

        console.error(error);

        alert("❌ Ջնջելը չհաջողվեց");

    }

}


document.addEventListener("DOMContentLoaded", loadAdminProducts);
