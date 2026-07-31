const translations = {
  hy: {
    home: "Գլխավոր",
    shop: "Խանութ",
    favorites: "Սիրելիներ",
    cart: "Զամբյուղ",
    about: "Մեր մասին",
    contact: "Կապ",
    title: "Շքեղությունը վերաիմաստավորված",
    subtitle: "Շքեղություն • Ոճ • Որակ",
    button: "Դիտել հավաքածուն",
    featured: "Առաջարկվող ապրանքներ"
  },

  en: {
    home: "Home",
    shop: "Shop",
    favorites: "Favorites",
    cart: "Cart",
    about: "About",
    contact: "Contact",
    title: "Luxury Redefined",
    subtitle: "Luxury • Style • Quality",
    button: "Shop Now",
    featured: "Featured Products"
  }
};

function changeLanguage(lang) {
  localStorage.setItem("language", lang);
  location.reload();
}

window.onload = () => {
  const lang = localStorage.getItem("language") || "hy";
  const t = translations[lang];

  document.querySelectorAll("nav a")[0].textContent = t.home;
  document.querySelectorAll("nav a")[1].textContent = t.shop;
  document.querySelectorAll("nav a")[2].textContent = t.favorites;
  document.querySelectorAll("nav a")[3].textContent = t.cart;
  document.querySelectorAll("nav a")[4].textContent = t.about;
  document.querySelectorAll("nav a")[5].textContent = t.contact;

  document.querySelector(".hero-content h1").textContent = t.title;
  document.querySelector(".hero-content p").textContent = t.subtitle;
  document.querySelector(".btn").textContent = t.button;
  document.querySelector(".section-title").textContent = t.featured;
};
