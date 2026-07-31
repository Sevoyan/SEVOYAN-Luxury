let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const container = document.getElementById("favorites");

function renderFavorites() {

    if (favorites.length === 0) {
        container.innerHTML = `
            <h2 style="text-align:center;width:100%;">
                ❤️ Սիրելի ապրանքներ դեռ չկան
            </h2>
        `;
        return;
    }

    container.innerHTML = "";

    favorites.forEach((product, index) => {

        container.innerHTML += `
        <div class="product">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.price}</p>

            <button onclick="removeFavorite(${index})">
                ❌ Հեռացնել
            </button>

        </div>
        `;

    });

}

function removeFavorite(index){

    favorites.splice(index,1);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    renderFavorites();

}

renderFavorites();
