// SEVOYAN Luxury - Favorites

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch (error) {
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}


// ============================
// ADD TO FAVORITES
// ============================

function addToFavorites(name, price, image) {

    let favorites = getFavorites();

    const exists = favorites.find(function(item) {
        return item.name === name;
    });

    if (exists) {

        const lang =
            localStorage.getItem("language") || "hy";

        const messages = {
            hy: "❤️ Այս ապրանքն արդեն Սիրելիներում է",
            en: "❤️ This product is already in Favorites",
            ru: "❤️ Этот товар уже в Избранном"
        };

        alert(messages[lang] || messages.hy);

        return;
    }

    favorites.push({
        name: name,
        price: Number(price) || 0,
        image: image || ""
    });

    saveFavorites(favorites);

    const lang =
        localStorage.getItem("language") || "hy";

    const messages = {
        hy: "❤️ Ապրանքը ավելացվեց Սիրելիներում",
        en: "❤️ Product added to Favorites",
        ru: "❤️ Товар добавлен в Избранное"
    };

    alert(messages[lang] || messages.hy);

    renderFavorites();
}


// ============================
// REMOVE
// ============================

function removeFavorite(index) {

    let favorites = getFavorites();

    favorites.splice(index, 1);

    saveFavorites(favorites);

    renderFavorites();
}


// ============================
// RENDER
// ============================

function renderFavorites() {

    const container =
        document.getElementById("favorites");

    if (!container) {
        return;
    }

    const favorites = getFavorites();

    const lang =
        localStorage.getItem("language") || "hy";


    if (favorites.length === 0) {

        const emptyText = {

            hy: "❤️ Սիրելիներում ապրանքներ դեռ չկան",

            en: "❤️ No favorite products yet",

            ru: "❤️ В Избранном пока нет товаров"

        };

        container.innerHTML = `
            <div class="favorites-empty">
                ${emptyText[lang] || emptyText.hy}
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    favorites.forEach(function(item, index) {

        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${item.image || ""}"
                    alt="${item.name || ""}"
                >

            </div>


            <div class="product-info">

                <h3>
                    ${item.name || ""}
                </h3>

                <p>
                    ${Number(item.price || 0)} ֏
                </p>

                <button
                    type="button"
                    class="add-cart favorite-remove"
                    data-index="${index}"
                >
                    ${getFavoriteRemoveText(lang)}
                </button>

            </div>
        `;


        container.appendChild(card);

    });


    container
        .querySelectorAll(".favorite-remove")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const index =
                        Number(button.dataset.index);

                    removeFavorite(index);

                }
            );

        });

}


// ============================
// TEXT
// ============================

function getFavoriteRemoveText(lang) {

    const texts = {

        hy: "❌ Հեռացնել",

        en: "❌ Remove",

        ru: "❌ Удалить"

    };

    return texts[lang] || texts.hy;
}


// ============================
// LANGUAGE CHANGE SUPPORT
// ============================

function loadFavorites() {
    renderFavorites();
}


// ============================
// START
// ============================

document.addEventListener(
    "DOMContentLoaded",
    function() {
        renderFavorites();
    }
);
