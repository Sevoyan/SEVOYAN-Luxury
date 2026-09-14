const SUPABASE_URL =
    "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const API_URL =
    SUPABASE_URL + "/rest/v1/products";


function getImages(imageValue) {

    if (!imageValue) return [];

    return imageValue
        .split(/\n|,/)
        .map(function(url) {
            return url.trim();
        })
        .filter(function(url) {
            return url !== "";
        });
}


async function loadProducts() {

    const container =
        document.getElementById("products");

    if (!container) return;

    container.innerHTML =
        "<p>Ապրանքները բեռնվում են...</p>";

    try {

        const response = await fetch(
            API_URL +
            "?select=name,price,image",
            {
                method: "GET",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization":
                        "Bearer " + SUPABASE_KEY,
                    "Content-Type":
                        "application/json"
                },

                cache: "no-store"
            }
        );

        const text = await response.text();

        if (!response.ok) {
            throw new Error(text);
        }

        const products = JSON.parse(text);

        container.innerHTML = "";

        if (!products.length) {

            container.innerHTML =
                "<p>Ապրանքներ դեռ չկան։</p>";

            return;
        }


        products.forEach(function(product) {

            const card =
                document.createElement("div");

            card.className =
                "product-card";


            // =========================
            // IMAGES
            // =========================

            const images =
                getImages(product.image);


            let currentImage = 0;


            const imageArea =
                document.createElement("div");

            imageArea.className =
                "product-image-slider";


            const mainImage =
                document.createElement("img");

            mainImage.className =
                "main-slider-image";

            mainImage.alt =
                product.name || "Ապրանք";


            // LEFT BUTTON

            const prevButton =
                document.createElement("button");

            prevButton.className =
                "slider-prev";

            prevButton.innerHTML = "‹";


            // RIGHT BUTTON

            const nextButton =
                document.createElement("button");

            nextButton.className =
                "slider-next";

            nextButton.innerHTML = "›";


            // COUNTER

            const counter =
                document.createElement("div");

            counter.className =
                "slider-counter";


            function showImage(index) {

                if (!images.length) {

                    mainImage.style.display =
                        "none";

                    counter.style.display =
                        "none";

                    prevButton.style.display =
                        "none";

                    nextButton.style.display =
                        "none";

                    return;
                }


                currentImage = index;


                if (currentImage < 0) {
                    currentImage =
                        images.length - 1;
                }


                if (
                    currentImage >=
                    images.length
                ) {
                    currentImage = 0;
                }


                mainImage.src =
                    images[currentImage];


                counter.textContent =
                    (currentImage + 1) +
                    " / " +
                    images.length;


                if (images.length <= 1) {

                    prevButton.style.display =
                        "none";

                    nextButton.style.display =
                        "none";

                    counter.style.display =
                        "none";

                } else {

                    prevButton.style.display =
                        "flex";

                    nextButton.style.display =
                        "flex";

                    counter.style.display =
                        "block";
                }
            }


            prevButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    showImage(
                        currentImage - 1
                    );
                }
            );


            nextButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    showImage(
                        currentImage + 1
                    );
                }
            );


            // SWIPE PHONE / TOUCHSCREEN

            let startX = 0;

            mainImage.addEventListener(
                "touchstart",
                function(event) {

                    startX =
                        event.touches[0].clientX;
                }
            );


            mainImage.addEventListener(
                "touchend",
                function(event) {

                    const endX =
                        event.changedTouches[0]
                            .clientX;

                    const difference =
                        startX - endX;


                    if (
                        Math.abs(difference) >
                        50
                    ) {

                        if (difference > 0) {

                            showImage(
                                currentImage + 1
                            );

                        } else {

                            showImage(
                                currentImage - 1
                            );
                        }
                    }
                }
            );


            imageArea.appendChild(
                mainImage
            );

            imageArea.appendChild(
                prevButton
            );

            imageArea.appendChild(
                nextButton
            );

            imageArea.appendChild(
                counter
            );


            // =========================
            // NAME
            // =========================

            const name =
                document.createElement("h3");

            name.textContent =
                product.name ||
                "Ապրանք";


            // =========================
            // PRICE
            // =========================

            const price =
                document.createElement("p");

            price.textContent =
                (
                    product.price || 0
                ) + " ֏";


            // =========================
            // CART
            // =========================

            const button =
                document.createElement("button");

            button.textContent =
                "🛒 Ավելացնել զամբյուղ";


            button.addEventListener(
                "click",
                function() {

                    if (
                        typeof addToCart ===
                        "function"
                    ) {

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


            card.appendChild(
                imageArea
            );

            card.appendChild(
                name
            );

            card.appendChild(
                price
            );

            card.appendChild(
                button
            );


            container.appendChild(
                card
            );


            // FIRST IMAGE

            showImage(0);

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
