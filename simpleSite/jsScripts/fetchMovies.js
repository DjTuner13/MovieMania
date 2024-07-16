document.addEventListener("DOMContentLoaded", function() {
    const apiKey = config.API_KEY;
    const baseURL = 'https://api.themoviedb.org/3';
    const authHeader = `Bearer ${config.BEARER_TOKEN}`;

    const endpoints = {
        'popular-movies-container': `/discover/movie?sort_by=popularity.desc&api_key=${apiKey}`,
        'top-rated-movies-container': `/discover/movie?sort_by=vote_average.desc&vote_count.gte=200&api_key=${apiKey}`,
        'family-movies-container': `/discover/movie?with_genres=10751&api_key=${apiKey}`,
        'new-movies-container': `/movie/now_playing?api_key=${apiKey}`,
        'action-movies-container': `/discover/movie?with_genres=28&api_key=${apiKey}`,
        'horror-movies-container': `/discover/movie?with_genres=27&api_key=${apiKey}`,
        'romcom-movies-container': `/discover/movie?with_genres=10749&api_key=${apiKey}`,
        'kids-movies-container': `/discover/movie?with_genres=10751&api_key=${apiKey}`,
        'popular-shows-container': `/tv/popular?api_key=${apiKey}`,
        'top-rated-shows-container': `/tv/top_rated?api_key=${apiKey}`,
        'cartoon-shows-container': `/discover/tv?with_genres=10762&api_key=${apiKey}`,
        'new-shows-container': `/tv/on_the_air?api_key=${apiKey}`,
        'drama-shows-container': `/discover/tv?with_genres=18&api_key=${apiKey}`,
        'cartoons-container': `/discover/tv?with_genres=80&api_key=${apiKey}`,
        'sitcom-shows-container': `/discover/tv?with_genres=35&api_key=${apiKey}`,
        'reality-tv-container': `/discover/tv?with_genres=10764&api_key=${apiKey}`
    };

    for (const containerId in endpoints) {
        fetchMovies(`${baseURL}${endpoints[containerId]}`, containerId);
    }

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
