
var todayEl = $("#today")


fetch('https://api.openweathermap.org/data/2.5/forecast?q=Peekskill&units=imperial&appid=392099826df334ba983729313c628cd7')
.then(function (response) {
    return response.json();
})
.then(function (data) {
    // console.log(data.results);
    console.log(data)
    populateToday(data)
    populate5day(data)
});

function populateToday (weatherObject) {
    todayEl.empty()
    var headerEl = $("<h2>")
    var tempEl = $('<p>')
    var windEl = $('<p>')
    var humidityEl = $('<p>')
    headerEl.html(weatherObject.city.name + ' ' + dayjs.unix(weatherObject.list[0].dt).format('(MM/DD/YYYY)') + '<img src =\'http://openweathermap.org/img/wn/10d@2x.png\' width = "50">')
    tempEl.html("Temp: " + weatherObject.list[0].main.temp + " &#8457")
    windEl.text("Wind Speed: " + weatherObject.list[0].wind.speed + " mph")
    humidityEl.html("Humidity: "  + weatherObject.list[0].main.humidity + "&#x25")
    todayEl.append(headerEl, tempEl, windEl, humidityEl)
}

function populate5day(weatherObject) {
    var fiveDayEl = $('#5-day')
    fiveDayEl.empty()
    for (i=1; i<weatherObject.list.length; i++) {
        if (i % 8 ==0) {
            var dayEl = $("<div>", {"class" : "card col-2"})
            var headerEl = $("<h6>")
            var tempEl = $('<p>')
            var windEl = $('<p>')
            var humidityEl = $('<p>')
            headerEl.html(dayjs.unix(weatherObject.list[i].dt).format('(MM/DD/YYYY)') + '<img src =\'http://openweathermap.org/img/wn/10d@2x.png\' width = "30">')
            tempEl.html("Temp: " + weatherObject.list[i].main.temp + " &#8457")
            windEl.text("Wind Speed: " + weatherObject.list[i].wind.speed + " mph")
            humidityEl.html("Humidity: "  + weatherObject.list[i].main.humidity + "&#x25")
            dayEl.append(headerEl, tempEl, windEl, humidityEl)
            fiveDayEl.append(dayEl)
        }
    }
    }