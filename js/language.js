const translations = {
  hy: {
    home: "Գլխավոր",
    shop: "Խանութ",
    favorites: "Սիրելիներ",
    cart: "Զամբյուղ",
    about: "Մեր մասին",
    contact: "Կապ",

    heroTitle: "Շքեղությունը վերաիմաստավորված",
    heroText: "Շքեղություն • Ոճ • Որակ",
    shopNow: "Դիտել հավաքածուն"
  },

  en: {
    home: "Home",
    shop: "Shop",
    favorites: "Favorites",
    cart: "Cart",
    about: "About",
    contact: "Contact",

    heroTitle: "Luxury Redefined",
    heroText: "Luxury • Style • Quality",
    shopNow: "View Collection"
  }
};

function changeLanguage(lang){

document.querySelector("#nav-home").textContent = translations[lang].home;
document.querySelector("#nav-shop").textContent = translations[lang].shop;
document.querySelector("#nav-favorites").textContent = translations[lang].favorites;
document.querySelector("#nav-cart").textContent = translations[lang].cart;
document.querySelector("#nav-about").textContent = translations[lang].about;
document.querySelector("#nav-contact").textContent = translations[lang].contact;

document.querySelector("#hero-title").textContent = translations[lang].heroTitle;
document.querySelector("#hero-text").textContent = translations[lang].heroText;
document.querySelector("#hero-button").textContent = translations[lang].shopNow;

localStorage.setItem("language", lang);

}

window.onload = function(){

const lang = localStorage.getItem("language") || "hy";
changeLanguage(lang);

};
