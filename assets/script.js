var APIkey = "c828ba608f878d909ac2c8a1fd874157";
var queryURL = "https://api.openweathermap.org/";
var cityQuery;

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
  var todaySection = $("#today");
  var forecastSection = $("#forecast");

  // section today, I create a dinamically div
  var card = $("<div>")
    .addClass("border border-secondary  card ")
    .css({ width: "60rem", height: "10rem" });

  // section forcast, I created other section for focast
  var cardEl = $("<div>")
    .addClass("border border-secondary  card ")
    .css({ width: "60rem", height: "10rem" });

  // forercast section will append to the cardEl
  forecastSection.append(cardEl);

  // tofay section will append to the card
  todaySection.append(card);

  // icon section
  var icon = $("<img>");
  icon.attr(
    "scr",

    "https://openweathermap.org/img/wn/10d@2x.png"
  );

  //icon.css({ width: "200px", height: "200px", "object-fit": "contain" });

  //Today section
  // created a ul list, so that i can storage the weather informattion like city, wind, temp etc..
  var list = $("<ul>").addClass("list-unstyled pl-5");
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

  // this part will make sure all of the list will show in the screen
  list.append(cityItem);
  list.append(icon);
  list.append(tempItem);
  list.append(windItem);
  list.append(humidityItem);

  //Forecast Div
}

// function DisplayFiveDays(daily) {
//   //html id forecats
//   var dailyWeather = $("#forecast");

//   //created a bootstrap card and after I append to the forecast ID
//   var cardEl = $("<div>");
//   // .addClass("card bg-info")
//   // .css({ width: "18rem", height: "20rem" });

//   dailyWeather.append(cardEl);
// }
