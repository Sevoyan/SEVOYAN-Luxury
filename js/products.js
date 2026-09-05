const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const API_URL = SUPABASE_URL + "/rest/v1/products";

async function loadProducts() {

    const container = document.getElementById("products");

    try {

        const response = await fetch(
            API_URL + "?select=*&order=id.desc",
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": "Bearer " + SUPABASE_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error("Չհաջողվեց բեռնել ապրանքները");
        }

        const products = await response.json();

        container.innerHTML = "";

        if (products.length === 0) {
            container.innerHTML = "<p>Ապրանքներ դեռ չկան։</p>";
            return;
        }

        products.forEach(function (product) {

            const card = document.createElement("div");

            card.className = "product-card";

            const image = document.createElement("img");
            image.src = product.image || "";
            image.alt = product.name;

            const name = document.createElement("h3");
            name.textContent = product.name;

            const price = document.createElement("p");
            price.textContent = product.price + " ֏";

            const button = document.createElement("button");
            button.textContent = "🛒 Ավելացնել զամբյուղ";

            button.addEventListener("click", function () {

                if (typeof addToCart === "function") {
                    addToCart(
                        product.name,
                        product.price,
                        product.image || ""
                    );
                } else {
                    alert("Զամբյուղի ֆունկցիան դեռ չի միացված");
                }

            });

            card.appendChild(image);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(button);

            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>❌ " + error.message + "</p>";

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadProducts
);
