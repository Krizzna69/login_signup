const apiUrl = "http://localhost:5000";

// Function to toggle between Login and Register forms
function toggleForms() {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

    if (registerForm.style.display === "none") {
        registerForm.style.display = "block";
        loginForm.style.display = "none";
    } else {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
    }
}

// Registration form submission
document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("reg-password").value.trim();

    try {
        const response = await fetch(`${apiUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            toggleForms(); // Switch to login form
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert("Error connecting to the server.");
    }
});

// Login form submission
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            // Redirect to a dashboard or landing page
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert("Error connecting to the server.");
    }
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store user details in session storage
            sessionStorage.setItem('userDetails', JSON.stringify(data.user));
            alert(data.message);
            window.location.href = '/landing.html'; // Redirect to the landing page
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert("Error connecting to the server.");
    }
});
