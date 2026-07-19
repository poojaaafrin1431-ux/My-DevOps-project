// ---------- Session Guard (sessionStorage-based) ----------
// Using sessionStorage instead of localStorage means the login
// automatically expires when the browser/tab is closed, so the
// app always opens on the Login page first, as requested.

(function () {
  if (!sessionStorage.getItem("userId")) {
    window.location.href = "login.html";
  }
})();

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

function getUserId() {
  return sessionStorage.getItem("userId");
}

function getUserName() {
  return sessionStorage.getItem("userName") || "";
}
