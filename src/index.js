// DISPLAY DATE & TIME
let now = new Date();

let day = now.getDay();
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let date = now.getDate();

let month = now.getMonth();
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}

let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}

let dateTime = document.querySelector("#display-date");
dateTime.innerHTML = `${days[day]} ${date} ${months[month]} | ${hour}:${minute}`;

// API DATA
let apiKey = "ea446638ab71304f56de134b4323492c";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
let forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?";
let unit = "metric";

let geoAPIKey = "463df0b21ba8484bb2e6f44bae41dac9";
let geoAPIUrl = "https://api.opencagedata.com/geocode/v1/json?q=";

// GLOBAL VAR
let displayCity = document.querySelector("#display-city");
let displayTemp = document.querySelector("#display-temp");
let displayCondition = document.querySelector("#display-condition");
let displayFromTo = document.querySelector("#display-fromto");
let displayWindSpeed = document.querySelector("#display-windspeed");
let displayWeatherIcon = document.querySelector("#display-weathericon");
let inputCity = document.querySelector("#input-city");

// ONLOAD
function showCurrent(response) {
  // CURRENT CITY
  let currentResponse = response.data;
  displayCity.innerHTML = currentResponse.name;

  // CURRENT TEMP
  let onloadTemp = Math.round(currentResponse.main.temp);
  displayTemp.innerHTML = onloadTemp;

  // CURRENT DETAILS
  displayWeatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${currentResponse.weather[0].icon}@2x.png`
  );
  displayWeatherIcon.setAttribute(
    "alt",
    currentResponse.weather[0].description
  );
  displayCondition.innerHTML = currentResponse.weather[0].description;
  displayFromTo.innerHTML = `${Math.round(
    currentResponse.main.temp_min
  )}° |  ${Math.round(currentResponse.main.temp_max)}°`;
  displayWindSpeed.innerHTML = `${currentResponse.wind.speed} km/h`;

  celciusTemp = currentResponse.main.temp;
}

// Forecast
function showForecast(responseForecast) {
  // Loop
  let displayForecast = document.querySelector("#display-forecast");
  displayForecast.innerHTML = "";

  // Forecast Data Array
  for (let i = 1; i < 7; i++) {
    // get i
    let forecastResponse = responseForecast.data.daily[i];
    console.log(forecastResponse);

    // Forecast Day[]
    let forecastTime = responseForecast.data.daily[i].dt;
    let forecastDay = new Date(forecastTime * 1000).getDay();

    // Forecast Weather Icon
    let forecastIcon = responseForecast.data.daily[i].weather[0].icon;

    displayForecast.innerHTML += `
            <div class="col py-2">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <p class="card-title h6">${days[forecastDay]}</p>
                        <img src="http://openweathermap.org/img/wn/${forecastIcon}@2x.png" width="50%">
                        <p class="card-text text-black-50">${Math.round(
                          forecastResponse.temp.min
                        )}° | ${Math.round(forecastResponse.temp.max)}°</p>
                    </div>
                </div>
            </div>
        `;
  }
}

function loadCurrent(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiCurrent = `${apiUrl}lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  axios.get(apiCurrent).then(showCurrent);

  let apiForecast = `${forecastUrl}lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  axios.get(apiForecast).then(showForecast);
}

navigator.geolocation.getCurrentPosition(loadCurrent);

// GET LOCATION
let getPosition = document.querySelector("#link-position");
getPosition.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(loadCurrent);
});

// ON SEARCH
function showSearch() {
  let apiSearch = `${apiUrl}q=${inputCity.value}&units=${unit}&appid=${apiKey}`;

  if (inputCity.value) {
    inputCity.classList.remove("is-invalid");
    axios.get(apiSearch).then(showSearchResult);
    getCordFromCity();
    inputCity.value = "";
  } else {
    inputCity.classList.add("is-invalid");
  }
}

function showSearchResult(searchResult) {
  let resultData = searchResult;
  displayCity.innerHTML = resultData.data.name;
  displayTemp.innerHTML = Math.round(resultData.data.main.temp);
  celciusTemp = resultData.data.main.temp;

  // Search Details
  displayCondition.innerHTML = resultData.data.weather[0].description;
  displayFromTo.innerHTML = `${Math.round(
    resultData.data.main.temp_min
  )}° | ${Math.round(resultData.data.main.temp_max)}°`;
  displayWindSpeed.innerHTML = `${resultData.data.wind.speed} km/h`;
}

function showSearchForecast(responseSearchForecast) {
  let latSearchForecast = Math.round(
    responseSearchForecast.data.results[0].geometry.lat
  );
  let lonSearchForecast = Math.round(
    responseSearchForecast.data.results[0].geometry.lng
  );

  let apiSearchForecast = `${forecastUrl}lat=${latSearchForecast}&lon=${lonSearchForecast}&units=${unit}&appid=${apiKey}`;
  axios.get(apiSearchForecast).then(showForecast);
}

function getCordFromCity() {
  let apiGeo = `${geoAPIUrl}${inputCity.value}&key=${geoAPIKey}`;
  axios.get(apiGeo).then(showSearchForecast);
}

let searchCity = document.querySelector("#button-city");
searchCity.addEventListener("click", showSearch);
