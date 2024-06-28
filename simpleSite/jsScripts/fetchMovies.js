document.addEventListener("DOMContentLoaded", function() {
    const popularMoviesApiUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
    const topRatedMoviesApiUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200';
    const authHeader = `Bearer ${config.BEARER_TOKEN}`;


    function fetchMovies(apiUrl, containerId) {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const movies = data.results.slice(0, 10);
            const container = document.getElementById(containerId);

            movies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.className = 'movie';

                const posterPath = movie.poster_path;
                const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

                movieElement.innerHTML = `
                    <img src="${posterUrl}" alt="${movie.title}">
                    <div class="title">${movie.title}</div>
                `;

                container.appendChild(movieElement);
            });
        })
        .catch(error => {
            console.error(`Error fetching the movies from ${apiUrl}:`, error);
        });
    }

    fetchMovies(popularMoviesApiUrl, 'popular-movies-container');
    fetchMovies(topRatedMoviesApiUrl, 'top-rated-movies-container');
});

