const apiKey = "2f76197352bb336c5ac56094f0ed9044"; // your API key

// Small fun facts for some cities
const cityFacts = {
  "Paris": "Paris is known as the City of Light.",
  "Tokyo": "Tokyo is famous for its cherry blossoms.",
  "New York": "New York is called The Big Apple.",
  "London": "London has the iconic Big Ben clock tower.",
  "Coimbatore": "Coimbatore is known as the Manchester of South India."
};

// Weather emoji/icons
const weatherIcons = {
  "clear": "☀️",
  "cloud": "☁️",
  "rain": "🌧",
  "drizzle": "🌦",
  "snow": "❄️",
  "thunder": "⚡",
  "storm": "🌩",
  "default": "🌈"
};

// Navigate from index.html to report.html
function goToReport() {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    localStorage.setItem("lastCity", city);
    window.location.href = "report.html";
  } else {
    alert("Please enter a city name!");
  }
}

// Back button function
function goBack() {
  window.location.href = "index.html";
}

// On report.html, fetch weather and show history
window.onload = function() {
  const city = localStorage.getItem("lastCity");
  if (!city) return;

  const weatherDiv = document.getElementById("weatherInfo");
  const historyList = document.getElementById("historyList");
  const bgImage = document.getElementById("bg-image");
  const weatherIconDiv = document.getElementById("weatherIcon");
  const funFactDiv = document.getElementById("funFact");

  // Update search history
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  if (!history.includes(city)) history.push(city);
  localStorage.setItem("history", JSON.stringify(history));

  // Display history as cards with weather icons
  historyList.innerHTML = "";
  history.forEach(c => {
    const card = document.createElement("div");
    card.style.background = "rgba(0,0,0,0.3)";
    card.style.padding = "8px 12px";
    card.style.borderRadius = "5px";
    card.style.color = "white";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.gap = "5px";
    card.innerHTML = `${c}`;
    historyList.appendChild(card);
  });

  // Fetch weather from OpenWeatherMap
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        weatherDiv.innerHTML = `Error: ${data.message}`;
        bgImage.src = "images/background.jpg.jpg";
        weatherIconDiv.textContent = weatherIcons["default"];
        funFactDiv.textContent = "";
        return;
      }

      const weatherMain = data.weather[0].main.toLowerCase();
      const temp = data.main.temp;

      // Display weather info
      weatherDiv.innerHTML = `
        <p><strong>City:</strong> ${data.name}</p>
        <p><strong>Temperature:</strong> ${temp} °C</p>
        <p><strong>Weather:</strong> ${data.weather[0].main}</p>
      `;

      // Display weather icon
      let iconKey = "default";
      for (let key in weatherIcons) {
        if (weatherMain.includes(key)) iconKey = key;
      }
      weatherIconDiv.textContent = weatherIcons[iconKey];

      // Change background image based on weather
      switch (true) {
        case weatherMain.includes("cloud"):
          bgImage.src = "images/cloud.mp4.jpg";
          break;
        case weatherMain.includes("rain") || weatherMain.includes("drizzle"):
          bgImage.src = "images/rain.mp4.jpg";
          break;
        case weatherMain.includes("snow"):
          bgImage.src = "images/snow.mp4.jpg";
          break;
        case weatherMain.includes("clear"):
          bgImage.src = "images/sunny.mp4.jpg";
          break;
        case weatherMain.includes("thunder") || weatherMain.includes("storm"):
          bgImage.src = "images/thunder.mp4.jpg";
          break;
        default:
          bgImage.src = "images/background.jpg.jpg";
      }

      // Temperature-based text color
      if (temp < 10) weatherDiv.style.color = "#00ccff"; // Cold - blue
      else if (temp <= 25) weatherDiv.style.color = "#00ff99"; // Mild - green
      else weatherDiv.style.color = "#ffcc00"; // Hot - yellow/orange

      // Display fun fact if available
      funFactDiv.textContent = cityFacts[data.name] || "";
    })
    .catch(err => {
      weatherDiv.innerHTML = "Error fetching weather data";
      bgImage.src = "images/background.jpg.jpg";
      weatherIconDiv.textContent = weatherIcons["default"];
      funFactDiv.textContent = "";
    });
};
