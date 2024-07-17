document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.firstName) {
    const firstName =
      currentUser.firstName.charAt(0).toUpperCase() +
      currentUser.firstName.slice(1);
    document.getElementById("user-first-name").textContent = firstName;
  } else {
    console.error("User not found in localStorage.");
  }
});
