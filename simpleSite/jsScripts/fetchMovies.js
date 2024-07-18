document.addEventListener("DOMContentLoaded", function () {
  const apiKey = config.API_KEY;
  const baseURL = "https://api.themoviedb.org/3";
  const authHeader = `Bearer ${config.BEARER_TOKEN}`;

  const endpoints = {
    "popular-movies-container": {
      url: `/discover/movie?sort_by=popularity.desc&api_key=${apiKey}`,
      media_type: "movie",
    },
    "top-rated-movies-container": {
      url: `/discover/movie?sort_by=vote_average.desc&vote_count.gte=200&api_key=${apiKey}`,
      media_type: "movie",
    },
    "family-movies-container": {
      url: `/discover/movie?with_genres=10751&api_key=${apiKey}`,
      media_type: "movie",
    },
    "new-movies-container": {
      url: `/movie/now_playing?api_key=${apiKey}`,
      media_type: "movie",
    },
    "action-movies-container": {
      url: `/discover/movie?with_genres=28&api_key=${apiKey}`,
      media_type: "movie",
    },
    "horror-movies-container": {
      url: `/discover/movie?with_genres=27&api_key=${apiKey}`,
      media_type: "movie",
    },
    "romcom-movies-container": {
      url: `/discover/movie?with_genres=10749&api_key=${apiKey}`,
      media_type: "movie",
    },
    "kids-movies-container": {
      url: `/discover/movie?with_genres=10751&api_key=${apiKey}`,
      media_type: "movie",
    },
    "popular-shows-container": {
      url: `/tv/popular?api_key=${apiKey}`,
      media_type: "tv",
    },
    "top-rated-shows-container": {
      url: `/tv/top_rated?api_key=${apiKey}`,
      media_type: "tv",
    },
    "cartoon-shows-container": {
      url: `/discover/tv?with_genres=10762&api_key=${apiKey}`,
      media_type: "tv",
    },
    "new-shows-container": {
      url: `/tv/on_the_air?api_key=${apiKey}`,
      media_type: "tv",
    },
    "drama-shows-container": {
      url: `/discover/tv?with_genres=18&api_key=${apiKey}`,
      media_type: "tv",
    },
    "crime-shows-container": {
      url: `/discover/tv?with_genres=80&api_key=${apiKey}`,
      media_type: "tv",
    },
    "sitcom-shows-container": {
      url: `/discover/tv?with_genres=35&api_key=${apiKey}`,
      media_type: "tv",
    },
    "reality-tv-container": {
      url: `/discover/tv?with_genres=10764&api_key=${apiKey}`,
      media_type: "tv",
    },
  };

  for (const containerId in endpoints) {
    const endpoint = endpoints[containerId];
    fetchItems(`${baseURL}${endpoint.url}`, containerId, endpoint.media_type);
  }

  function fetchItems(apiUrl, containerId, mediaType) {
    fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const items = data.results.slice(0, 20);
        const container = document.getElementById(containerId);
        container.innerHTML = ""; // Clear the container

        items.forEach((item) => {
          const itemElement = document.createElement("div");
          itemElement.className = "movie";

          const posterPath = item.poster_path;
          const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

          const title = item.title || item.name; // Use title for movies and name for TV shows

          itemElement.innerHTML = `
                      <img src="${posterUrl}" alt="${title}" data-id="${item.id}" data-media-type="${mediaType}">
                      <div class="title">${title}</div>
                  `;

          itemElement
            .querySelector("img")
            .addEventListener("click", function () {
              const itemId = this.getAttribute("data-id");
              const itemMediaType = this.getAttribute("data-media-type");
              window.location.href = `movie.html?id=${itemId}&media_type=${itemMediaType}`;
            });

          container.appendChild(itemElement);
        });
      })
      .catch((error) => {
        console.error(`Error fetching the movies or shows: ${error}`);
      });
  }
});
