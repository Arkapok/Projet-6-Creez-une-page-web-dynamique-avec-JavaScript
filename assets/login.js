function login(event) { 
    event.preventDefault();


    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        return;
    }
    
    fetchData("users/login", "POST", false, { email, password })
        .then(response => {
            //Get the token 
            const token = response.token;
            if (token) {    
                localStorage.setItem("token", token);
            }

            //return to main page 
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error("Login failed:", error);
        });
}

addEventListener("DOMContentLoaded", () => { 
    //Login on submit
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }
})