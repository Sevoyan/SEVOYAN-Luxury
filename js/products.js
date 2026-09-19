const SUPABASE_URL =
    "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const PRODUCTS_API =
    SUPABASE_URL + "/rest/v1/products";


// =========================
// CURRENT LANGUAGE
// =========================

function getCurrentLanguage() {

    return localStorage.getItem("language") || "hy";

}


// =========================
// PRODUCT NAME
// =========================

function getProductName(product) {

    const language =
        getCurrentLanguage();


    if (
        language === "en" &&
        product.name_en &&
        product.name_en.trim() !== ""
    ) {

        return product.name_en;

    }


    if (
        language === "ru" &&
        product.name_ru &&
        product.name_ru.trim() !== ""
    ) {

        return product.name_ru;

    }


    return product.name || "";

}


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
// TRANSLATED TEXT
// =========================

function getText(key) {

    const language =
        getCurrentLanguage();


    const texts = {

        hy: {

            addCart:
                "🛒 Ավելացնել զամբյուղ",

            noProducts:
                "Ապրանքներ դեռ չկան։",

            noHomeProducts:
                "Գլխավոր էջում ցուցադրվող ապրանքներ դեռ չկան։"

        },


        en: {

            addCart:
                "🛒 Add to cart",

            noProducts:
                "No products yet.",

            noHomeProducts:
                "No featured products yet."

        },


        ru: {

            addCart:
                "🛒 Добавить в корзину",

            noProducts:
                "Товаров пока нет.",

            noHomeProducts:
                "Избранных товаров пока нет."

        }

    };


    return texts[language][key] ||
           texts.hy[key];

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
            window.location.pathname.endsWith(
                "/SEVOYAN-Luxury/"
            );


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
                        "apikey":
                            SUPABASE_KEY
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

            container.innerHTML =
                "<p>" +
                (
                    isHome
                        ? getText("noHomeProducts")
                        : getText("noProducts")
                ) +
                "</p>";

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
                getProductName(product);


            imageBox.appendChild(image);


            // =========================
            // GALLERY
            // =========================

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


            // =========================
            // INFO
            // =========================

            const info =
                document.createElement("div");

            info.className =
                "product-info";


            const name =
                document.createElement("h3");

            name.textContent =
                getProductName(product);


            const price =
                document.createElement("p");

            price.textContent =
                Number(
                    product.price || 0
                ) +
                " ֏";


            const button =
                document.createElement("button");

            button.type =
                "button";

            button.className =
                "add-cart";

            button.textContent =
                getText("addCart");


            button.addEventListener(
                "click",
                function () {

                    if (
                        typeof addToCart ===
                        "function"
                    ) {

                        addToCart(
                            getProductName(product),
                            Number(
                                product.price || 0
                            ),
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
