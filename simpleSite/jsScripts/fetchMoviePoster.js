document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    const movieDetailsApiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${config.API_KEY}`;
    const trailerApiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos`;

    fetch(movieDetailsApiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${config.BEARER_TOKEN}`,
            'accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const posterPath = data.poster_path;
        const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
        const originalTitle = data.original_title;
        const overview = data.overview;
        const releaseDate = data.release_date;
        const genres = data.genres.map(genre => genre.name).join(', ');

        document.getElementById("movie-title").textContent = originalTitle;
        const moviePoster = document.getElementById("movie-poster");
        moviePoster.src = posterUrl;
        moviePoster.alt = originalTitle;
        
        // Delay revealing the image to prevent flicker
        setTimeout(() => {
            moviePoster.classList.remove('hidden');
        }, 2000);

        document.getElementById("movie-overview").textContent = `Overview: ${overview}`;
        document.getElementById("movie-release-date").textContent = `Release Date: ${releaseDate}`;
        document.getElementById("movie-genres").textContent = `Genres: ${genres}`;

        fetchTrailer(trailerApiUrl);
    })
    .catch(error => {
        console.error("Error fetching the movie details:", error);
    });

    function fetchTrailer(apiUrl) {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.BEARER_TOKEN}`,
                'accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const trailers = data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailers.length > 0) {
                const trailer = trailers[0];
                const trailerUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&origin=https%3A%2F%2Fwww.themoviedb.org&hl=en&modestbranding=1&fs=1&autohide=1`;
                const trailerFrame = document.getElementById("trailer-frame");

                const trailerButton = document.getElementById("movie-trailer");
                trailerButton.addEventListener("click", function() {
                    const modal = document.getElementById("trailer-modal");
                    modal.style.display = "flex";
                    trailerFrame.src = trailerUrl; // Set src to include autoplay
                });

                const modalBackground = document.getElementById("modal-background");
                modalBackground.addEventListener("click", function() {
                    const modal = document.getElementById("trailer-modal");
                    modal.style.display = "none";
                    trailerFrame.src = ""; // Stop the video and reset src
                });
            } else {
                document.getElementById("trailer-container").style.display = 'none';
            }
        })
        .catch(error => {
            console.error("Error fetching the trailer:", error);
        });
    }
});

