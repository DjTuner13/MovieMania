document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const mediaType = urlParams.get("media_type"); // Either 'movie' or 'tv'
  const mediaId = urlParams.get("id");
  const mediaDetailsApiUrl = `https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${config.API_KEY}`;

  fetch(mediaDetailsApiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.BEARER_TOKEN}`,
      accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const posterPath = data.poster_path;
      const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
      const originalTitle =
        mediaType === "movie" ? data.original_title : data.name;
      const overview = data.overview;
      const releaseDate =
        mediaType === "movie" ? data.release_date : data.first_air_date;
      const genres = data.genres.map((genre) => genre.name).join(", ");

      document.getElementById("movie-title").textContent = originalTitle;
      const moviePoster = document.getElementById("movie-poster");
      moviePoster.src = posterUrl;
      moviePoster.alt = originalTitle;

      // Delay revealing the image to prevent flicker
      setTimeout(() => {
        moviePoster.classList.remove("hidden");
      }, 2000);

      document.getElementById(
        "movie-overview"
      ).textContent = `Overview: ${overview}`;
      document.getElementById(
        "movie-release-date"
      ).textContent = `Release Date: ${releaseDate}`;
      document.getElementById("movie-genres").textContent = `Genres: ${genres}`;

      const toggleWatchlistButton = document.getElementById("toggle-watchlist");
      checkWatchlist(mediaId, toggleWatchlistButton);
      toggleWatchlistButton.addEventListener("click", function () {
        toggleWatchlist(
          {
            movieID: mediaId,
            movieInfo: originalTitle,
            moviePreviewUrl: posterUrl,
          },
          toggleWatchlistButton
        );
      });

      fetchTrailer(trailerApiUrl);
    })
    .catch((error) => {
      console.error("Error fetching the media details:", error);
    });

  function fetchTrailer(apiUrl) {
    fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.BEARER_TOKEN}`,
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const trailers = data.results.filter(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailers.length > 0) {
          const trailer = trailers[0];
          const trailerUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&origin=https%3A%2F%2Fwww.themoviedb.org&hl=en&modestbranding=1&fs=1&autohide=1`;
          const trailerFrame = document.getElementById("trailer-frame");

          const trailerButton = document.getElementById("movie-trailer");
          trailerButton.addEventListener("click", function () {
            const modal = document.getElementById("trailer-modal");
            modal.style.display = "flex";
            trailerFrame.src = trailerUrl; // Set src to include autoplay
          });

          const modalBackground = document.getElementById("modal-background");
          modalBackground.addEventListener("click", function () {
            const modal = document.getElementById("trailer-modal");
            modal.style.display = "none";
            trailerFrame.src = ""; // Stop the video and reset src
          });
        } else {
          document.getElementById("trailer-container").style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error fetching the trailer:", error);
      });
  }

  function checkWatchlist(movieId, button) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || !currentUser.email) {
      return;
    }

    const binId = config.BIN_ID;
    const apiKey = config.JSON_API_KEY;
    const jsonbinUrl = `https://api.jsonbin.io/v3/b/${binId}?meta=false`;

    fetch(jsonbinUrl, {
      method: "GET",
      headers: {
        "X-Master-Key": apiKey,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const user = data.record.find((u) => u.email === currentUser.email);
        if (user && user.watchMovieList) {
          const movieExists = user.watchMovieList.some(
            (m) => m.movieID === movieId
          );
          if (movieExists) {
            button.textContent = "Remove from Watchlist";
            button.classList.add("in-watchlist");
          } else {
            button.textContent = "Add to Watchlist";
            button.classList.remove("in-watchlist");
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function toggleWatchlist(movie, button) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || !currentUser.email) {
      alert("You must be logged in to add movies to your watchlist.");
      return;
    }

    const binId = config.BIN_ID;
    const apiKey = config.JSON_API_KEY;
    const jsonbinUrl = `https://api.jsonbin.io/v3/b/${binId}?meta=false`;

    fetch(jsonbinUrl, {
      method: "GET",
      headers: {
        "X-Master-Key": apiKey,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let users = data.record;
        let user = users.find((u) => u.email === currentUser.email);

        if (!user) {
          user = { email: currentUser.email, watchMovieList: [] };
          users.push(user);
        }

        const movieExists = user.watchMovieList.some(
          (m) => m.movieID === movie.movieID
        );

        if (movieExists) {
          user.watchMovieList = user.watchMovieList.filter(
            (m) => m.movieID !== movie.movieID
          );
          button.textContent = "Add to Watchlist";
          button.classList.remove("in-watchlist");
        } else {
          user.watchMovieList.push(movie);
          button.textContent = "Remove from Watchlist";
          button.classList.add("in-watchlist");
        }

        fetch(jsonbinUrl, {
          method: "PUT",
          headers: {
            "X-Master-Key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ record: users }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to update the watchlist.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while updating the watchlist.");
          });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while fetching the watchlist.");
      });
  }
});
