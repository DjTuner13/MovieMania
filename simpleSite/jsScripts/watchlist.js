async function fetchUserWatchlist() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.email) {
    console.error("User not found or not logged in.");
    return;
  }

  try {
    const binId = config.BIN_ID;
    const apiKey = config.JSON_API_KEY;
    const jsonbinUrl = `https://api.jsonbin.io/v3/b/${binId}?meta=false`;

    const response = await fetch(jsonbinUrl, {
      method: "GET",
      headers: {
        "X-Master-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch existing data.");
    }

    const data = await response.json();
    const user = data.record.find((u) => u.email === currentUser.email);

    if (user && user.watchMovieList) {
      displayWatchlist(user.watchMovieList);
    } else {
      console.log("No watchlist found for this user.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function displayWatchlist(watchlist) {
  const watchlistContainer = document.getElementById("watchlist-container");
  watchlistContainer.innerHTML = "";

  watchlist.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "movie-card";

    const title = item.mediaTitle || "No Title";
    const info = item.mediaInfo || "No Info";

    itemElement.innerHTML = `
      <img src="${item.mediaPreviewUrl}" alt="${info}" data-id="${item.mediaID}" data-type="${item.mediaType}">
      <div class="movie-info">
        <h3>${title}</h3>
        <p>${info}</p>
        <button class="delete-button" data-id="${item.mediaID}" data-type="${item.mediaType}">Delete</button>
      </div>
    `;

    itemElement.querySelector("img").addEventListener("click", function () {
      const mediaId = this.getAttribute("data-id");
      const mediaType = this.getAttribute("data-type");
      window.location.href = `movie.html?id=${mediaId}&media_type=${mediaType}`;
    });

    itemElement
      .querySelector(".delete-button")
      .addEventListener("click", function () {
        const mediaId = this.getAttribute("data-id");
        const mediaType = this.getAttribute("data-type");
        deleteMovieFromWatchlist(mediaId, mediaType);
      });

    watchlistContainer.appendChild(itemElement);
  });
}

async function deleteMovieFromWatchlist(mediaId, mediaType) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.email) {
    alert("You must be logged in to manage your watchlist.");
    return;
  }

  try {
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

    const data = await existingDataResponse.json();
    const user = data.record.find((u) => u.email === currentUser.email);

    if (user) {
      user.watchMovieList = user.watchMovieList.filter(
        (item) => item.mediaID !== parseInt(mediaId) || item.mediaType !== mediaType
      );

      const updateResponse = await fetch(jsonbinUrl, {
        method: "PUT",
        headers: {
          "X-Master-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ record: data.record }),
      });

      if (updateResponse.ok) {
        fetchUserWatchlist();
      } else {
        alert("Failed to remove item from watchlist.");
      }
    } else {
      alert("User not found.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while removing the item from the watchlist.");
  }
}

document.addEventListener("DOMContentLoaded", fetchUserWatchlist);
