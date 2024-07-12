// index.js

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("query").value;
  window.location.href = `searchMovies.html?query=${encodeURIComponent(query)}`;
});

document.getElementById("watchlist-button").addEventListener("click", () => {
  window.location.href = "watchlist.html";
});
