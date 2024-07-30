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

    const updateButtonState = () => {
      const itemExists = user.watchMovieList.some(
        (item) => item.mediaID === parseInt(mediaId) && item.mediaType === mediaType
      );
      toggleWatchlistButton.textContent = itemExists ? "Remove from Watchlist" : "Add to Watchlist";
    };

    updateButtonState();

    toggleWatchlistButton.addEventListener("click", async () => {
      const itemExists = user.watchMovieList.some(
        (item) => item.mediaID === parseInt(mediaId) && item.mediaType === mediaType
      );

      if (itemExists) {
        user.watchMovieList = user.watchMovieList.filter(
          (item) => item.mediaID !== parseInt(mediaId) || item.mediaType !== mediaType
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

        const mediaData = await response.json();
        const mediaDetails = {
          mediaID: mediaData.id,
          mediaType: mediaType,
          mediaPreviewUrl: mediaData.poster_path
            ? `https://image.tmdb.org/t/p/w500${mediaData.poster_path}`
            : "",
          mediaInfo: mediaData.overview || "",
          mediaGenre: mediaData.genres.map((genre) => genre.name).join(", "),
          mediaTitle: mediaType === "movie" ? mediaData.title : mediaData.name,
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
        updateButtonState();
      } else {
        alert(
          `Failed to ${itemExists ? "remove item from" : "add item to"} watchlist.`
        );
      }
    });
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while managing the watchlist.");
  }
});
