const SUPABASE_URL =
    "https://ultbqgkrckapevjllqwe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const PRODUCTS_API =
    SUPABASE_URL + "/rest/v1/products";

const COLLECTIONS_API =
    SUPABASE_URL + "/rest/v1/collections";


// ==================================================
// IMAGE PARSER
// ==================================================

function getImages(value) {

    if (!value) {
        return [];
    }


    if (Array.isArray(value)) {

        return value
            .map(function(url) {
                return String(url).trim();
            })
            .filter(function(url) {
                return url !== "";
            });
    }


    const text =
        String(value).trim();


    if (!text) {
        return [];
    }


    // JSON ARRAY
    if (text.startsWith("[")) {

        try {

            const parsed =
                JSON.parse(text);


            if (Array.isArray(parsed)) {

                return parsed
                    .map(function(url) {
                        return String(url).trim();
                    })
                    .filter(function(url) {
                        return url !== "";
                    });
            }

        } catch (error) {

            console.log(
                "Image JSON error:",
                error
            );
        }
    }


    // NEW LINES
    if (text.includes("\n")) {

        return text
            .split("\n")
            .map(function(url) {
                return url.trim();
            })
            .filter(function(url) {
                return url !== "";
            });
    }


    // COMMA
    if (text.includes(",")) {

        return text
            .split(",")
            .map(function(url) {
                return url.trim();
            })
            .filter(function(url) {
                return url !== "";
            });
    }


    return [text];
}


// ==================================================
// HEADERS
// ==================================================

function getPublicHeaders() {

    return {
        "apikey": SUPABASE_KEY,
        "Authorization":
            "Bearer " + SUPABASE_KEY,
        "Content-Type":
            "application/json"
    };
}


// ==================================================
// PRODUCT IMAGE SLIDER
// ==================================================

function createImageSlider(
    images,
    name
) {

    const imageArea =
        document.createElement("div");

    imageArea.className =
        "product-image-slider";


    const mainImage =
        document.createElement("img");

    mainImage.className =
        "main-slider-image";

    mainImage.alt =
        name || "Ապրանք";


    const prevButton =
        document.createElement("button");

    prevButton.type =
        "button";

    prevButton.className =
        "slider-prev";

    prevButton.innerHTML =
        "‹";


    const nextButton =
        document.createElement("button");

    nextButton.type =
        "button";

    nextButton.className =
        "slider-next";

    nextButton.innerHTML =
        "›";


    const counter =
        document.createElement("div");

    counter.className =
        "slider-counter";


    let currentImage = 0;


    function showImage(index) {

        if (!images.length) {

            mainImage.style.display =
                "none";

            prevButton.style.display =
                "none";

            nextButton.style.display =
                "none";

            counter.style.display =
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

            event.preventDefault();
            event.stopPropagation();

            showImage(
                currentImage - 1
            );
        }
    );


    nextButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            showImage(
                currentImage + 1
            );
        }
    );


    let startX = 0;


    mainImage.addEventListener(
        "touchstart",
        function(event) {

            if (
                event.touches &&
                event.touches.length
            ) {

                startX =
                    event.touches[0].clientX;
            }
        },
        { passive: true }
    );


    mainImage.addEventListener(
        "touchend",
        function(event) {

            if (
                !event.changedTouches ||
                !event.changedTouches.length
            ) {

                return;
            }


            const endX =
                event.changedTouches[0].clientX;


            const difference =
                startX - endX;


            if (
                Math.abs(difference) > 50
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

        },
        { passive: true }
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


    showImage(0);


    return imageArea;
}


// ==================================================
// ADD CART BUTTON
// ==================================================

function createCartButton(
    name,
    price,
    image
) {

    const button =
        document.createElement("button");


    button.type =
        "button";


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
                    name,
                    price,
                    image || ""
                );

            } else {

                alert(
                    "❌ Զամբյուղը չի միացել"
                );
            }

        }
    );


    return button;
}


// ==================================================
// LOAD PRODUCTS
// ==================================================

async function loadProducts() {

    const container =
        document.getElementById(
            "products"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Ապրանքները բեռնվում են...</p>";


    try {

        const response =
            await fetch(
                PRODUCTS_API +
                "?select=*&order=id.desc",
                {
                    method: "GET",
                    headers:
                        getPublicHeaders(),
                    cache:
                        "no-store"
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text
            );
        }


        const products =
            JSON.parse(text);


        container.innerHTML =
            "";


        if (!products.length) {

            container.innerHTML =
                "<p>Ապրանքներ դեռ չկան։</p>";

            return;
        }


        products.forEach(
            function(product) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "product-card";


                const images =
                    getImages(
                        product.image
                    );


                const imageArea =
                    createImageSlider(
                        images,
                        product.name
                    );


                const name =
                    document.createElement(
                        "h3"
                    );


                name.textContent =
                    product.name ||
                    "Ապրանք";


                const price =
                    document.createElement(
                        "p"
                    );


                price.textContent =
                    (product.price || 0) +
                    " ֏";


                const button =
                    createCartButton(
                        product.name,
                        product.price,
                        product.image
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

            }
        );


    } catch (error) {

        console.error(
            "PRODUCTS ERROR:",
            error
        );


        container.innerHTML =
            "<p>❌ Չհաջողվեց բեռնել ապրանքները</p>" +
            "<small>" +
            error.message +
            "</small>";
    }
}


// ==================================================
// LOAD COLLECTIONS
// ==================================================

async function loadCollections() {

    const container =
        document.getElementById(
            "collections"
        );


    if (!container) {

        console.log(
            "Collections container not found"
        );

        return;
    }


    container.innerHTML =
        "<p>Հավաքածուները բեռնվում են...</p>";


    try {

        const response =
            await fetch(
                COLLECTIONS_API +
                "?select=*&order=id.desc",
                {
                    method: "GET",
                    headers:
                        getPublicHeaders(),
                    cache:
                        "no-store"
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text
            );
        }


        const collections =
            JSON.parse(text);


        container.innerHTML =
            "";


        if (!collections.length) {

            container.innerHTML =
                "<p>Հավաքածուներ դեռ չկան։</p>";

            return;
        }


        collections.forEach(
            function(collection) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "product-card";


                const images =
                    getImages(
                        collection.images
                    );


                const imageArea =
                    createImageSlider(
                        images,
                        collection.name
                    );


                const name =
                    document.createElement(
                        "h3"
                    );


                name.textContent =
                    collection.name ||
                    "Հավաքածու";


                const price =
                    document.createElement(
                        "p"
                    );


                price.textContent =
                    (collection.price || 0) +
                    " ֏";


                const imageCount =
                    document.createElement(
                        "small"
                    );


                imageCount.textContent =
                    "🖼️ " +
                    images.length +
                    " նկար";


                const firstImage =
                    images.length
                    ? images[0]
                    : "";


                const button =
                    createCartButton(
                        collection.name,
                        collection.price,
                        firstImage
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
                    imageCount
                );


                card.appendChild(
                    button
                );


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "COLLECTIONS ERROR:",
            error
        );


        container.innerHTML =
            "<p>❌ Չհաջողվեց բեռնել հավաքածուները</p>" +
            "<small>" +
            error.message +
            "</small>";
    }
}


// ==================================================
// ZOOM
// ==================================================

document.addEventListener(
    "click",
    function(event) {

        const image =
            event.target.closest(
                ".main-slider-image"
            );


        if (!image) {
            return;
        }


        const slider =
            image.closest(
                ".product-image-slider"
            );


        if (!slider) {
            return;
        }


        slider.classList.toggle(
            "zoomed"
        );
    }
);


// ==================================================
// START
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadProducts();

        loadCollections();

    }
);
