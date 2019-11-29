var apiKey = "bcdd23b6dd6d8821691e02632d9ffdc8";
var cities = [];
// var m = moment();
// console.log(m);

//   SEARCH -
// $(window).on('load', function() {
// //     // storageCities=[];
//     console.log(localStorage.getItem("cities", cities));
//     var storageCities = [localStorage.getItem("cities", cities)];
//     // var storageCitiesArr = JSON.parse(storageCities);
//     console.log(storageCitiesArr);

//     for (var i = 0; i < storageCities.length; i++) {
//         var a = $("<button>");
//         a.addClass("city");
//         a.addClass('btn');
//         a.attr("data-name", storageCities[i]);
//         a.text(storageCities[i]);
//         $(".cities").prepend(a);
//         a.insertBefore(storageCities[i]);
//       }
// });

$("#sBtn").on("click", function(event) {
  event.preventDefault();
  var city = $("#search").val();
  cities.push(city);
  renderCities();
  handleAPI($("#search").val());
});

$(document).on('click', '.city', function(e){
    e.preventDefault()
    console.log($(this).attr('data-name'))
    handleAPI($(this).attr('data-name'))
})

handleAPI = term => {
  var queryURLNew =
    `https://api.openweathermap.org/data/2.5/weather?q=${term}&appid=${apiKey}`;
  $.ajax({
    url: queryURLNew,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    $(cityInfo).empty();
    var name = response.name;
    var iconCode = response.weather[0].icon;
    var icon = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    $("#icon").attr("src", icon);
    var day = moment().format("LL");
    var cityName = $("<h3>").text(name + " (" + day + ")");
    var temp = parseFloat((response.main.temp - 273.15) * 1.8 + 32).toFixed(2);
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    $("#temp").text("Temperature: " + temp);
    $("#cityInfo").html(cityName);
    $("#humidity").text("Humidity: " + response.main.humidity);
    $("#wind").text("Wind Speed: " + response.wind.speed);
    // $(".icon").html(icon);

    // UV Index;
    console.log(temp);
    queryURLuv = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
    $.ajax({
      url: queryURLuv,
      method: "GET"
    }).then(function(response) {
      console.log(response[0].value);
      $("#uv").text("UV Index: " + response[0].value);
      var forecastArr = [];
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/forecast?q=denver&appid=bcdd23b6dd6d8821691e02632d9ffdc8&mode=json`,
        method: "GET"
      })
        .then(data => {
          for (i = 4; i < 40; i += 8) {
            forecastArr.push(data.list[i]);
            if (i === 36) {
              console.log(forecastArr);
              appendForecast(forecastArr);
            }
          }
        })
        .catch(err => console.log(err));
    });

    appendForecast = arr => {
        $('#forecast').html('')
      arr.map(item => {
        $("#forecast").append(`<div class='card forecastCard'><h6>${item.dt_txt}</h6>
        <img src='http://openweathermap.org/img/wn/${
          item.weather[0].icon
        }@2x.png'>
        <p>Temp ${parseFloat((item.main.temp - 273.15) * 1.8 + 32).toFixed(
          2
        )}</p>
        <p>Humidity: ${item.main.humidity}</p>`);
      });
    };


  });
};

$("#sBtn").on("click", function(e) {
    e.preventDefault();
  
    localStorage.setItem("cities", cities); //works!!!!!!!!!!!
  
    console.log("you stored ", localStorage.getItem("cities", cities));
   
  });



function renderCities() {
  $(".cities").empty();

  for (var i = 0; i < cities.length; i++) {
    var a = $("<button>");
    a.addClass("city");
    a.addClass('btn');
    a.attr("data-name", cities[i]);
    a.text(cities[i]);
    $(".cities").prepend(a);
    a.insertBefore(cities[i]);
    localStorage.setItem("cities", cities); 
    console.log("you stored ", localStorage.getItem("cities", cities));
    var arr = $.makeArray(localStorage.getItem("cities", cities));
  }
}

renderCities();

//     queryURL - every time trigerred, add city to head of city list (appending to the city [])
//     queryURL - every time trigerred, present the following data for that city:
//     - Temp'
//     - Humidity
//     - Wind Speed
//     - UV index
//     - 5 day forecast (another ajax call?) - include:
//         -- date
//         -- little weather icon (sun, clouds, etc.)
//         -- median temp'
//         -- median humiditiy
