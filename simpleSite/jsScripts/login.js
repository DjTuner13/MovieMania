document
  .getElementById("loginFormElem")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;

    // Debug logs to check captured values
    console.log(`Captured Email: ${loginEmail}`);
    console.log(`Captured Password: ${loginPassword}`);

    try {
      // Fetch existing data from JSONbin
      const binId = config.BIN_ID;
      const apiKey = config.JSON_API_KEY;
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
      const records = existingData.record;
      if (!Array.isArray(records)) {
        throw new Error("Data is not in expected format.");
      }

      // Find user by email
      const user = records.find((user) => user.email === loginEmail);

      if (user) {
        // Log the passwords for debugging
        console.log(`Password from database: ${user.loginPassword}`);
        console.log(`Entered password: ${loginPassword}`);

        // Check if the user has a password
        if (!user.loginPassword) {
          alert(
            "Account needs a password. Redirecting to reset password page."
          );
          // Redirect to the reset password page with email as a query parameter
          window.location.href = `resetPassword.html?email=${encodeURIComponent(
            loginEmail
          )}`;
        } else if (user.loginPassword === loginPassword) {
          alert("Login successful!");
          // Redirect to topMovies.html after successful login
          window.location.href = "topMovies.html";
        } else {
          alert(
            `Invalid email or password. Should be ${user.loginPassword} but is ${loginPassword}`
          );
        }
      } else {
        alert("Account not found.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while logging in.");
    }
  });
