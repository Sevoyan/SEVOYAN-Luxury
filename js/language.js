// =========================
// LANGUAGE SYSTEM
// =========================

function changeLanguage(language) {

    localStorage.setItem(
        "language",
        language
    );


    document.documentElement.lang =
        language;


    updateLanguageButtons();


    // Եթե ապրանքների էջ է
    if (
        typeof loadProducts ===
        "function"
    ) {

        loadProducts();

    }

}


// =========================
// LANGUAGE BUTTONS
// =========================

function updateLanguageButtons() {

    const language =
        localStorage.getItem("language") ||
        "hy";


    const hy =
        document.getElementById(
            "lang-hy"
        );

    const en =
        document.getElementById(
            "lang-en"
        );

    const ru =
        document.getElementById(
            "lang-ru"
        );


    if (hy) {

        hy.style.opacity =
            language === "hy"
                ? "1"
                : "0.5";

    }


    if (en) {

        en.style.opacity =
            language === "en"
                ? "1"
                : "0.5";

    }


    if (ru) {

        ru.style.opacity =
            language === "ru"
                ? "1"
                : "0.5";

    }

}


// =========================
// START
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const language =
            localStorage.getItem(
                "language"
            ) || "hy";


        document.documentElement.lang =
            language;


        updateLanguageButtons();

    }
);
