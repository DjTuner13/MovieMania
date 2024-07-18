const streamingServices = ["Netflix", "Hulu", "Amazon Prime"];
        const streamingList = document.getElementById("streaming-services");

        streamingServices.forEeach(service => {
          const li = document.createElement("li");
          li.textContent = service;
          streamingList.appendChild(li);
        });