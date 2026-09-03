const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const API_URL =
    ${SUPABASE_URL}/rest/v1/products?select=*;

async function loadProducts() {
    const container = document.getElementById("products");

    try {
        const response = await fetch(API_URL, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": Bearer ${SUPABASE_KEY}
            }
        });

        if (!response.ok) {
            throw new Error(Error: ${response.status});
        }

        const products = await response.json();

        container.innerHTML = "";

        if (products.length === 0) {
            container.innerHTML = "<p>Ապրանքներ դեռ չկան։</p>";
            return;
        }

        products.forEach(product => {
            container.innerHTML += `
                <div class="product-card">
                    <img src="${product.image || ''}" alt="${product.name}">

                    <h3>${product.name}</h3>

                    <p>$${product.price}</p>

                    <button onclick="addToCart('${product.name}', ${product.price}, '${product.image || ''}')">
                        🛒 Ավելացնել զամբյուղ
                    </button>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);

        container.innerHTML =
            <p>❌ Սխալ՝ ${error.message}</p>;
    }
}

document.addEventListener("DOMContentLoaded", loadProducts);
