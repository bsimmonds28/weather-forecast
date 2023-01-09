var termContainerEl = document.querySelector('#user-form');
var searchTermEl = document.querySelector('#username');
var buttonEl = document.querySelector('.btn');
var repoContainerEl = document.querySelector('#repos-container');
var timeButtonsEl = document.querySelector('#language-buttons');
var results = document.querySelector('#repos-container');
var futureResults = document.querySelector('#future-weather');
var citiesSearchedArray = [];
var searchTerm;
var timeSelection;

//Add event listener to store search term
var formSubmit = function (event) {
    event.preventDefault();
  
    searchTerm = searchTermEl.value.trim();
  
    if (searchTerm) {
      var citiesSearchedTemp = 
      {
        city: searchTerm,
      };
      citiesSearchedArray.push(citiesSearchedTemp);
      storeInput();

      getCoordinates(searchTerm);
      searchTermEl.textContent = '';
    } else {
      alert('Please enter a valid city.');
    }

  };

buttonEl.addEventListener('click', formSubmit);

//Add event listener to store time selection
var buttonClickHandler = function (event) {
    timeSelection = event.target.getAttribute('data-language');
  
    if (timeSelection) {
      //getCorrectTime(timeSelection);
      repoContainerEl.textContent = '';
      return timeSelection;
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
    
    //printResults();
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
    
    if (timeSelection = "current") {
        var icon = details[0].list[0].weather[0].icon;
        title.appendChild(icon);

        var date = document.createElement('h5');
        var currentDate = dayjs().format('MM/DD/YYYY');
        date.textContent = currentDate;
        results.appendChild(date);


    } else if (timeSelection = "future") {
        /*
        for (i = 0; i < 5; i++) {

            futureResults.appendChild();
        };
        */
    } else {
        
    };

};

//Print past search terms to left column


//Click on past search term and again presented with those results
