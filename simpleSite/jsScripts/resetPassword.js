// resetPassword.js
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const resetEmail = urlParams.get("email");
  
    if (resetEmail) {
      document.getElementById("resetEmail").value = resetEmail;
    }
  });
  
  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const resetEmail = document.getElementById("resetEmail").value;
      const newPassword = document.getElementById("newPassword").value;
  
      try {
        // Fetch existing data from JSONbin
        const binId = `${config.BIN_ID}`;
        const apiKey = `${config.JSON_API_KEY}`;
        const jsonbinUrl = `https://api.jsonbin.io/v3/b/${binId}?meta=false`;
  
        const existingDataResponse = await fetch(jsonbinUrl, {
          method: "GET",
          headers: {
            "X-Master-Key": apiKey,
            "Content-Type": "application/json",
          },
        });
  
        if (!existingDataResponse.ok) {
          throw new Error("Failed to fetch existing data.");
        }
  
        const existingData = await existingDataResponse.json();
  
        // Check if the fetched data is an array, if not, initialize it as an array
        if (!Array.isArray(existingData)) {
          throw new Error("Data is not in expected format.");
        }
  
        // Find user by email
        const user = existingData.find((user) => user.email === resetEmail);
  
        if (user) {
          // Update the user's password
          user.password = newPassword;
  
          // Save the updated data
          const updateResponse = await fetch(jsonbinUrl, {
            method: "PUT",
            headers: {
              "X-Master-Key": apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(existingData),
          });
  
          if (updateResponse.ok) {
            alert("Password reset successfully!");
            // Redirect to the login page
            window.location.href = "login.html";
          } else {
            alert("Failed to reset password.");
          }
        } else {
          alert("Account not found.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while resetting the password.");
      }
    });
  