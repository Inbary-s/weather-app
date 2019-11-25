var apiKey = "bcdd23b6dd6d8821691e02632d9ffdc8";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=Denver&appid=" + apiKey;

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
      console.log(response)
  })
