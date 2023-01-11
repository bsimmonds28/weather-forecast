var termContainerEl = document.querySelector('#user-form');
var searchTermEl = document.querySelector('#search');
var buttonEl = document.querySelector('.btn');
var repoContainerEl = document.querySelector('#repos-container');
var timeButtonsEl = document.querySelector('#time-period');
var results = document.querySelector('#repos-container');
var futureResults = document.querySelector('#future-weather');
var currentResults = document.querySelector('#current-weather');
var pastSearchContainer = document.querySelector('#past-search-container');
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

//Get city repos
var getCoordinates = function (searchTerm) {
    var geocoding= 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchTerm + '&limit=1&appid=0a50200db97416c63d779065700c03c2';

    fetch(geocoding)
      .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            console.log(data);
            getWeather(data);
            });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Open Weather');
      });
  };

  var getWeather = function (data) {
    var lat = data[0].lat;
    var lon = data[0].lon;
    var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=0a50200db97416c63d779065700c03c2&units=imperial&lang=en';
    console.log(apiUrl);

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
            response.json().then(function (details) {
            console.log(details);
            displayRepos(details);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Open Weather');
      });
};

//Display city name
//Current: Add date, display an icon representation of weather conditions, the temperature, the humidity, and the wind speed
//Future: Add 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
var displayRepos = function (details) {
    if (details.length === 0) {
      repoContainerEl.textContent = 'No weather found.';
      return;
    }

    var title = document.createElement('h4');
    title.textContent = searchTerm;
    results.appendChild(title);
    
    if (timeSelection == "current") {
        getCurrentWeather(details);

    } else if (timeSelection == "future") {
        getFutureWeather(details);

    } else {
        getCurrentWeather(details);
        getFutureWeather(details);
    };

};

//Function to print current weather
var getCurrentWeather = function (details) {
    var date = document.createElement('h5');
    var currentDate = dayjs().format('MM/DD/YYYY');
    date.textContent = currentDate;
    currentResults.appendChild(date);

    //icon
    var icon = document.createElement('img');
    var iconValCode = details.list[0].weather[0].icon;
    var iconVal = "http://openweathermap.org/img/wn/" + iconValCode + "@2x.png";
    icon.setAttribute("src", iconVal);
    currentResults.appendChild(icon);

    //temperature
    var temp = document.createElement('h6');
    var tempVal = details.list[0].main.temp;
    temp.textContent = "Temp: " + tempVal + "°F";
    currentResults.appendChild(temp);

    //humidity
    var humidity = document.createElement('h6');
    var humidityVal = details.list[0].main.humidity;
    humidity.textContent = "Humidity: " + humidityVal + "%";
    currentResults.appendChild(humidity);

    //windspeed
    var windspeed = document.createElement('h6');
    var windspeedVal = details.list[0].wind.speed;
    windspeed.textContent = "Wind: " + windspeedVal + " MPH";
    currentResults.appendChild(windspeed);
};

//Function to print future weather
var getFutureWeather = function (details) {
  for (i = 8; i < 40; i++) {

    for (var i = 0; i < 1; i++){
    var date = document.createElement('h5');
    var k = i - (i-1);
    var todaysDate = dayjs().add(k, 'day');
    var dateVal = todaysDate.format('MM/DD/YYYY');
    date.textContent = dateVal;
    futureResults.appendChild(date);
    };

    //icon
    var icon = document.createElement('img');
    var iconValCode = details.list[i].weather[0].icon;
    var iconVal = "http://openweathermap.org/img/wn/" + iconValCode + "@2x.png";
    icon.setAttribute("src", iconVal);
    futureResults.appendChild(icon);

    //temperature
    var temp = document.createElement('h6');
    var tempVal = details.list[i].main.temp;
    temp.textContent = "Temp: " + tempVal + "°F";
    futureResults.appendChild(temp);

    //humidity
    var humidity = document.createElement('h6');
    var humidityVal = details.list[i].main.humidity;
    humidity.textContent = "Humidity: " + humidityVal + "%";
    futureResults.appendChild(humidity);

    //windspeed
    var windspeed = document.createElement('h6');
    var windspeedVal = details.list[i].wind.speed;
    windspeed.textContent = "Wind: " + windspeedVal + " MPH";
    futureResults.appendChild(windspeed);

    i = i + 7;
  }
};

//Print past search terms to left column
var citySearchedListItem;

function printPastSearches() {
  var pastSearchHeader = document.createElement("h3");
  pastSearchHeader.textContent = "VIEW PAST SEARCHES";
  pastSearchContainer.appendChild(pastSearchHeader);

  for (var i = 0; i < citiesSearchedArray.length; i++) {
      var lastCitySearched = citiesSearchedArray[i].city;

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

/*
Not currently clearing printed data before showing new time selection
Need function to clear printed data
*/