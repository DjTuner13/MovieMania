document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const mediaType = urlParams.get("media_type");
  const mediaId = urlParams.get("id");

  const streamingServicesApiUrl = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/watch/providers?api_key=${config.API_KEY}`;

  fetch(streamingServicesApiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.BEARER_TOKEN}`,
      accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const country = "US"; // You might want to make this dynamic based on user's location
      const providers = data.results[country];

      const streamingServicesContainer =
        document.getElementById("streaming-services");
      streamingServicesContainer.innerHTML = "";

      if (
        !providers ||
        (!providers.flatrate && !providers.rent && !providers.buy)
      ) {
        streamingServicesContainer.innerHTML =
          "<li>Not available on streaming services</li>";
        return;
      }

      const createServiceItem = (provider) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = providers.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/w45${provider.logo_path}`;
        img.alt = provider.provider_name;

        link.appendChild(img);
        link.appendChild(document.createTextNode(provider.provider_name));

        li.appendChild(link);
        return li;
      };

      const appendProviders = (providerList) => {
        providerList.forEach((provider) => {
          streamingServicesContainer.appendChild(createServiceItem(provider));
        });
      };

      if (providers.flatrate) {
        appendProviders(providers.flatrate);
      }
      if (providers.rent) {
        appendProviders(providers.rent);
      }
      if (providers.buy) {
        appendProviders(providers.buy);
      }
    })
    .catch((error) => {
      console.error("Error fetching the streaming services:", error);
      const streamingServicesContainer =
        document.getElementById("streaming-services");
      streamingServicesContainer.innerHTML =
        "<li>Error fetching streaming services</li>";
    });
});
