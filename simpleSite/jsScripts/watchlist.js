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

  watchlist.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.className = "movie-card";

    movieElement.innerHTML = `
      <img src="${movie.moviePreviewUrl}" alt="${movie.movieInfo}" data-id="${movie.movieID}">
      <div class="movie-info">
        <h3>${movie.movieID}</h3>
        <p>${movie.movieInfo}</p>
        <button class="delete-button" data-id="${movie.movieID}">Delete</button>
      </div>
    `;

    movieElement.querySelector("img").addEventListener("click", function () {
      const movieId = this.getAttribute("data-id");
      window.location.href = `movie.html?id=${movieId}`;
    });

    movieElement
      .querySelector(".delete-button")
      .addEventListener("click", function () {
        const movieId = this.getAttribute("data-id");
        deleteMovieFromWatchlist(movieId);
      });

    watchlistContainer.appendChild(movieElement);
  });
}

async function deleteMovieFromWatchlist(movieId) {
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
        (movie) => movie.movieID !== parseInt(movieId)
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
        alert("Failed to remove movie from watchlist.");
      }
    } else {
      alert("User not found.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while removing the movie from the watchlist.");
  }
}

document.addEventListener("DOMContentLoaded", fetchUserWatchlist);
