var apiKey = "bcdd23b6dd6d8821691e02632d9ffdc8";
var cities = [];

// getItem from local storage upon load
$(document).ready(function() {
    var storageCities = localStorage.getItem('cities');
    var storageCitiesArr = (storageCities.split(','));
    console.log(storageCitiesArr);
    // Rerender cities button arr
    for (var i = 0; i < storageCitiesArr.length; i++) {
        var a = $("<button>");
        a.addClass("city");
        a.addClass('btn');
        a.attr("data-name", storageCitiesArr[i]);
        a.text(storageCitiesArr[i]);
        $(".cities").prepend(a);
        a.insertBefore(storageCitiesArr[i]);
      } 
    });
// SEARCH -
$("#sBtn").on("click", function(event) {
  event.preventDefault();
  var city = $("#search").val();
  cities.push(city);
  renderCities();
  handleAPI($("#search").val());
  // Save to localStorage
  localStorage.setItem("cities", cities); 
  console.log("you stored ", localStorage.getItem("cities", cities));
});
// City buttons functionality
$(document).on('click', '.city', function(e){
    e.preventDefault()
    console.log($(this).attr('data-name'));
    handleAPI($(this).attr('data-name'));
})
// get all weather info
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
    console.log(temp);
    // UV Index;
    queryURLuv = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
    $.ajax({
      url: queryURLuv,
      method: "GET"
    }).then(function(response) {
      var uvIndex = (response[0].value);
      var uvIdT = $("#uv").text("UV Index: ");
      var uvIdNum = $("#num").text(uvIndex);
      console.log(uvIndex);
      uvColor();
      function uvColor(){
        if (uvIndex<2) {
          $('#num').css('background-color', 'rgba(0, 128, 0, 0.63)');
          // $('#num').addClass('green');
        }else if (uvIndex<6 && uvIndex>2){
          $('#num').css('background', 'rgba(255, 208, 0, 0.658)');
          // $('#num').addClass('yellow');
        }else if(uvIndex>6){
          $('#num').css('background', 'rgba(255, 0, 0, 0.616)');
          // $('#num').addClass('red');
        }
      }
    });
    // 5 Day forecast
        var forecastTerm = (response.name);
        // var forecastTerm = ($('#sBtn').val() || $('.city').attr('data-name'));
        var forecastArr = [];
        console.log(forecastTerm);
        console.log($('#search').val());
        console.log($('.city').attr('data-name'));
        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/forecast?q=${forecastTerm}&appid=${apiKey}&mode=json`,
            method: "GET"
        })
        .then(data => {
            for (i = 5; i < 40; i += 8) {
                forecastArr.push(data.list[i]);
                if (i === 37) {
                    console.log(forecastArr);
                    appendForecast(forecastArr);
                }
            }
        })
        // for loop to select the hour to forecast
        .catch(err => console.log(err));
    });
    //append forecast to cards
    appendForecast = arr => {
        $('#forecast').html('')
        arr.map(item => {
            var forecastDateArr = ((item.dt_txt).split(' '));
            console.log(forecastDateArr);
            var forecastDate = forecastDateArr[0];
            $("#forecast").append(`<div class='card forecastCard'><h6>${forecastDate}</h6>
            <img src='http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png'>
            <p>Temp ${parseFloat((item.main.temp - 273.15) * 1.8 + 32).toFixed(2)}</p>
            <p>Humidity: ${item.main.humidity}</p>`);
        });
  };
};
// Render cities array
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
  }
}
renderCities();
