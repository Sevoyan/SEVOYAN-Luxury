const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";
const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const API_URL = SUPABASE_URL + "/rest/v1/products";

async function loadProducts() {
    const container = document.getElementById("products");

    if (!container) return;

    container.innerHTML = "<p>Ապրանքները բեռնվում են...</p>";

    try {
        const response = await fetch(
            API_URL + "?select=name,price,image",
            {
                method: "GET",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": "Bearer " + SUPABASE_KEY,
                    "Content-Type": "application/json"
                },
                cache: "no-store"
            }
        );

        const text = await response.text();

        console.log("Supabase status:", response.status);
        console.log("Supabase response:", text);

        if (!response.ok) {
            throw new Error(text);
        }

        const products = JSON.parse(text);

        container.innerHTML = "";

        if (!products || products.length === 0) {
            container.innerHTML =
                "<p>Ապրանքներ դեռ չկան։</p>";
            return;
        }

        products.forEach(function(product) {

            const card = document.createElement("div");
            card.className = "product-card";

            const image = document.createElement("img");
            image.src = product.image || "";
            image.alt = product.name || "Ապրանք";

            const name = document.createElement("h3");
            name.textContent = product.name || "Ապրանք";

            const price = document.createElement("p");
            price.textContent =
                (product.price || 0) + " ֏";

            const button = document.createElement("button");
            button.textContent =
                "🛒 Ավելացնել զամբյուղ";

            button.addEventListener(
                "click",
                function() {

                    if (typeof addToCart === "function") {

                        addToCart(
                            product.name,
                            product.price,
                            product.image || ""
                        );

                    } else {

                        alert(
                            "❌ Զամբյուղը չի միացել"
                        );
                    }
                }
            );

            card.appendChild(image);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(button);

            container.appendChild(card);
        });

    } catch (error) {

        console.error(
            "Products error:",
            error
        );

        container.innerHTML =
            "<p>❌ Չհաջողվեց բեռնել ապրանքները</p>" +
            "<small>" +
            error.message +
            "</small>";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    loadProducts
);
