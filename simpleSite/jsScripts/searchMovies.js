document.getElementById("searchForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const query = document.getElementById("query").value;
  const apiKey = config.API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch movies.");
    }

    const data = await response.json();
    const movies = data.results;

    const movieList = document.getElementById("movieList");
    movieList.innerHTML = "";

    if (movies.length === 0) {
      movieList.innerHTML = "<li>No movies found.</li>";
      return;
    }

    movies.forEach((movie) => {
      const movieItem = document.createElement("li");
      movieItem.className = "movie-item";
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "placeholder.jpg";
      movieItem.innerHTML = `
        <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
        <div class="movie-details">
          <h3>${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})</h3>
          <p>${movie.overview}</p>
        </div>
      `;
      movieList.appendChild(movieItem);
    });
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while searching for movies.");
  }
});
