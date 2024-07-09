document
  .getElementById("addMovieForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const movieID = document.getElementById("movieID").value;
    const movieName = document.getElementById("movieName").value;

    if (!movieID && !movieName) {
      alert("Please provide either a Movie ID or a Movie Name.");
      return;
    }

    try {
      let movieDetails;

      if (movieID) {
        movieDetails = await fetchMovieByID(movieID);
      } else {
        movieDetails = await fetchMovieByName(movieName);
      }

      if (!movieDetails) {
        alert("Movie not found. Please check the details and try again.");
        return;
      }

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

      let existingData = await existingDataResponse.json();

      // Ensure the data is an array of users
      if (!Array.isArray(existingData.record)) {
        existingData.record = [];
      }

      console.log("Fetched data:", existingData.record);

      // Find user by email
      const user = existingData.record.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (user) {
        // Append to the existing user's watch list
        user.watchMovieList.push(movieDetails);

        // Update the bin with the new data
        const updateResponse = await fetch(jsonbinUrl, {
          method: "PUT",
          headers: {
            "X-Master-Key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ record: existingData.record }),
        });

        if (updateResponse.status === 200) {
          alert("Movie added to watch list successfully!");
          // Clear the form
          document.getElementById("addMovieForm").reset();
        } else {
          alert("Failed to add movie to watch list.");
        }
      } else {
        alert("Could not find user.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the movie to the watch list.");
    }
  });

async function fetchMovieByID(movieID) {
  const movieDbUrl = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${config.MOVIE_DB_API_KEY}`;
  const response = await fetch(movieDbUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.BEARER_TOKEN}`,
      accept: "application/json",
    },
  });

  if (response.ok) {
    const movieData = await response.json();
    return {
      movieID: movieData.id,
      moviePreviewUrl: movieData.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
        : "",
      movieInfo: movieData.overview || "",
      movieGenre: Array.isArray(movieData.genres)
        ? movieData.genres.map((genre) => genre.name).join(", ")
        : "",
    };
  } else {
    return null;
  }
}

async function fetchMovieByName(movieName) {
  const movieDbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${
    config.MOVIE_DB_API_KEY
  }&query=${encodeURIComponent(movieName)}`;
  const response = await fetch(movieDbUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.BEARER_TOKEN}`,
      accept: "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    if (data.results.length > 0) {
      const movie = data.results[0];
      return {
        movieID: movie.id,
        moviePreviewUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "",
        movieInfo: movie.overview || "",
        movieGenre: movie.genre_ids.join(", "),
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
}
