document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = `https://api.themoviedb.org/3/tv/94997?api_key=${config.API_KEY}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Extract data from the response
            const posterPath = data.poster_path;
            const originalTitle = data.original_title;
            const overview = data.overview;
            const releaseDate = data.release_date;
            const genres = data.genres.map(genre => genre.name).join(', ');

            // Construct the full URL for the poster image
            const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

            // Set the movie details in the DOM
            document.getElementById("movie-title").textContent = originalTitle;
            document.getElementById("movie-poster").src = posterUrl;
            document.getElementById("movie-overview").textContent = `Overview: ${overview}`;
            document.getElementById("movie-release-date").textContent = `Release Date: ${releaseDate}`;
            document.getElementById("movie-genres").textContent = `Genres: ${genres}`;
        })
        .catch(error => {
            console.error("Error fetching the movie data:", error);
        });
});

