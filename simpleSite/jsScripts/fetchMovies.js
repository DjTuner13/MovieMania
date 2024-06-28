document.addEventListener("DOMContentLoaded", function() {
    const popularMoviesApiUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
    const topRatedMoviesApiUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200';
    const authHeader = `Bearer ${config.BEARER_TOKEN}`;

    fetchMovies(popularMoviesApiUrl, 'popular-movies-container');
    fetchMovies(topRatedMoviesApiUrl, 'top-rated-movies-container');

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
            const movies = data.results.slice(0, 20);
            const container = document.getElementById(containerId);
            container.innerHTML = ''; // Clear the container

            movies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.className = 'movie';

                const posterPath = movie.poster_path;
                const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

                movieElement.innerHTML = `
                    <img src="${posterUrl}" alt="${movie.title}" data-id="${movie.id}">
                    <div class="title">${movie.title}</div>
                `;

                movieElement.querySelector('img').addEventListener('click', function() {
                    const movieId = this.getAttribute('data-id');
                    window.location.href = `movie.html?id=${movieId}`;
                });

                container.appendChild(movieElement);
            });
        })
        .catch(error => {
            console.error(`Error fetching the movies: ${error}`);
        });
    }
});

