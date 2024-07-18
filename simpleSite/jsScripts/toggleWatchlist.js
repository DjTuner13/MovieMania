document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mediaId = urlParams.get("id");
  const mediaType = urlParams.get("media_type"); // Either 'movie' or 'tv'
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.email) {
    alert("You must be logged in to manage your watchlist.");
    return;
  }

  const toggleWatchlistButton = document.getElementById("toggle-watchlist");

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

    if (!user) {
      throw new Error("User not found.");
    }

    const itemExists = user.watchMovieList.some(
      (item) =>
        item.mediaID === parseInt(mediaId) && item.mediaType === mediaType
    );

    if (itemExists) {
      toggleWatchlistButton.textContent = "Remove from Watchlist";
    } else {
      toggleWatchlistButton.textContent = "Add to Watchlist";
    }

    toggleWatchlistButton.addEventListener("click", async () => {
      if (itemExists) {
        user.watchMovieList = user.watchMovieList.filter(
          (item) =>
            item.mediaID !== parseInt(mediaId) || item.mediaType !== mediaType
        );
      } else {
        const mediaDetailsApiUrl = `https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${config.API_KEY}`;
        const response = await fetch(mediaDetailsApiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${config.BEARER_TOKEN}`,
            accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch media details.");
        }

        const data = await response.json();
        const mediaDetails = {
          mediaID: data.id,
          mediaType: mediaType,
          mediaPreviewUrl: data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : "",
          mediaInfo: data.overview || "",
          mediaGenre: data.genres.map((genre) => genre.name).join(", "),
        };

        user.watchMovieList.push(mediaDetails);
      }

      const updateResponse = await fetch(jsonbinUrl, {
        method: "PUT",
        headers: {
          "X-Master-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ record: data.record }),
      });

      if (updateResponse.ok) {
        toggleWatchlistButton.textContent = itemExists
          ? "Add to Watchlist"
          : "Remove from Watchlist";
      } else {
        alert(
          `Failed to ${
            itemExists ? "remove item from" : "add item to"
          } watchlist.`
        );
      }
    });
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while managing the watchlist.");
  }
});
