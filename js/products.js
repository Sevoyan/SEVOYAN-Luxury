const SUPABASE_URL =
    "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const PRODUCTS_API =
    SUPABASE_URL + "/rest/v1/products";


// =========================
// GET IMAGES
// =========================

function getImages(product) {

    if (!product.image) {
        return [];
    }


    if (Array.isArray(product.image)) {
        return product.image;
    }


    try {

        const parsed =
            JSON.parse(product.image);

        if (Array.isArray(parsed)) {
            return parsed;
        }

    }

    catch (error) {
    }


    return String(product.image)
        .split("\n")
        .map(function (item) {
            return item.trim();
        })
        .filter(function (item) {
            return item !== "";
        });

}



// =========================
// LOAD PRODUCTS
// =========================

async function loadProducts() {

    const container =
        document.getElementById("products");


    if (!container) {
        return;
    }


    try {

        const isHome =
            window.location.pathname
                .toLowerCase()
                .includes("index.html") ||
            window.location.pathname === "/" ||
            window.location.pathname.endsWith("/SEVOYAN-Luxury/");


        let url =
            PRODUCTS_API +
            "?select=*&order=id.desc";


        if (isHome) {

            url =
                PRODUCTS_API +
                "?select=*&featured=eq.true&order=id.desc";

        }


        const response =
            await fetch(
                url,
                {
                    headers: {
                        "apikey": SUPABASE_KEY
                    }
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);

        }


        const products =
            await response.json();


        container.innerHTML = "";


        if (products.length === 0) {

            if (isHome) {

                container.innerHTML =
                    "<p>Գլխավոր էջում ցուցադրվող ապրանքներ դեռ չկան։</p>";

            } else {

                container.innerHTML =
                    "<p>Ապրանքներ դեռ չկան։</p>";

            }

            return;

        }


        products.forEach(function (product) {

            const card =
                document.createElement("div");

            card.className =
                "product-card";


            const images =
                getImages(product);


            let currentImage = 0;


            const imageBox =
                document.createElement("div");

            imageBox.className =
                "product-image";


            const image =
                document.createElement("img");

            image.src =
                images[0] || "";

            image.alt =
                product.name || "";


            imageBox.appendChild(image);


            if (images.length > 1) {

                const left =
                    document.createElement("button");

                left.className =
                    "gallery-arrow gallery-left";

                left.type =
                    "button";

                left.textContent =
                    "‹";


                const right =
                    document.createElement("button");

                right.className =
                    "gallery-arrow gallery-right";

                right.type =
                    "button";

                right.textContent =
                    "›";


                const counter =
                    document.createElement("span");

                counter.className =
                    "gallery-counter";

                counter.textContent =
                    "1/" + images.length;


                left.addEventListener(
                    "click",
                    function () {

                        currentImage--;

                        if (currentImage < 0) {
                            currentImage =
                                images.length - 1;
                        }

                        image.src =
                            images[currentImage];

                        counter.textContent =
                            (currentImage + 1) +
                            "/" +
                            images.length;

                    }
                );


                right.addEventListener(
                    "click",
                    function () {

                        currentImage++;

                        if (
                            currentImage >=
                            images.length
                        ) {
                            currentImage = 0;
                        }

                        image.src =
                            images[currentImage];

                        counter.textContent =
                            (currentImage + 1) +
                            "/" +
                            images.length;

                    }
                );


                imageBox.appendChild(left);
                imageBox.appendChild(right);
                imageBox.appendChild(counter);

            }


            const info =
                document.createElement("div");

            info.className =
                "product-info";


            const name =
                document.createElement("h3");

            name.textContent =
                product.name || "";


            const price =
                document.createElement("p");

            price.textContent =
                Number(product.price || 0) +
                " ֏";


            const button =
                document.createElement("button");

            button.type =
                "button";

            button.className =
                "add-cart";

            button.textContent =
                "🛒 Ավելացնել զամբյուղ";


            button.addEventListener(
                "click",
                function () {

                    if (
                        typeof addToCart ===
                        "function"
                    ) {

                        addToCart(
                            product.name,
                            Number(product.price || 0),
                            images[0] || ""
                        );

                    }

                }
            );


            info.appendChild(name);
            info.appendChild(price);
            info.appendChild(button);


            card.appendChild(imageBox);
            card.appendChild(info);


            container.appendChild(card);

        });

    }

    catch (error) {

        console.error(
            "PRODUCT LOAD ERROR:",
            error
        );


        container.innerHTML =
            "<p>❌ Չհաջողվեց բեռնել ապրանքները</p>";

    }

}



// =========================
// START
// =========================

document.addEventListener(
    "DOMContentLoaded",
    loadProducts
);
