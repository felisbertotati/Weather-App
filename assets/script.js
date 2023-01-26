function queryWeather(e) {
  //prevent default in the function
  e.preventDefault();
  // API Key
  var APIkey = "c178ed69394716ab10a44dc28c313997";

  var userInput = $("#search-input").val().trim();
  // Here I'm build an URL that we need to query the database
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userInput +
    "&appid=" +
    APIkey;

  // created an AJAX call
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
  });
}
// added evente in a search button
$("#search-button").on("click", queryWeather);
