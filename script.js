document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (email === "admin@test.com" && password === "1234") {
                window.location.href = "menus.html";
            } else {
                document.getElementById("message").innerHTML =
                    "<div class='alert alert-danger'>Identifiants incorrects</div>";
            }
        });
    }

});