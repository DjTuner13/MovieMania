document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.firstName) {
    document.getElementById("user-first-name").textContent =
      currentUser.firstName;
  } else {
    console.error("User not found in localStorage.");
  }
});
