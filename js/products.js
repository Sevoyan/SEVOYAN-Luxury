const SUPABASE_URL = "https://ultbqgkrckapevjllqwe.supabase.co";
const SUPABASE_KEY = "sb_publishable_N0wWlRo2NFdT_ifDgJhAYQ_Ol5yeIfW";

const PRODUCTS_API = SUPABASE_URL + "/rest/v1/products";

function getCurrentLanguage() {
    return localStorage.getItem("language") || "hy";
}

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
    } catch (error) {}

    return String(product.image)
        .split("\n")
        .map(function(item) {
            return item.trim();
        })
        .filter(function(item) {
            return item !== "";
        });
}

function getProductName(product) {
    const language = getCurrentLanguage();

    if (language === "en") {
        return product.name_en || product.name || "";
    }

    if (language === "ru") {
        return product.name_ru || product.name || "";
    }

    return product.name || "";
}

function getProductText(key) {
    const language = getCurrentLanguage();

    const texts = {
        hy: {
            addToCart: "🛒 Ավելացնել զամբյուղ",
            addFavorite: "❤️ Սիրելիներ",
            removeFavorite: "💔 Հեռացնել սիրելիներից",
            noProducts: "Ապրանքներ դեռ չկան։",
            noFeatured: "Գլխավոր էջում ցուցադրվող ապրանքներ դեռ չկան։",
            loadError: "❌ Չհաջողվեց բեռնել ապրանքները"
        },

        en: {
            addToCart: "🛒 Add to Cart",
            addFavorite: "❤️ Favorites",
            removeFavorite: "💔 Remove from Favorites",
            noProducts: "No products available yet.",
            noFeatured: "No featured products available yet.",
            loadError: "❌ Failed to load products"
        },

        ru: {
            addToCart: "🛒 Добавить в корзину",
            addFavorite: "❤️ Избранное",
            removeFavorite: "💔 Удалить из избранного",
            noProducts: "Товаров пока нет.",
            noFeatured: "На главной странице пока нет товаров.",
            loadError: "❌ Не удалось загрузить товары"
        }
    };

    return (texts[language] || texts.hy)[key];
}

function getProductLoadingText() {
    const language = getCurrentLanguage();

    if (language === "en") {
        return "Loading...";
    }

    if (language === "ru") {
        return "Загрузка...";
    }

    return "Բեռնվում է...";
}

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch (error) {
        return [];
    }
}

function isFavorite(productName) {
    const favorites = getFavorites();

    return favorites.some(function(item) {
        return item.name === productName;
    });
}

async function loadProducts() {
    const container = document.getElementById("products");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <p style="text-align:center;">
            ${getProductLoadingText()}
        </p>
    `;

    try {
        const path = window.location.pathname.toLowerCase();

        const isHome =
            path.endsWith("/") ||
            path.endsWith("/index.html") ||
            path.includes("/index.html");

        let url =
            PRODUCTS_API +
            "?select=*&order=id.desc";

        if (isHome) {
            url =
                PRODUCTS_API +
                "?select=*&featured=eq.true&order=id.desc";
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const products = await response.json();

        container.innerHTML = "";

        if (!products || products.length === 0) {
            const message =
                isHome
                    ? getProductText("noFeatured")
                    : getProductText("noProducts");

            container.innerHTML = `
                <p style="
                    width:100%;
                    text-align:center;
                    color:#D4AF37;
                    font-size:18px;
                ">
                    ${message}
                </p>
            `;

            return;
        }

        products.forEach(function(product) {
            createProductCard(product, container);
        });

    } catch (error) {
        console.error("PRODUCT LOAD ERROR:", error);

        container.innerHTML = `
            <p style="
                width:100%;
                text-align:center;
                color:#D4AF37;
                font-size:18px;
            ">
                ${getProductText("loadError")}
            </p>
        `;
    }
}

function createProductCard(product, container) {

    const card = document.createElement("div");

    card.className = "product-card";

    const images = getImages(product);

    let currentImage = 0;

    const imageBox = document.createElement("div");

    imageBox.className = "product-image";

    const image = document.createElement("img");

    image.src = images[0] || "";

    image.alt = getProductName(product);

    imageBox.appendChild(image);

    if (images.length > 1) {

        const left = document.createElement("button");

        left.type = "button";
        left.className = "gallery-arrow gallery-left";
        left.textContent = "‹";

        const right = document.createElement("button");

        right.type = "button";
        right.className = "gallery-arrow gallery-right";
        right.textContent = "›";

        const counter = document.createElement("span");

        counter.className = "gallery-counter";

        counter.textContent =
            "1/" + images.length;

        left.addEventListener("click", function(event) {

            event.preventDefault();
            event.stopPropagation();

            currentImage--;

            if (currentImage < 0) {
                currentImage = images.length - 1;
            }

            image.src = images[currentImage];

            counter.textContent =
                (currentImage + 1) + "/" + images.length;
        });

        right.addEventListener("click", function(event) {

            event.preventDefault();
            event.stopPropagation();

            currentImage++;

            if (currentImage >= images.length) {
                currentImage = 0;
            }

            image.src = images[currentImage];

            counter.textContent =
                (currentImage + 1) + "/" + images.length;
        });

        imageBox.appendChild(left);
        imageBox.appendChild(right);
        imageBox.appendChild(counter);
    }

    const info = document.createElement("div");

    info.className = "product-info";

    const name = document.createElement("h3");

    name.textContent =
        getProductName(product);

    const price = document.createElement("p");

    price.textContent =
        Number(product.price || 0).toLocaleString("hy-AM") + " ֏";

    /* =========================
       CART BUTTON
    ========================= */

    const cartButton = document.createElement("button");

    cartButton.type = "button";

    cartButton.className = "add-cart";

    cartButton.textContent =
        getProductText("addToCart");

    cartButton.addEventListener("click", function() {

        const productName =
            getProductName(product);

        const productPrice =
            Number(product.price || 0);

        const productImage =
            images[0] || "";

        if (typeof addToCart === "function") {

            addToCart(
                productName,
                productPrice,
                productImage
            );

        } else {

            console.error(
                "addToCart function is not available"
            );
        }
    });

    /* =========================
       FAVORITE BUTTON
    ========================= */

    const favoriteButton =
        document.createElement("button");

    favoriteButton.type = "button";

    favoriteButton.className =
        "favorite-button";

    function updateFavoriteButton() {

        if (isFavorite(getProductName(product))) {

            favoriteButton.textContent =
                getProductText("removeFavorite");

            favoriteButton.classList.add(
                "favorite-active"
            );

        } else {

            favoriteButton.textContent =
                getProductText("addFavorite");

            favoriteButton.classList.remove(
                "favorite-active"
            );
        }
    }

    updateFavoriteButton();

    favoriteButton.addEventListener(
        "click",
        function() {

            const productName =
                getProductName(product);

            const productPrice =
                Number(product.price || 0);

            const productImage =
                images[0] || "";

            if (typeof addToFavorites === "function") {

                addToFavorites(
                    productName,
                    productPrice,
                    productImage
                );

                setTimeout(
                    updateFavoriteButton,
                    100
                );

            } else {

                console.error(
                    "addToFavorites function is not available"
                );

                alert(
                    "Favorites system is not loaded."
                );
            }
        }
    );

    info.appendChild(name);

    info.appendChild(price);

    info.appendChild(cartButton);

    info.appendChild(favoriteButton);

    card.appendChild(imageBox);

    card.appendChild(info);

    container.appendChild(card);
}

document.addEventListener(
    "DOMContentLoaded",
    function() {
        loadProducts();
    }
);
