// SEVOYAN Luxury - favorites.js

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function addToFavorites(name, price, image = "") {

    let favorites = getFavorites();

    const exists = favorites.find(item => item.name === name);

    if (exists) {
        alert("❤️ Ապրանքը արդեն սիրելիներում է");
        return;
    }

    favorites.push({
        name: name,
        price: price,
        image: image
    });

    saveFavorites(favorites);

    alert("❤️ Ապրանքը ավելացվեց սիրելիներում");
}

function renderFavorites() {

    const container = document.getElementById("favorites");

    if (!container) return;

    const favorites = getFavorites();

    if (favorites.length === 0) {
        container.innerHTML = "<h2>Սիրելի ապրանքներ դեռ չկան ❤️</h2>";
        return;
    }

    container.innerHTML = "";

    favorites.forEach((item, index) => {

        container.innerHTML += `
            <div class="product">

                <img src="${item.image}" alt="${item.name}">

                <h3>${item.name}</h3>

                <p>${Number(item.price).toLocaleString()} ֏</p>

                <button onclick="removeFavorite(${index})">
                    ❌ Ջնջել
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

document.addEventListener("DOMContentLoaded", function () {
    renderFavorites();
});
