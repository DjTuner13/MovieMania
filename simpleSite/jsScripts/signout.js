document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sign-out").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior

    // Clear the user data from localStorage
    localStorage.removeItem("currentUser");

    // Redirect to the login page
    window.location.href = "login.html";
  });
});
