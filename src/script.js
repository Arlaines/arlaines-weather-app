function currentDate(now) {
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentTime = document.querySelector("#current-time");
  let currentWeekday = weekdays[now.getDay()];
  let currentHour = now.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinutes = now.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  let formattedCurrentDate = `${currentWeekday} ${currentHour}:${currentMinutes}`;
  currentTime.innerHTML = formattedCurrentDate;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function display5DayForecast(response) {
  console.log(response);
  let dailyForecastData = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row day-cards">`;
  dailyForecastData.forEach(function (day, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div
                class="card col-2 m-2 bg-white bg-opacity-50 border-0"
                style="width: 10rem"
              >?
                <div class="card-body text-white">
                  <h5 class="card-title">${formatDay(day.time)}</h5>
                  <p class="card-text">
                    <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                      day.condition.icon
                    }.png"
                    alt="dailyForecastData[0].icon"
                    width="42"/>
                  </p>
                  <h5><span class="max-forecast-temp">${Math.round(
                    day.temperature.maximum
                  )}</span>&deg; /<span class="min-forecast-temp"> ${Math.round(
          day.temperature.minimum
        )}</span>&deg;</h5>
                </div>
              </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function displayPrecipitation(response) {
  console.log(response.data);
  document.querySelector("#precipitation-now").innerHTML = Math.round(
    response.data.daily[0].pop
  );
  console.log(response.data.daily[0].pop);
}

function makeARequestForPrecipitation(coordinates) {
  console.log(coordinates);
  let lat = coordinates.latitude;
  let lon = coordinates.longitude;
  let secondApiKey = "6643c7326a4c2a38838264a28531d97e";
  let secondApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${secondApiKey}&units=metri`;
  console.log(secondApiUrl);
  axios.get(`${secondApiUrl}`).then(displayPrecipitation);
}

function accessForecastData(city) {
  console.log(city);

  let apiKey = "3e0db7t6452048a494f7aaaef11f5o6b";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(display5DayForecast);
}

function displayCityAndTemp(response) {
  console.log(response.data);

  document.querySelector("#searched-for-city").innerHTML = response.data.city;
  document.querySelector("#actual-temp").innerHTML = Math.round(
    response.data.temperature.current
  );
  document.querySelector("#feels-like-temp").innerHTML = Math.round(
    response.data.temperature.feels_like
  );

  document.querySelector("#humidity-now").innerHTML = Math.round(
    response.data.temperature.humidity
  );
  document.querySelector("#wind-now").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#weather-description").innerHTML =
    response.data.condition.description;
  document
    .querySelector("#icon")
    .setAttribute("src", response.data.condition.icon_url);
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.condition.icon);

  makeARequestForPrecipitation(response.data.coordinates);
  accessForecastData(response.data.city);
}

function changeDegrees() {
  let tempValue = document.querySelector("h3");
  let tempElement = document.querySelector("#actual-temp");
  let feelsLikeElement = document.querySelector("#feels-like-temp");
  let toggleButton = document.querySelector("#toggle-temp");
  let degreeChange = document.querySelector(".celsius-fahrenheit");
  if (tempValue.classList.contains("celsius")) {
    tempValue.classList.remove("celsius");
    tempValue.classList.add("fahrenheit");
    tempElement.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
    feelsLikeElement.innerHTML = Math.round((feelsLikeTemp * 9) / 5 + 32);
    degreeChange.innerHTML = "°f";
    toggleButton.innerHTML = "| °c";
  } else {
    tempValue.classList.remove("fahrenheit");
    tempValue.classList.add("celsius");
    let fahrenheitValue = tempElement.innerHTML;
    let fahrenheitFeelsLikeValue = feelsLikeElement.innerHTML;
    tempElement.innerHTML = Math.round(((fahrenheitValue - 32) * 5) / 9);
    feelsLikeElement.innerHTML = Math.round(
      ((fahrenheitFeelsLikeValue - 32) * 5) / 9
    );
    degreeChange.innerHTML = "°c";
    toggleButton.innerHTML = "| °f";
  }
}

function accessCityData(city) {
  let apiKey = "3e0db7t6452048a494f7aaaef11f5o6b";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(`${apiUrl}`).then(displayCityAndTemp);
}

function accessCurrentLocation(position) {
  console.log(position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "3e0db7t6452048a494f7aaaef11f5o6b";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(displayCityAndTemp);
}

function makeARequestBySearch(event) {
  event.preventDefault();
  let city = document.querySelector("#inlineFormInput").value;
  console.log(city);
  accessCityData(city);
}

function makeARequestByCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(accessCurrentLocation);
}
let now = new Date();

currentDate(now);

accessCityData("Toronto");

let celsiusTemp = null;

let feelsLikeTemp = null;

let tempMeasure = document.querySelector("#toggle-temp");
tempMeasure.addEventListener("click", changeDegrees);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", makeARequestBySearch);

let currentLocation = document.querySelector("#current-button");
currentLocation.addEventListener("click", makeARequestByCurrentLocation);
