const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const API_URL = SUPABASE_URL + "/rest/v1/products";

const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json"
};


// Ապրանքները բեռնել
async function loadAdminProducts() {

    const container = document.getElementById("admin-products");

    try {

        const response = await fetch(
            API_URL + "?select=*&order=id.desc",
            {
                headers: headers
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

            const item = document.createElement("div");

            item.className = "admin-product";

            item.innerHTML =
                "<img src='" + (product.image || "") + "' alt=''>" +

                "<div>" +
                    "<h3>" + product.name + "</h3>" +
                    "<p>" + product.price + " ֏</p>" +
                "</div>" +

                "<button class='edit-btn'>✏️ Փոխել</button>" +
                "<button class='delete-btn'>🗑️ Ջնջել</button>";


            item.querySelector(".edit-btn").addEventListener(
                "click",
                function () {
                    editProduct(product);
                }
            );


            item.querySelector(".delete-btn").addEventListener(
                "click",
                function () {
                    deleteProduct(product.id);
                }
            );


            container.appendChild(item);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>❌ Error: " + error.message + "</p>";

    }

}


// Ապրանք ավելացնել
async function addProduct(event) {

    event.preventDefault();

    const name =
        document.getElementById("product-name").value.trim();

    const price =
        Number(document.getElementById("product-price").value);

    const image =
        document.getElementById("product-image").value.trim();


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                name: name,
                price: price,
                image: image
            })

        });


        if (!response.ok) {

            const errorText = await response.text();

            console.error(errorText);

            throw new Error(errorText);

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


// Ապրանք ջնջել
async function deleteProduct(id) {

    const answer = confirm(
        "Վստա՞հ ես, որ ուզում ես ջնջել այս ապրանքը"
    );

    if (!answer) {
        return;
    }


    try {

        const response = await fetch(
            API_URL + "?id=eq." + id,
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


// Ապրանք խմբագրել
async function editProduct(product) {

    const name = prompt(
        "Ապրանքի անունը",
        product.name
    );

    if (name === null) {
        return;
    }


    const price = prompt(
        "Ապրանքի գինը",
        product.price
    );

    if (price === null) {
        return;
    }


    const image = prompt(
        "Նկարի հղումը",
        product.image || ""
    );

    if (image === null) {
        return;
    }


    try {

        const response = await fetch(
            API_URL + "?id=eq." + product.id,
            {

                method: "PATCH",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": "Bearer " + SUPABASE_KEY,
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
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


// Էջը բացվելիս
document.addEventListener(
    "DOMContentLoaded",
    function () {

        const form =
            document.getElementById("product-form");

        if (form) {
            form.addEventListener(
                "submit",
                addProduct
            );
        }

        loadAdminProducts();

    }
);
