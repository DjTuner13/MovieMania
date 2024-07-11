document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
    const authHeader = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOGNkYjIyZTQyNWM3YmI1YTBmMzMyODI1NDNhOWM2ZCIsIm5iZiI6MTcxOTUwODExNi4xNzAxMTEsInN1YiI6IjY2NDkzOGIwNmM1ZTY2ZmU0ZDk1YmU4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L63YN5PQ8xXJbEOOggeh13sV-0ECgUThP1PPNPUEsZc';

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
        const container = document.getElementById('movies-container');

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
        console.error("Error fetching the popular movies:", error);
    });
});

