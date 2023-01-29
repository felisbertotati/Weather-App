var APIkey = "c828ba608f878d909ac2c8a1fd874157";
var queryURL = "https://api.openweathermap.org/";
var cityQuery;

var citySearch = JSON.parse(localStorage.getItem("search")) || [];

function getCity(e) {
  //prevent default in the function
  e.preventDefault();
  // API Key

  // the value will be saved in a variable
  var userInput = $("#search-input").val().trim();
  //if the userInput is not null or empty call the function convertToCoords
  if (userInput != null && userInput != "") {
    convertToCoords(userInput);
  } else {
    console.log("Hello world");
  }
}
// added evente in a search button
$("#search-button").on("click", getCity);

function convertToCoords(userSearch) {
  var coordsURL = `${queryURL}geo/1.0/direct?q=${userSearch}&limit=5&appid=${APIkey}`;
  // created an AJAX call
  $.ajax({
    url: coordsURL,
    method: "GET",
  }).then(function (response) {
    cityQuery = response[0].name;

    saveWeather(response[0].name);

    var lat = response[0].lat;

    var lon = response[0].lon;

    getCurrWeather(lat, lon);
  });
}

function getCurrWeather(lat, lon) {
  var currURL = `${queryURL}data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIkey}&units=metric`;
  $.ajax({
    url: currURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    displayCurrWeather(response);
  });
}

function displayCurrWeather(weather) {
  var todaySection = $("#today").empty();

  var forecastSection = $("#forecast").empty();

  // section today, I create a dinamically div
  var card = $("<div>")
    .addClass("border border-secondary  card ")
    .css({ width: "60rem", height: "20rem" });

  // section forcast, I created other section for focast
  var cardEl = $("<div>")
    .addClass(" d-flex ")
    .css({ width: "60rem", height: "10rem" });

  // forercast section will append to the cardEl
  forecastSection.append(cardEl);

  // tofay section will append to the card
  todaySection.append(card);

  // icon section
  var icon = $("<img>");
  icon.attr(
    "src",

    " http://openweathermap.org/img/wn/10d@2x.png"
  );

  console.log(icon);
  //icon.css({ width: "200px", height: "200px", "object-fit": "contain" });

  //Today section
  // created a ul list, so that i can storage the weather informattion like city, wind, temp etc..
  var list = $("<ul>").addClass("list-unstyled pl-5 ");
  //this list will append to a today card
  card.append(list);

  // city
  var cityItem = $("<li>").addClass("h2");
  // fetch from the API the city user will saerch
  var city = cityQuery;
  // Will show the city
  cityItem.text(city);

  //temperature
  var tempItem = $("<li>");
  // fech from the API the temperature
  var celsiusTemperature = weather.current.temp;
  // will show the temperature in celsios
  tempItem.text("Temp: " + celsiusTemperature + "°C");

  // wind
  var windItem = $("<li>");
  // fech from the API the wind
  var wind = weather.current.wind_speed;
  // will show the temperatue in m/s
  windItem.text("wind: " + wind + " m/s");

  // humidity
  var humidityItem = $("<li>");
  // fech from the API the humidity
  var humidity = weather.current.humidity;
  // will show the humidity in %
  humidityItem.text("humidity: " + humidity + "%");
  // console.log(humidity);
  todaySection.innerHTML = "";
  // this part will make sure all of the list will show in the screen
  list.append(cityItem);
  list.append(icon);
  list.append(tempItem);
  list.append(windItem);
  list.append(humidityItem);

  //Forecast Div
  for (var i = 0; i < 6; i++) {
    var listForcast = $("<ul>").addClass(
      "list-unstyled pl-5 card mr-4 bg-info"
    );
    cardEl.append(listForcast);

    //added temperature in the list
    var tempForecast = $("<li>");
    var tempForecastEl = weather.daily[i].temp.day;
    tempForecast.text("Temp: " + tempForecastEl + "°C");
    listForcast.append(tempForecast);
    console.log(weather.daily[i].temp.day);

    var windForecast = $("<li>");
    var windForecastEl = weather.daily[i].wind_speed;
    windForecast.text("wind: " + windForecastEl + " m/s");
    listForcast.append(windForecast);
    console.log(weather.daily[i].wind_speed);

    var humidityForecast = $("<li>");
    var humidityForecastEl = weather.daily[i].humidity;
    humidityForecast.text("humidity: " + humidityForecastEl + "%");
    listForcast.append(humidityForecast);
  }
}

function saveWeather(search) {
  console.log(search);
  var duplicate = citySearch.find((item) => search == item);

  if (duplicate) {
    return;
  } else {
    citySearch.unshift(search);
    $("#history").empty();
    localStorage.setItem("search", JSON.stringify(citySearch));
    lastHistory();
  }
}

function lastHistory() {
  var searchHistory = $("<ul>");
  citySearch.forEach((element) => {
    var searchLi = $("<li>").text(element);
    searchHistory.append(searchLi);
    console.log(element);
  });
  $("#history").append(searchHistory);
}

lastHistory();
