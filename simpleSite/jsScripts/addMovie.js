document
  .getElementById("addMovieForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const movieID = document.getElementById("movieID").value;

    try {
      // Fetch movie details from Movie Database API
      const movieDbUrl = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${config.MOVIE_DB_API_KEY}`;
      const movieResponse = await fetch(movieDbUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.BEARER_TOKEN}`,
          accept: "application/json",
        },
      });

      if (!movieResponse.ok) {
        throw new Error("Failed to fetch movie details.");
      }

      const movieData = await movieResponse.json();

      const movieDetails = {
        movieID: movieData.id,
        moviePreviewUrl: movieData.poster_path
          ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
          : "",
        movieInfo: movieData.overview || "",
        movieGenre: Array.isArray(movieData.genre_ids)
          ? movieData.genre_ids.map((genreId) => genreId.toString()).join(", ")
          : "",
      };

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

      // Check if the fetched data is an array, if not, initialize it as an array
      if (!Array.isArray(existingData)) {
        existingData = [];
      }

      // Find user by email
      const user = existingData.find((user) => user.email === email);

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
          body: JSON.stringify(existingData),
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
