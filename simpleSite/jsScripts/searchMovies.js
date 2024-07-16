function performSearch(query) {
  const apiKey = config.API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch movies.");
      }
      return response.json();
    })
    .then(data => {
      const movies = data.results;
      const movieList = document.getElementById("movieList");
      movieList.innerHTML = "";

      if (movies.length === 0) {
        movieList.innerHTML = "<li>No movies found.</li>";
        return;
      }

      movies.forEach(movie => {
        const movieItem = document.createElement("li");
        movieItem.className = "movie-item";
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "placeholder.jpg";
        movieItem.innerHTML = `
          <a href="movie.html?id=${movie.id}" class="movie-link">
            <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
            <div class="movie-details">
              <h3>${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})</h3>
              <p>${movie.overview}</p>
            </div>
          </a>
        `;
        movieList.appendChild(movieItem);
      });
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred while searching for movies.");
    });
}

document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query');
  if (query) {
    document.getElementById("query").value = query;
    performSearch(query);
  }
});

document.getElementById("searchForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const query = document.getElementById("query").value;
  performSearch(query);
});
