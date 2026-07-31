document.getElementById("login-form").addEventListener("submit", function(e){

    e.preventDefault();

    const username = document.getElementById("username").value;

    localStorage.setItem("user", username);

    alert("Բարի գալուստ, " + username + "!");

    window.location.href = "index.html";

});
