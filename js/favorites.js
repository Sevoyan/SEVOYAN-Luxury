function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function addToFavorites(name, price, image = "") {
    const favorites = getFavorites();

    const index = favorites.findIndex(item => item.name === name);

    if (index === -1) {
        favorites.push({
            name: name,
            price: price,
            image: image
        });

        saveFavorites(favorites);

        alert("❤️ Ապրանքը ավելացվեց ընտրյալների մեջ");
    } else {
        favorites.splice(index, 1);

        saveFavorites(favorites);

        alert("💔 Ապրանքը հեռացվեց ընտրյալներից");
    }
}
function removeFavorite(index) {
    const favorites = getFavorites();

    favorites.splice(index, 1);

    saveFavorites(favorites);

    renderFavorites();
}

function renderFavorites() {
    const container = document.getElementById("favorites");

    if (!container) return;

    const favorites = getFavorites();

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                ❤️ Սիրելիների ցանկը դատարկ է
            </div>
        `;
        return;
    }

    let html = "";

    favorites.forEach((item, index) => {

        html += `
            <div class="product-card">

                ${item.image ? `
                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        style="width:100%; max-width:250px;"
                    >
                ` : ""}

                <h3>${item.name}</h3>

                <p>
                    Գին՝ ${Number(item.price).toLocaleString()} ֏
                </p>

                <button onclick="removeFavorite(${index})">
                    🗑️ Ջնջել
                </button>

            </div>
        `;
    });

    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", renderFavorites);
