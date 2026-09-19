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

        const parsed = JSON.parse(product.image);

        if (Array.isArray(parsed)) {
            return parsed;
        }

    } catch (error) {
        // normal text image
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
            await fetch(url, {
                headers: {
                    "apikey": SUPABASE_KEY
                }
            });


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
                    "<p>Գլխավոր էջում ցուցադրվող ապրանքներ դեռ չկան։";

            } else {

                container.innerHTML =
                    "<p>Ապրանքներ դեռ չկան։";

            }

            return;
        }


        products.forEach(function (product) {

            const card =
                document.createElement("div");

            card.className =
                "product-card";


            // =========================
            // IMAGES
            // =========================

            const images =
                getImages(product);


            let currentImage = 0;


            const imageBox =
                document.createElement("div");

            imageBox.className =
                "product-image";


            // Նկարի շրջանակը
            imageBox.style.position =
                "relative";

            imageBox.style.width =
                "100%";

            imageBox.style.height =
                "380px";

            imageBox.style.overflow =
                "hidden";

            imageBox.style.display =
                "flex";

            imageBox.style.alignItems =
                "center";

            imageBox.style.justifyContent =
                "center";


            const image =
                document.createElement("img");


            image.src =
                images[0] || "";


            image.alt =
                product.name || "";


            // Նկարը չձգել
            image.style.width =
                "100%";

            image.style.height =
                "100%";

            image.style.objectFit =
                "cover";

            image.style.objectPosition =
                "center";

            image.style.display =
                "block";

            image.style.transition =
                "opacity 0.2s ease";


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


                // LEFT
                left.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        currentImage--;

                        if (currentImage < 0) {

                            currentImage =
                                images.length - 1;

                        }


                        image.style.opacity =
                            "0";


                        setTimeout(function () {

                            image.src =
                                images[currentImage];

                            image.style.opacity =
                                "1";

                        }, 100);


                        counter.textContent =
                            (currentImage + 1) +
                            "/" +
                            images.length;

                    }
                );


                // RIGHT
                right.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        currentImage++;


                        if (
                            currentImage >=
                            images.length
                        ) {

                            currentImage = 0;

                        }


                        image.style.opacity =
                            "0";


                        setTimeout(function () {

                            image.src =
                                images[currentImage];

                            image.style.opacity =
                                "1";

                        }, 100);


                        counter.textContent =
                            (currentImage + 1) +
                            "/" +
                            images.length;

                    }
                );


                // Սլաքների տեսք
                left.style.position =
                    "absolute";

                left.style.left =
                    "12px";

                left.style.top =
                    "50%";

                left.style.transform =
                    "translateY(-50%)";

                left.style.zIndex =
                    "5";

                left.style.width =
                    "42px";

                left.style.height =
                    "42px";

                left.style.borderRadius =
                    "50%";

                left.style.border =
                    "2px solid #D4AF37";

                left.style.background =
                    "rgba(0,0,0,0.65)";

                left.style.color =
                    "#D4AF37";

                left.style.fontSize =
                    "32px";

                left.style.cursor =
                    "pointer";


                right.style.position =
                    "absolute";

                right.style.right =
                    "12px";

                right.style.top =
                    "50%";

                right.style.transform =
                    "translateY(-50%)";

                right.style.zIndex =
                    "5";

                right.style.width =
                    "42px";

                right.style.height =
                    "42px";

                right.style.borderRadius =
                    "50%";

                right.style.border =
                    "2px solid #D4AF37";

                right.style.background =
                    "rgba(0,0,0,0.65)";

                right.style.color =
                    "#D4AF37";

                right.style.fontSize =
                    "32px";

                right.style.cursor =
                    "pointer";


                // Counter
                counter.style.position =
                    "absolute";

                counter.style.bottom =
                    "12px";

                counter.style.left =
                    "50%";

                counter.style.transform =
                    "translateX(-50%)";

                counter.style.zIndex =
                    "5";

                counter.style.padding =
                    "5px 12px";

                counter.style.borderRadius =
                    "20px";

                counter.style.background =
                    "rgba(0,0,0,0.7)";

                counter.style.color =
                    "#ffffff";

                counter.style.fontSize =
                    "14px";


                imageBox.appendChild(left);
                imageBox.appendChild(right);
                imageBox.appendChild(counter);

            }


            // =========================
            // PRODUCT INFO
            // =========================

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
