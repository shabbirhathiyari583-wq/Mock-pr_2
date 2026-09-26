const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const errorMsg = document.getElementById("errorMsg");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weatherCondition");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

function getWeatherCondition(code) {
  if (code === 0) return "Clear Sky";
  if (code >= 1 && code <= 3) return "Partly Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 95) return "Thunderstorm";
  return "Cloudy";
}

function getWeather() {
  const city = cityInput.value.trim();

  errorMsg.textContent = "";

  if (city === "") {
    errorMsg.textContent = "Please enter a city name";
    weatherCard.classList.add("hidden");
    return;
  }

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  fetch(geoUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(geoData) {
      if (!geoData.results || geoData.results.length === 0) {
        errorMsg.textContent = "City not found. Try another!";
        weatherCard.classList.add("hidden");
        return;
      }

      const location = geoData.results[0];
      const lat = location.latitude;
      const lon = location.longitude;
      const name = location.name;
      const country = location.country || "";


      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`;

      return fetch(weatherUrl)
        .then(function(res) {
          return res.json();
        })
        .then(function(weatherData) {
          const current = weatherData.current;


          cityName.textContent = `${name}, ${country}`;
          temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
          weatherCondition.textContent = getWeatherCondition(current.weather_code);
          feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
          humidity.textContent = `${current.relative_humidity_2m}%`;
          wind.textContent = `${current.wind_speed_10m} km/h`;


          weatherCard.classList.remove("hidden");
        });
    })
    .catch(function() {
      errorMsg.textContent = "Network error or API failed. Please try again.";
      weatherCard.classList.add("hidden");
    });
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    getWeather();
  }
});