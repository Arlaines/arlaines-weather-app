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

function fetchInfo(city) {
  let apiKey = "b5f0045b7ed1a1d8cfe314d57e600872";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showRealLiveTemp);
}

function makeARequest(event) {
  event.preventDefault();
  let city = document.querySelector("#inlineFormInput").value;
  console.log(city);
  fetchInfo(city);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function display5DayForecast(response) {
  console.log(response);
  console.log(response.data.daily);
  let dailyForecastData = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row day-cards">`;
  dailyForecastData.forEach(function (day, index) {
    if (index < 6 && index > 0) {
      forecastHTML =
        forecastHTML +
        `<div
                class="card col-2 m-2 bg-white bg-opacity-50 border-0"
                style="width: 10rem"
              >
                <div class="card-body text-white">
                  <h5 class="card-title">${formatDay(day.dt)}</h5>
                  <p class="card-text">
                    <img src="https://openweathermap.org/img/wn/${
                      day.weather[0].icon
                    }@2x.png"
                    alt=""
                    width="42"/>
                  </p>
                  <h5><span class="max-forecast-temp">${Math.round(
                    day.temp.max
                  )}</span>&deg; /<span class="min-forecast-temp"> ${Math.round(
          day.temp.min
        )}</span>&deg;</h5>
                </div>
              </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  document.querySelector("#precipitation-now").innerHTML = Math.round(
    dailyForecastData[0].pop
  );
  console.log(dailyForecastData[0].pop);
}

function accessForecastData(coordinates) {
  console.log(coordinates);
  let apiKey = "6643c7326a4c2a38838264a28531d97e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(display5DayForecast);
}

function showRealLiveTemp(response) {
  console.log(response.data.name);
  console.log(response.data);

  document.querySelector("#searched-for-city").innerHTML = response.data.name;
  document.querySelector("#actual-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#feels-like-temp").innerHTML = Math.round(
    response.data.main.feels_like
  );

  document.querySelector("#humidity-now").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#wind-now").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.weather[0].description);
  celsiusTemp = Math.round(response.data.main.temp);
  feelsLikeTemp = response.data.main.feels_like;

  accessForecastData(response.data.coord);
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

function showPosition(position) {
  console.log(position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "b5f0045b7ed1a1d8cfe314d57e600872";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(showRealLiveTemp);
}

function requestCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let now = new Date();

currentDate(now);

fetchInfo("Toronto");

let celsiusTemp = null;

let feelsLikeTemp = null;

let tempMeasure = document.querySelector("#toggle-temp");
tempMeasure.addEventListener("click", changeDegrees);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", makeARequest);

let currentLocation = document.querySelector("#current-button");
currentLocation.addEventListener("click", requestCurrentLocation);
