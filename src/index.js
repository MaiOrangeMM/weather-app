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
    "Dec"
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
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
let apiKey = "ea446638ab71304f56de134b4323492c";
let unit = "metric";

let displayCity = document.querySelector("#display-city");
let displayTemp = document.querySelector("#display-temp");
let displayCondition = document.querySelector("#display-condition");
let displayFromTo = document.querySelector("#display-fromto");
let displayWindSpeed = document.querySelector("#display-windspeed");
let displayWeatherIcon = document.querySelector("#display-weathericon");


// ONLOAD
function showCurrent(response) {
    // CURRENT CITY
    let currentResponse = response.data;
    displayCity.innerHTML = currentResponse.name;

    // CURRENT TEMP
    let onloadTemp = Math.round(currentResponse.main.temp);
    displayTemp.innerHTML = onloadTemp;

    // CURRENT DETAILS
    displayWeatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${currentResponse.weather[0].icon}@2x.png`);
    displayWeatherIcon.setAttribute("alt", currentResponse.weather[0].description);
    displayCondition.innerHTML = currentResponse.weather[0].description;
    displayFromTo.innerHTML = `${Math.round(
        currentResponse.main.temp_min
    )}° | ${Math.round(currentResponse.main.temp_max)}°`;
    displayWindSpeed.innerHTML = `${currentResponse.wind.speed} km/h`;

    celciusTemp = currentResponse.main.temp;
}

function loadCurrent(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let apiCurrent = `${apiUrl}lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
    axios.get(apiCurrent).then(showCurrent);
}

navigator.geolocation.getCurrentPosition(loadCurrent);


// GET LOCATION
let getPosition = document.querySelector("#link-position");
getPosition.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(loadCurrent);
});


// ON SEARCH
function showSearch() {
    let inputCity = document.querySelector("#input-city");
    let apiSearch = `${apiUrl}q=${inputCity.value}&units=${unit}&appid=${apiKey}`;

    if (inputCity.value) {
        inputCity.classList.remove("is-invalid");
        axios.get(apiSearch).then(showSearchResult);
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

let searchCity = document.querySelector("#button-city");
searchCity.addEventListener("click", showSearch);


// Convert Temperature Unit
function convertCelsius(event) {
    event.preventDefault();
    displayTemp.innerHTML = Math.round(celciusTemp);
    getCelsius.classList.remove("text-muted");
    getFahrenheit.classList.add("text-muted");
}

function convertFahrenheit(event) {
    event.preventDefault();
    let fahrenheitTemp = Math.round((celciusTemp * 9) / 5 + 32);
    displayTemp.innerHTML = fahrenheitTemp;
    getFahrenheit.classList.remove("text-muted");
    getCelsius.classList.add("text-muted");
}

let celciusTemp = null;

let getCelsius = document.querySelector("#link-celcius");
getCelsius.addEventListener("click", convertCelsius);

let getFahrenheit = document.querySelector("#link-fahrenheit");
getFahrenheit.addEventListener("click", convertFahrenheit);


