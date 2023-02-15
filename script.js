const valueInput = document.querySelector(".searchInput");
const iconWeatherMain = document.querySelector(".iconWeatherMain");
const locationElement = document.querySelector(".location");
const btnSearch = document.querySelector(".btnSearch");
const timeCurrent = document.querySelector(".dayOfWeek");
const temp = document.querySelector(".tempDetail");
const describeWeather = document.querySelector(".describeWeather");
const hourCurrent = document.querySelector(".hour");
const test = document.querySelector(".weatherDay");
const uvIndex = document.querySelector(".uvIndex");
const windStatus = document.querySelector(".windStatus");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility");
const airQuality = document.querySelector(".airQuality");
const weatherDay = document.querySelectorAll(".weatherDay");
const option = document.querySelectorAll(".option");
const degree = document.querySelector(".degree");
const btnOption = document.querySelectorAll(".btnOption");
var timeCurr;

let degreeF = false;

const checkDegreeF = (value) => {
  if (degreeF) {
    option[0].childNodes[1].classList.remove("bg-primary");
    option[0].childNodes[1].classList.remove("text-white");
    option[0].childNodes[3].classList.add("bg-primary");
    option[0].childNodes[3].classList.add("text-white");
    option[0].childNodes[1].classList.add("disable");
    temp.innerText = value;
    degree.innerText = "°F";
  } else {
    option[0].childNodes[1].classList.add("bg-primary");
    option[0].childNodes[1].classList.add("text-white");
    option[0].childNodes[3].classList.remove("bg-primary");
    option[0].childNodes[3].classList.remove("text-white");
    option[0].childNodes[3].classList.add("disable");
    temp.innerText = value;
    degree.innerText = "°C";
  }
};

let myAPI = "";
function handleSearch() {
  const value = valueInput.value;
  if (value) {
    myAPI = `http://api.weatherapi.com/v1/forecast.json?key=afc9a0553a954615a5731105230802&q=${value.toUpperCase()}&days=10&aqi=yes&alerts=no`;
    valueInput.value = "";
  } else {
    myAPI =
      "http://api.weatherapi.com/v1/forecast.json?key=afc9a0553a954615a5731105230802&q=Hanoi&days=10&aqi=yes&alerts=no";

    valueInput.value = "";
  }
  return myAPI;
}

const callAPI = () => {
  fetch(handleSearch())
    .then((res) => res.json())
    .then((data) => {
      const forecasts10Day = data.forecast.forecastday;
      const condition = data.forecast.forecastday[0].day;
      // const astro = data.forecast.forecastday[index].astro;
      const location = data.location;
      const timeArray = location.localtime.split(" ");
      let h = Number(timeArray[1].split(":")[0]);
      let m = getMinute();
      // let m = Number(timeArray[1].split(":")[1]);
      let s = getSecond();
      const innerTimeCurrent = () => {
        let hourStr = h < 10 ? "0" + h : "" + h;
        let minStr = m < 10 ? "0" + m : "" + m;
        let secStr = s < 10 ? "0" + s : "" + s;
        hourCurrent.innerHTML = hourStr + ":" + minStr + ":" + secStr;
      };
      innerTimeCurrent();

      timeCurr = setInterval(function () {
        if (s + 1 == 60) {
          s = 0;
          m = m + 1;
        } else {
          s++;
        }
        if (m == 60) {
          m = 0;
          h = h + 1;
        }
        innerTimeCurrent();
      }, 1000);
      const todayWeather = (index = 0) => {
        const forecasts10Day = data.forecast.forecastday;
        const condition = data.forecast.forecastday[index].day;
        const astro = data.forecast.forecastday[index].astro;
        const location = data.location;
        //   const todayForecast = data.forecast.forecastday[0].hour;
        // const today = data.current;
        iconWeatherMain.src = handleWeatherType(condition.condition);
        temp.innerText = condition.avgtemp_c;

        locationElement.innerText = location.name;
        timeCurrent.innerText = forecasts10Day[index].date;
        describeWeather.innerText = condition.condition.text;
        // startTime();

        //Today's Highlights API
        uvIndex.innerText = condition.uv;
        windStatus.innerText = condition.maxwind_kph;
        sunrise.innerText = astro.sunrise;
        sunset.innerText = astro.sunset;
        humidity.innerText = condition.avghumidity;
        visibility.innerText = condition.avgvis_km;
        airQuality.innerText = Math.round(condition.air_quality.pm10);
      };

      todayWeather(0);

      //Weather fulture API
      weatherDay.forEach((element, index) => {
        const arrDate = forecasts10Day[index].date.split("-");
        element.childNodes[1].innerText = arrDate[1] + "-" + arrDate[2];
        element.childNodes[3].src = forecasts10Day[index].day.condition.icon;
        element.childNodes[5].childNodes[1].innerText =
          Math.round(forecasts10Day[index].day.maxtemp_c) + "°";
        element.childNodes[5].childNodes[3].innerText =
          Math.round(forecasts10Day[index].day.mintemp_c) + "°";
      });
      option[0].childNodes[1].addEventListener("click", function () {
        degreeF = false;
        checkDegreeF(condition.avgtemp_c);
        weatherDay.forEach((element, index) => {
          element.childNodes[5].childNodes[1].innerText =
            Math.round(forecasts10Day[index].day.maxtemp_c) + "°";
          element.childNodes[5].childNodes[3].innerText =
            Math.round(forecasts10Day[index].day.mintemp_c) + "°";
        });
      });

      option[0].childNodes[3].addEventListener("click", function () {
        degreeF = true;
        checkDegreeF(condition.avgtemp_f);
        weatherDay.forEach((element, index) => {
          element.childNodes[5].childNodes[1].innerText =
            Math.round(forecasts10Day[index].day.maxtemp_f) + "°";
          element.childNodes[5].childNodes[3].innerText =
            Math.round(forecasts10Day[index].day.mintemp_f) + "°";
        });
      });

      weatherDay.forEach((element, index) => {
        element.addEventListener("click", function () {
          todayWeather(index);
        });
      });
      // Chart
      let timehour = parseInt(data.current.last_updated.slice(10, 13));
      let arrTime = [];
      let arrTemp = [];
      for (let i = 0; i < 24; i++) {
        if (timehour + 1 >= 24) {
          arrTime.push(
            data.forecast.forecastday[1].hour[timehour + 1 - 24].time.slice(11)
          );
          arrTemp.push(
            data.forecast.forecastday[1].hour[timehour + 1 - 24].temp_c
          );
        } else {
          arrTime.push(
            data.forecast.forecastday[0].hour[timehour + 1].time.slice(11)
          );
          arrTemp.push(data.forecast.forecastday[1].hour[timehour + 1].temp_c);
        }
        timehour = timehour + 1;
      }
      new Chart("tempChart", {
        type: "line",
        data: {
          labels: arrTime,
          datasets: [
            {
              data: arrTemp,
              borderColor: "red",
              fill: true,
            },
          ],
        },
        options: {
          legend: { display: false },
        },
      });
    })
    .catch((e) => {
      alert("Please enter the correct city or country name!!", e);
    });
};

option[0].childNodes[5].addEventListener("click", function () {
  const body = document.querySelector("body");
  const content = document.querySelector("#content");
  const hightlight = document.querySelectorAll(".hightlight");

  body.classList.toggle("darkMode");
  content.classList.toggle("darkMode2");
  weatherDay.forEach((element) => {
    element.classList.toggle("darkMode");
  });
  hightlight.forEach((element) => {
    element.classList.toggle("darkMode");
  });
  btnOption.forEach((element) => {
    element.classList.toggle("darkMode");
  });
  btnOption[2].childNodes[1].classList.toggle("fa-moon");
  btnOption[2].childNodes[1].classList.toggle("fa-sun");
});

const getSecond = () => {
  const d = new Date();
  return d.getSeconds();
};

const getMinute = () => {
  const d = new Date();
  return d.getMinutes();
};

// const getTime = () => {
//   const d = new Date();
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   let dayOfWeek = days[d.getDay()];
//   let month = months[d.getMonth()];
//   let day = d.getDate();
//   let time = `${dayOfWeek}, ${month} ${day}`;
//   return time;
// };

const handleWeatherType = (weather) => {
  switch (weather.text) {
    case "Sunny":
      return "assets/sunny.png";
    case "Clear":
      return "assets/clear.png";
    case "Overcast":
      return "assets/cloud.png";
    case "Partly cloudy":
      return "assets/cloudy_night.png";
    case "Light drizzle":
      return "assets/rain_light.png";
    case "Patchy rain possible":
      return "assets/rain_light.png";
    case "Cloudy":
      return "assets/cloudy.png";
    case "Moderate rain":
      return "assets/rain_s_cloudy.png";
    case "Moderate or heavy snow showers":
      return "assets/rain_s_cloudy.png";
    default:
      return weather.icon;
  }
};

callAPI();

// CLICK BUTTON SEARCH
btnSearch.addEventListener("click", function () {
  clearInterval(timeCurr);
  callAPI();
});

// KEYPRESS ENTER INPUT
valueInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    clearInterval(timeCurr);
    callAPI();
    return (valueInput.value = "");
  }
});

btnOption[3].addEventListener("click", function () {
  const modalSeemore = document.querySelector(".modal-seemore");
  modalSeemore.classList.add("d-flex");
  const modalClose = document.querySelector(".modal-close");
  const modalContainer = document.querySelector(".modal-container");

  const closeModal = () => {
    modalSeemore.classList.remove("d-flex");
  };

  modalClose.addEventListener("click", closeModal);

  modalSeemore.addEventListener("click", closeModal);

  modalContainer.addEventListener("click", function (event) {
    event.stopPropagation();
  });
});
