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
  $("#search-input").val("");
}
// added evente in a search button
$("#search-button").on("click", getCity);

function convertToCoords(userSearch) {
  //call from the API the coords
  var coordsURL = `${queryURL}geo/1.0/direct?q=${userSearch}&limit=5&appid=${APIkey}`;
  // created an AJAX call
  $.ajax({
    url: coordsURL,
    method: "GET",
  }).then(function (response) {
    // fetch the name of the city
    cityQuery = response[0].name;
    // after same in the saveWeathe function
    saveWeather(response[0].name);

    // var latitude
    var lat = response[0].lat;

    // var longitude
    var lon = response[0].lon;
    // after save in the function getCurrWeather
    getCurrWeather(lat, lon);
  });
}

function getCurrWeather(lat, lon) {
  // call from the API lat and lon to retrive the current weather
  var currURL = `${queryURL}data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIkey}&units=metric`;
  $.ajax({
    url: currURL,
    method: "GET",
  }).then(function (response) {
    // we will pass the results to the displayCurrWeather function
    displayCurrWeather(response);
  });
}

function displayCurrWeather(weather) {
  // access to the object and take the date
  var date = weather.current.dt;

  // use moment to convert the date
  var formatDate = moment.unix(date).format("DD/MM/YYYY");

  //call id today  and forecats from Html
  var todaySection = $("#today").empty();

  var forecastSection = $("#forecast").empty();

  // section today, I create a dinamically div
  var card = $("<div>")
    .addClass(" card border border-info")
    .css({ width: "60rem", height: "300px" });

  // section forcast, I created other section for focast
  var cardEl = $("<div>").addClass(" d-flex space-between ");

  // create a paagraph
  var paragraph = $("<h3>");
  paragraph.text("5-Day Forecast");

  forecastSection.append(paragraph);
  // forercast section will append to the cardEl
  forecastSection.append(cardEl);

  // tofay section will append to the card
  todaySection.append(card);

  // icon section
  var icon = $("<img>");
  // call the API the icon
  icon.attr(
    "src",

    `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`
  );

  //icon.css({ width: "200px", height: "200px", "object-fit": "contain" });

  //Today section
  // created a ul list, so that i can storage the weather informattion like city, wind, temp etc..
  var list = $("<ul>").addClass("list-unstyled pl-5 ");
  //this list will append to a today card
  card.append(list);

  // city
  var cityItem = $("<li>").addClass("h2 pb-4");
  // fetch from the API the city user will saerch
  var city = cityQuery;
  // Will show the city
  cityItem.text(city + " (" + formatDate + ")");

  //temperature
  var tempItem = $("<li>").addClass("pb-2");
  // fech from the API the temperature
  var celsiusTemperature = weather.current.temp;
  // will show the temperature in celsios
  tempItem.text("Temp: " + celsiusTemperature + "°C");

  // wind
  var windItem = $("<li>").addClass("pb-2");
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
  for (var i = 0; i < 5; i++) {
    var listForcast = $("<ul>")
      .addClass("list-unstyled card mr-5 bg-info")
      .css({ height: "250px", padding: "24px" });
    cardEl.append(listForcast);

    // access to the object and take the date
    // use moment to convert the date
    var dailyDate = $("<li>");
    var dateEl = weather.daily[i].dt;
    var formatDateEl = moment.unix(dateEl).format("DD/MM/YYYY");
    dailyDate.text(formatDateEl);
    listForcast.append(dailyDate);

    var iconEl = $("<img>");
    iconEl.attr(
      "src",

      `http://openweathermap.org/img/wn/${weather.daily[i].weather[0].icon}.png`
    );

    listForcast.append(iconEl);
    //added temperature in the list
    var tempForecast = $("<li>");
    var tempForecastEl = weather.daily[i].temp.day;
    tempForecast.text("Temp: " + tempForecastEl + "°C");
    listForcast.append(tempForecast);
    console.log(weather.daily[i].temp.day);
    //added wind
    var windForecast = $("<li>");
    var windForecastEl = weather.daily[i].wind_speed;
    windForecast.text("wind: " + windForecastEl + " m/s");
    listForcast.append(windForecast);
    console.log(weather.daily[i].wind_speed);
    //added humidity
    var humidityForecast = $("<li>");
    var humidityForecastEl = weather.daily[i].humidity;
    humidityForecast.text("humidity: " + humidityForecastEl + "%");
    listForcast.append(humidityForecast);
  }
}

// this var makes that user when search doesn't duplicate the items
function saveWeather(search) {
  console.log(search);

  var duplicate = citySearch.find((item) => search == item);

  if (duplicate) {
    return;
  } else {
    //last search will show on the top
    citySearch.unshift(search);
    $("#history").empty();
    localStorage.setItem("search", JSON.stringify(citySearch));
    lastHistory();
  }
}

function lastHistory() {
  $("#history").css({
    display: "flex",
    "flex-direction": "column",
  });
  //created dynamically buttons
  var clearButton = $("<button>");
  clearButton.text("Clear History").addClass(" btn btn-info mb-2");
  // the search only can have untill 10 searchs
  citySearch.splice(10);

  citySearch.forEach((element) => {
    var searchLi = $("<button>")
      .text(element)
      .addClass("btn btn-outline-info mb-2 ");
    searchLi.on("click", function () {
      var value = $(this).text();
      convertToCoords(value);
    });
    $("#history").prepend(clearButton);
    $("#history").append(searchLi);
  });

  // added a clear button. if user would like to clean his history
  clearButton.on("click", function () {
    localStorage.clear();
    $("#history button").remove();
    citySearch = [];
  });
}

lastHistory();
