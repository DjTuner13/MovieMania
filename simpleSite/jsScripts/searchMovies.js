function performSearch(query) {
  const apiKey = config.API_KEY;
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch results.");
      }
      return response.json();
    })
    .then((data) => {
      const results = data.results;
      const movieList = document.getElementById("movieList");
      movieList.innerHTML = "";

      if (results.length === 0) {
        movieList.innerHTML = "<li>No results found.</li>";
        return;
      }

      results.forEach((result) => {
        const listItem = document.createElement("li");
        listItem.className = "movie-item";
        const posterUrl = result.poster_path
          ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
          : "static/placeholder.webp";

        const title =
          result.media_type === "movie" ? result.title : result.name;
        const releaseDate =
          result.release_date || result.first_air_date || "N/A";

        listItem.innerHTML = `
          <a href="movie.html?id=${result.id}&media_type=${
          result.media_type
        }" class="movie-link">
            <img src="${posterUrl}" alt="${title}" class="movie-poster" onerror="this.src='static/placeholder.jpg';">
            <div class="movie-details">
              <h3>${title} (${releaseDate.split("-")[0]})</h3>
              <p>${result.overview}</p>
            </div>
          </a>
        `;
        movieList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while searching for results.");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query");
  if (query) {
    document.getElementById("query").value = query;
    performSearch(query);
  }
});

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("query").value;
  performSearch(query);
});
