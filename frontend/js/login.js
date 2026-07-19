document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("errorBox");
  errorBox.style.display = "none";

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // sessionStorage clears when the browser/tab closes, so the
      // app always requires login again on the next visit.
      sessionStorage.setItem("userId", data.userId);
      sessionStorage.setItem("userName", data.name);
      window.location.href = "index.html";
    } else {
      errorBox.textContent = data.error || "Login failed";
      errorBox.style.display = "block";
    }
  } catch (err) {
    errorBox.textContent = "Could not reach the server. Please try again.";
    errorBox.style.display = "block";
  }
});
