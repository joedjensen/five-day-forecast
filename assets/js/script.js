var todayEl = $("#today")
var searchTextEl = $("#search-text")
var searchBtnEl = $("#search-btn")
var buttonListEl = $("#button-list")
var resultsEl = $("#results")
var cityHistory = {};


resultsEl.hide()

if (localStorage.getItem("city-history")) {
    resultsEl.show()
    cityHistory = JSON.parse(localStorage.getItem("city-history"))
    for (const city in cityHistory) {
        addButtonToList(city)
    }
    var lastCity = cityHistory[Object.keys(cityHistory)[Object.keys(cityHistory).length - 1]]
    populateToday(lastCity)
    populate5day(lastCity)
}

function parseDailyData(dailyData) {
    var dailyObject = {
        date: dayjs.unix(dailyData.dt).format('MM/DD/YYYY'),
        iconLink: dailyData.weather[0].icon,
        temp: dailyData.main.temp,
        windSpeed: dailyData.wind.speed,
        humidity: dailyData.main.humidity
    }
    return dailyObject
}

function populateToday(cityObject) {
    todayEl.empty()
    populateElement(todayEl, cityObject.today)
}

function populate5day(cityObject) {
    var fiveDayEl = $('#5-day')
    fiveDayEl.empty()
    for (i = 0; i < cityObject.fiveDay.length; i++) {
        var dayEl = $("<div>", { "class": "five-day-card card col-2 text-white" })
        populateElement(dayEl, cityObject.fiveDay[i])
        fiveDayEl.append(dayEl)
    }
}

function populateElement(element, dailyObject) {
    var headerEl = $("<h2>")
    var tempEl = $('<p>')
    var windEl = $('<p>')
    var humidityEl = $('<p>')
    if (dailyObject.cityName) {
        headerEl.html(dailyObject.cityName + ' (' + dailyObject.date + ')<img src =\'https://openweathermap.org/img/wn/' + dailyObject.iconLink + '@2x.png\' width = "50">')
    }
    else {
        headerEl.html(dailyObject.date + '<img src =\'https://openweathermap.org/img/wn/' + dailyObject.iconLink + '@2x.png\' width = "50">')
    }
    tempEl.html("Temp: " + dailyObject.temp + " &#8457")
    windEl.text("Wind: " + dailyObject.windSpeed + " mph")
    humidityEl.html("Humidity: " + dailyObject.humidity + "&#x25")
    element.append(headerEl, tempEl, windEl, humidityEl)
}

searchBtnEl.on("click", fetchFromApi)

function fetchFromApi(event) {
    var cityObject = {}
    event.preventDefault()
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchTextEl.val() + '&units=imperial&appid=392099826df334ba983729313c628cd7')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            populateWeatherObjectDaily(data)
            populateToday(cityObject)
            fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchTextEl.val() + '&units=imperial&appid=392099826df334ba983729313c628cd7')
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data)
                    populateWeatherObject5Day(data)
                    populate5day(cityObject)
                    if (!(data.city.name in cityHistory)) {
                        if (Object.keys(cityHistory).length > 9) {
                            delete cityHistory[Object.keys(cityHistory)[0]]
                            buttonListEl.empty()
                            for (const city in cityHistory) {
                                addButtonToList(city)
                            }
                        }
                        addButtonToList(data.city.name)
                    }
                    cityHistory[data.city.name] = cityObject;
                    localStorage.setItem("city-history", JSON.stringify(cityHistory))
                    cityHistory = JSON.parse(localStorage.getItem("city-history"))
                    resultsEl.show()
                });
        })
        .catch(function () {
            alert("City \""+searchTextEl.val() + "\" not found")
        });

    function populateWeatherObjectDaily(dailyResponse) {
        cityObject['today'] = parseDailyData(dailyResponse)
        cityObject['today']['cityName'] = dailyResponse.name
    }

    function populateWeatherObject5Day(fiveDayResponse) {
        var array = []
        for (i = 0; i < fiveDayResponse.list.length; i++) {
            var hour = dayjs.unix(fiveDayResponse.list[i].dt).hour()
            if (i % 8 == 7) {
                array.push(parseDailyData(fiveDayResponse.list[i]))
            }
        }
        cityObject['fiveDay'] = array
    }
}

function addButtonToList(name) {
    var buttonEl = $("<button>", { "class": "btn btn-secondary col-12 my-1" })
    buttonEl.text(name)
    buttonEl.attr("data-city-name", name)
    buttonListEl.prepend(buttonEl)
}

function fetchFromLocal(event) {
    cityHistory = JSON.parse(localStorage.getItem("city-history"))
    var cityObject = cityHistory[$(this).attr("data-city-name")]
    populateToday(cityObject)
    populate5day(cityObject)
}

buttonListEl.on("click", "button", fetchFromLocal)


searchTextEl.on("keyup", function () {
    searchBtnEl.prop("disabled", searchTextEl.val().length == 0);
})
searchBtnEl.prop("disabled", true);


