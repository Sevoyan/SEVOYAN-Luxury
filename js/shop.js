const products = [
{
nameHY:"Պրեմիում շապիկ",
nameEN:"Premium T-Shirt",
price:"23 900 ֏",
image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
},
{
nameHY:"Շքեղ սպորտային կոշիկներ",
nameEN:"Luxury Sneakers",
price:"74 900 ֏",
image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
},
{
nameHY:"Պայուսակ",
nameEN:"Luxury Bag",
price:"89 900 ֏",
image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"
},
{
nameHY:"Բաճկոն",
nameEN:"Premium Jacket",
price:"59 900 ֏",
image:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600"
},
{
nameHY:"Գլխարկ",
nameEN:"Cap",
price:"14 900 ֏",
image:"https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600"
},
{
nameHY:"Հուդի",
nameEN:"Luxury Hoodie",
price:"39 900 ֏",
image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"
}
];

const container=document.getElementById("products");
const search=document.getElementById("search");

function render(list){

container.innerHTML="";

list.forEach(product=>{

container.innerHTML+=`
<div class="product">

<img src="${product.image}" alt="${product.nameHY}">

<h3>${product.nameHY}</h3>

<p>${product.price}</p>

<div class="product-buttons">
    <button onclick="addToCart(${products.indexOf(product)})">
        🛒 Ավելացնել զամբյուղ
    </button>

    <button onclick="addToFavorites(${products.indexOf(product)})">
        ❤️ Սիրելիներ
    </button>
</div>

</div>
`;
});

}

render(products);

search.addEventListener("input",()=>{

const value=search.value.toLowerCase();

const filtered=products.filter(product=>

product.nameHY.toLowerCase().includes(value) ||
product.nameEN.toLowerCase().includes(value)

);

render(filtered);

});
