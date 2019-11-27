var apiKey = "bcdd23b6dd6d8821691e02632d9ffdc8";
var cities = [];
// var m = moment();
// console.log(m);

//   SEARCH - 
$("#sBtn").on("click", function(event){
    event.preventDefault();
    var searchTerm = "q=" + $("#search").val() + "&appid="; 
    console.log(searchTerm);
    var queryURLNew = "https://api.openweathermap.org/data/2.5/weather?" + searchTerm + apiKey;
    $.ajax({
        url: queryURLNew,
        method: "GET"
    }).then(function(response){
        console.log(response)
        function displayCity(){
            $(cityInfo).empty();
            var name = response.name;
            var iconCode = response.weather[0].icon;
            var icon = "http://openweathermap.org/img/wn/"+ iconCode + "@2x.png";
            $(".icon").attr("src", icon);
            var day = (moment().format("LL"));
            var cityName = $("<h3>").text(name + " (" + day + ")");
            var temp = parseFloat((response.main.temp - 273.15) * 1.80 + 32).toFixed(2);
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            $("#temp").text("Temperature: " + temp);
            $("#cityInfo").append(cityName);
            $("#humidity").text("Humidity: " + response.main.humidity);
            $("#wind").text("Wind Speed: " + response.wind.speed);
            // $(".icon").html(icon);
            
            // UV Index;
            console.log(temp);
            queryURLuv = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
            $.ajax({
            url: queryURLuv,
            method: "GET"
        }).then(function(response){
            console.log(response[0].value);
            $("#uv").text("UV Index: " + response[0].value);
        });
            

    }
    displayCity();
    
    var city = $("#search").val(); 
    cities.push(city);
    console.log(city);
    renderCities();
})

// $(".city").on("click", function(event){ ==== WHY DOESN'T THIS WORK ://
//     event.preventDefault();
//     displayCity();
//     console.log($(this).attr('data-name'));
// });
})
function renderCities(){
    $(".cities").empty();
    
    for (var i = 0; i<cities.length; i++){
        var a = $("<button>");
        a.addClass("city, btn");
        a.attr("data-name", cities[i]);
        a.text(cities[i]);
        $(".cities").prepend(a);
        a.insertBefore(cities[i])
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
