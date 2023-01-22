var termContainerEl = document.querySelector('#user-form');
var searchTermEl = document.querySelector('#search');
var buttonEl = document.querySelector('.btn');
var repoContainerEl = document.querySelector('#repos-container');
var timeButtonsEl = document.querySelector('#time-period');
var results = document.querySelector('#repos-container');
var futureResults = document.querySelector('#future-weather');
var currentResults = document.querySelector('#current-weather');
var pastSearchContainer = document.querySelector('#past-search-container');
var futureTitleContainer = document.querySelector('#futuer-weather-title');
var citiesSearchedArray = [];
var searchTerm;
var timeSelection;

//Add event listener to store search term
var formSubmit = function (event) {
    event.preventDefault();
  
    searchTerm = searchTermEl.value.trim();

    searchTermCoordinates(searchTerm);
};

var searchTermCoordinates = function (searchTerm) {
  if (searchTerm) {
    var citiesSearchedTemp = 
    {
      city: searchTerm,
    };

    citiesSearchedArray.push(citiesSearchedTemp);

    storeInput();

    getCoordinates(searchTerm);
    searchTermEl.value = '';
  } else {
    alert('Please enter a valid city.');
  }
};

buttonEl.addEventListener('click', formSubmit);

//Add event listener to store time selection
var buttonClickHandler = function (event) {
    timeSelection = event.target.getAttribute('data-language');
  
    if (timeSelection) {
      searchTermCoordinates(searchTerm);
    }
};

timeButtonsEl.addEventListener('click', buttonClickHandler);

//Put object in storage and JSON.stringify to convert it as a string
function storeInput() {
    localStorage.setItem("citiesSearchedArray", JSON.stringify(citiesSearchedArray));
}
    
// Use JSON.parse() to convert text to JavaScript object
function init(){
    var citiesSearchedStored = JSON.parse(localStorage.getItem("citiesSearchedArray"));
    
    if (citiesSearchedStored !== null){
        citiesSearchedArray = citiesSearchedStored;
    };
    
    printPastSearches();
}
    
init();

//Get coordinates and fetch weather based on time selection
  var getCoordinates = function (searchTerm) {
    var geocoding= 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchTerm + '&limit=1&appid=0a50200db97416c63d779065700c03c2';

    fetch(geocoding)
      .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            console.log(data);
        
            var title = document.createElement('h4');
            title.textContent = searchTerm;
           
            if (results.hasChildNodes()) {
              results.removeChild(results.children[0]);
            }

            results.appendChild(title);
            currentResults.setAttribute("class", "current-weather")
        
            removeWeather();
        
            if (timeSelection == "future") {
              getWeatherFetch(data);
            } else if (timeSelection == "current") {
              getCurrentWeatherFetch(data);
            } else {
              getCurrentWeatherFetch(data);
              getWeatherFetch(data);
            }
            });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Open Weather');
      });
  };

  //Get the current weather
  var getCurrentWeatherFetch = function (data) {
    var lat = data[0].lat;
    var lon = data[0].lon;
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=0a50200db97416c63d779065700c03c2&units=imperial&lang=en';
    console.log(apiUrl);

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
            response.json().then(function (details) {
            console.log(details);
            getCurrentWeather(details);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Open Weather to get current weather data');
      });
  };

  //Get the weather forecast
  var getWeatherFetch = function (data) {
    var lat = data[0].lat;
    var lon = data[0].lon;
    var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=0a50200db97416c63d779065700c03c2&units=imperial&lang=en';
    console.log(apiUrl);

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
            response.json().then(function (details) {
            console.log(details);
            getFutureWeather(details);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Open Weather to get future weather');
      });
};

//Function to print current weather
//Current: Add date, display an icon representation of weather conditions, the temperature, the humidity, and the wind speed
var getCurrentWeather = function (details) {

    if (details.length === 0) {
      repoContainerEl.textContent = 'No weather found.';
      return;
    }

    var date = document.createElement('h5');
    var currentDate = dayjs().format('MM-DD-YYYY');
    date.textContent = currentDate;
    currentResults.appendChild(date);

    //icon
    var icon = document.createElement('img');
    var iconValCode = details.weather[0].icon;
    var iconVal = "http://openweathermap.org/img/wn/" + iconValCode + "@2x.png";
    icon.setAttribute("src", iconVal);
    currentResults.appendChild(icon);

    //temperature
    var temp = document.createElement('h6');
    var tempVal = details.main.temp;
    temp.textContent = "Temp: " + tempVal + "°F";
    currentResults.appendChild(temp);

    //humidity
    var humidity = document.createElement('h6');
    var humidityVal = details.main.humidity;
    humidity.textContent = "Humidity: " + humidityVal + "%";
    currentResults.appendChild(humidity);

    //windspeed
    var windspeed = document.createElement('h6');
    var windspeedVal = details.wind.speed;
    windspeed.textContent = "Wind: " + windspeedVal + "MPH";
    currentResults.appendChild(windspeed);
};

//Function to print future weather
//Future: Add 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
var getFutureWeather = function (details) {
  
  if (details.length === 0) {
    repoContainerEl.textContent = 'No weather found.';
    return;
  }

  var futureTitle = document.createElement('h4');
  futureTitle.textContent = "5-Day Forecast";
  futureTitleContainer.appendChild(futureTitle);

  for (i = 7; i < 40; i++) {
    var divFuture = document.createElement('div');
    divFuture.setAttribute('class', "futureday");
    futureResults.appendChild(divFuture);

    var date = document.createElement('h5');
    var todaysDate = details.list[i].dt_txt;
    var dateVal = todaysDate.slice(5, 10);
    date.textContent = dateVal;
    divFuture.appendChild(date);

    //icon
    var icon = document.createElement('img');
    var iconValCode = details.list[i].weather[0].icon;
    var iconVal = "http://openweathermap.org/img/wn/" + iconValCode + "@2x.png";
    icon.setAttribute("src", iconVal);
    divFuture.appendChild(icon);

    //temperature
    var temp = document.createElement('h6');
    var tempVal = details.list[i].main.temp;
    temp.textContent = "Temp: " + tempVal + "°F";
    divFuture.appendChild(temp);

    //humidity
    var humidity = document.createElement('h6');
    var humidityVal = details.list[i].main.humidity;
    humidity.textContent = "Humidity: " + humidityVal + "%";
    divFuture.appendChild(humidity);

    //windspeed
    var windspeed = document.createElement('h6');
    var windspeedVal = details.list[i].wind.speed;
    windspeed.textContent = "Wind: " + windspeedVal + "MPH";
    divFuture.appendChild(windspeed);

    i = i + 7;
  }
};

//Remove future printed weather results
var removeWeather = function () {

  if (currentResults.hasChildNodes()) {
    currentResults.removeAttribute("class", "current-weather");
    for (var i = 0; i < 5; i++) {
      currentResults.removeChild(currentResults.children[0]);
    }
  }

  if (futureTitleContainer.hasChildNodes()) {
    futureTitleContainer.removeChild(futureTitleContainer.children[0]);
  }

  if (futureResults.hasChildNodes()) {
    for (var i = 0; i < 5; i++) {
      futureResults.removeChild(futureResults.children[0]);
    }
  }
}

//Print past search terms to left column
var citySearchedListItem;

function printPastSearches() {
  var pastSearchHeader = document.createElement("h3");
  pastSearchHeader.textContent = "VIEW PAST SEARCHES";
  pastSearchContainer.appendChild(pastSearchHeader);
  var unduplicatedCitiesSearchedArray = [];

  for (var i = 0; i < citiesSearchedArray.length; i++) {
      if (!unduplicatedCitiesSearchedArray.includes(citiesSearchedArray[i].city)) {
          unduplicatedCitiesSearchedArray.push(citiesSearchedArray[i].city);
          console.log(unduplicatedCitiesSearchedArray);
      };
  };

  for (var i = 0; i < unduplicatedCitiesSearchedArray.length; i++) {
      var lastCitySearched = unduplicatedCitiesSearchedArray[i];

      if (lastCitySearched) {
        citySearchedListItem = document.createElement("p");
        citySearchedListItem.textContent = lastCitySearched;
        pastSearchContainer.appendChild(citySearchedListItem);
        citySearchedListItem.setAttribute('data-language', lastCitySearched);
      }
  };
};

//Click on past search term and again presented with those results
var pastSearchClickHandler = function (event) {
  var citySearchId = event.target.getAttribute('data-language');

  if (citySearchId) {
      searchTerm = citySearchId;
      searchTermCoordinates(searchTerm);
  }
};

pastSearchContainer.addEventListener('click', pastSearchClickHandler);