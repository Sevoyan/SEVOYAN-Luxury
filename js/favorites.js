// SEVOYAN Luxury - favorites.js

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}


function saveFavorites(favorites) {
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
}


function addToFavorites(name, price, image) {

    let favorites = getFavorites();

    const exists = favorites.find(
        item => item.name === name
    );

    if (exists) {

        alert("❤️ Այս ապրանքն արդեն սիրելիներում է");

        return;
    }

    favorites.push({
        name: name,
        price: price,
        image: image
    });

    saveFavorites(favorites);

    alert("❤️ Ապրանքը ավելացվեց սիրելիներին");
}


function renderFavorites() {

    const container =
        document.getElementById("favorites");

    // Shop էջում container չկա
    if (!container) return;

    const favorites = getFavorites();

    if (favorites.length === 0) {

        container.innerHTML = `
            <div style="
                width:100%;
                text-align:center;
                padding:60px;
            ">

                <h2>
                    ❤️ Սիրելիներ դեռ չկան
                </h2>

                <br>

                <a href="shop.html" class="btn btn-gold">
                    Գնալ խանութ
                </a>

            </div>
        `;

        return;
    }


    container.innerHTML = "";


    favorites.forEach((item, index) => {

        container.innerHTML += `

            <div class="product">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${Number(item.price).toLocaleString()} ֏
                </p>

                <button
                    onclick="removeFavorite(${index})">

                    ❌ Հեռացնել

                </button>

            </div>

        `;

    });

}


function removeFavorite(index) {

    let favorites = getFavorites();

    favorites.splice(index, 1);

    saveFavorites(favorites);

    renderFavorites();
}


document.addEventListener(
    "DOMContentLoaded",
    renderFavorites
);
