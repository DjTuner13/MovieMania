document
  .getElementById("createForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("createEmail").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const loginPassword = document.getElementById("createPassword").value;
    const newAccount = {
      email,
      firstName,
      lastName,
      loginPassword,
      watchMovieList: [],
    };

    try {
      const binId = config.BIN_ID;
      const apiKey = config.JSON_API_KEY;
      const url = `https://api.jsonbin.io/v3/b/${binId}?meta=false`;

      // Fetch existing data
      const existingDataResponse = await fetch(url, {
        method: "GET",
        headers: {
          "X-Master-Key": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!existingDataResponse.ok) {
        throw new Error("Failed to fetch existing data.");
      }

      let existingData = await existingDataResponse.json();

      // Ensure the data is in the expected format
      let records = existingData.record;
      if (!Array.isArray(records)) {
        records = [];
      }

      // Add new account to existing data
      records.push(newAccount);

      // Update the bin with the new data
      const updateResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "X-Master-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ record: records }),
      });

      if (updateResponse.status === 200) {
        alert("Account created successfully!");
        // Clear the form
        document.getElementById("createForm").reset();
      } else {
        alert("Failed to create account.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the account.");
    }
  });
