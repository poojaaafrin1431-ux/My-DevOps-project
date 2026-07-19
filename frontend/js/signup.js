document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorBox = document.getElementById("errorBox");
  errorBox.style.display = "none";

  if (password !== confirmPassword) {
    errorBox.textContent = "Passwords do not match!";
    errorBox.style.display = "block";
    return;
  }

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem("userId", data.userId);
      sessionStorage.setItem("userName", data.name);
      window.location.href = "index.html";
    } else {
      errorBox.textContent = data.error || "Signup failed";
      errorBox.style.display = "block";
    }
  } catch (err) {
    errorBox.textContent = "Could not reach the server. Please try again.";
    errorBox.style.display = "block";
  }
});
