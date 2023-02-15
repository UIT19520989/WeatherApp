const todayforecast = document.querySelector(".hour-forecast");
const windrain = document.querySelector(".wind-rain");
const temprain = document.querySelector(".rain-temp");
const suntoday = document.querySelector(".sun-today");
const dayforecast = document.querySelector(".day-forecast");
const button = document.querySelector(".button");
const btnSearch = document.querySelector(".btn-search");
const valueInput = document.querySelector("searchInput");

// API
let myAPI =
  "http://api.weatherapi.com/v1/forecast.json?key=899f6a71bc1f49a4a1431149230802&q=vietnam&days=9&aqi=yes&alerts=no";

// HANDLE BUTTON SEARCH COUNTRY
function handleSearch() {
  const value = valueInput.value;
  if (value) {
    myAPI = `http://api.weatherapi.com/v1/forecast.json?key=899f6a71bc1f49a4a1431149230802&q=${value.toUpperCase()}&days=9&aqi=yes&alerts=no`;
    valueInput.value = "";
  } else {
    valueInput.value = "";
  }
  return myAPI;
}

// CLICK BUTTON SEARCH
btnSearch.addEventListener("click", callAPI);

// KEYPRESS ENTER INPUT
valueInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    callAPI();
    return (valueInput.value = "");
  }
});

// RENDER UI
callAPI();

// HANDLE BUTTON TYPE TEMP
button.addEventListener("click", function () {
  if (button.innerHTML === "℉") {
    button.innerHTML = "℃";
  } else {
    button.innerHTML = "℉";
  }
  callAPI();
});

//CALL API
function callAPI() {
  fetch(handleSearch())
    .then((res) => res.json())
    .then((data) => {
      const forecasts7Day = data.forecast.forecastday;
      const condition = data.forecast.forecastday[0].day;
      const todayForecast = data.forecast.forecastday[0].hour;
      const today = data.current;

      // RENDER TODAY
      let temprains = [];
      function handleTypeTempByToday() {
        let type;
        if (button.innerHTML !== "℃") {
          return (type = Math.round(today.temp_c) + "℃");
        } else {
          return (type = Math.round(today.temp_f) + "℉");
        }
      }
      temprains += `
        <div>
          <h1 class="m-0">${data.location.name}</h1>
          <p>Chance of rain: ${condition.daily_chance_of_rain}%</p>
        </div>
        <h1 class="mb-4">${handleTypeTempByToday()}</h1>
      `;
      temprain.innerHTML = temprains;
      suntoday.innerHTML = (
        <img src='${data.forecast.forecastday[0].day.condition.icon}' />
      );

      // RENDER TODAY'S FORECAST
      let datas = [];
      for (let i = 6; i < 24; i += 3) {
        function handleTypeTempByTodayForecast() {
          let type;
          if (button.innerHTML !== "℃") {
            return (type = Math.round(todayForecast[i].temp_c) + "℃");
          } else {
            return (type = Math.round(todayForecast[i].temp_f) + "℉");
          }
        }
        let time = todayForecast[i].time;
        datas += `
        <ul class="col-2">
          <li>${time.slice(11)}</li>
          <li><img src="${todayForecast[i].condition.icon}"/></li>
          <h5>${handleTypeTempByTodayForecast()}</h5>
        </ul>
      `;
      }
      todayforecast.innerHTML = datas;

      // RENDER AIR CONDITIONS
      let conditions = [];
      conditions += `
      <div class="col-5"><i class="fa-solid fa-temperature-three-quarters"></i>  Humidity <h4 class="px-4">${today.humidity}</h4></div>
      <div class="col-5"><i class="fa-solid fa-wind"> </i>  Wind <h4 class="px-4">${today.wind_kph}km/h</h4></div>
      <div class="col-5"><i class="fa-solid fa-droplet"></i>  Chance of Rain <h4 class="px-4">${condition.daily_chance_of_rain}%</h4></div>
      <div class="col-5"><i class="fa-solid fa-sun"></i>  UV Index <h4 class="px-4">${today.uv}</h4></div>
    `;
      windrain.innerHTML = conditions;

      // RENDER 7-DAY FORECAST
      let arrForecasts = [];
      forecasts7Day.map((forecast) => {
        function handleTypeTemp7DayForecast() {
          let type;
          if (button.innerHTML !== "℃") {
            return (type = Math.round(forecast.day.avgtemp_c) + "℃");
          } else {
            return (type = Math.round(forecast.day.avgtemp_f) + "℉");
          }
        }
        date = forecast.date.split("-").reverse().join("/");
        return (arrForecasts += `
        <ul class="row">
          <li class="col-3">${date.slice(0, 5)}</li>
          <li class="col-3"><img src="${forecast.day.condition.icon}"/> </li>
          <li class="col-3">${forecast.day.condition.text
            .split("possible")
            .join("")}</li>
          <li class="col-3">${handleTypeTemp7DayForecast()}</li>
        </ul>
      `);
      });
      dayforecast.innerHTML = arrForecasts;
    });
}

// const homePage = document.getElementById("home");
// const seemorePage = document.getElementById("see-more");
// const btnSeemore = document.querySelector(".taga");

// console.log(homePage.classList);

// btnSeemore.addEventListener("click", () => {
//   // homePage.classList[2].toggle("d-none");
//   // seemorePage.classList[2].toggle("d-flex");
//   seemorePage.classList.replace("d-none", "d-flex");
// });
