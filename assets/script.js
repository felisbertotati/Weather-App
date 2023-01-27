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
  // Here I'm building an URL that we need to query the database

  // created a div to add my elements inside
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
    console.log(response);
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
    displayCurrWeather(response);
  });
}

function displayCurrWeather(weather) {
  var todaySection = $("#today");

  var card = $("<div>")
    .addClass("bg-dark card ")
    .css({ width: "60rem", height: "10rem" });

  todaySection.append(card);

  var list = $("<ul>");

  card.append(list);

  var cityItem = $("<li>");
  var city = cityQuery;
  cityItem.text(city);

  // var tempItem = $("<li>");
  // var celsiusTemperature = Math.floor(response.main.temp - 273.15);
  // tempItem.text(celsiusTemperature);

  // var windItem = $("<li>");
  // var wind = response.wind.speed;
  // windItem.text(wind);

  // var humidityItem = $("<li>");
  // var humidity = response.main.humidity;
  // humidityItem.text(humidity);
  // console.log(humidity);

  list.append(cityItem);

  // list.append(tempItem);

  // list.append(windItem);

  // list.append(humidityItem);
}
