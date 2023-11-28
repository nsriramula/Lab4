async function getCitySunData() {
    const city = document.getElementById('cityInput').value;

    if (!city) {
        alert('Please enter a city name');
        return;
    }
    const url = `https://geocode.maps.co/search?q=${city}`;
    const option = {
      method: "GET",
    };
    const response = await fetch(url, option);
    const data = await response.json();
    if (data.length === 0) {
      console.log(data);
      alert("No city is found");
    } else {
      latitude = data[0].lat;
      longitude = data[0].lon;
      getSunStatsByLocation(longitude, latitude, city);
    }
}
async function getSunData(longitude, latitude, date){
    if (latitude === undefined && longitude === undefined) {
        alert("Error: Invalid Co-ordinates... please try again.");
      } else {
        try {
            const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}`;
        const option = {
            method: "GET",
        };
          const response = await fetch(url, option);
          const data = await response.json();
          const results = data.results;
          return results;
        } catch (error) {
          alert("Something went wrong");
        }
      }
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const city = await getCityName(lon, lat);
            getSunStatsByLocation(lon, lat, city);
        }, error => {
            console.error('Error getting current location:', error);
            alert('Error getting current location. Please try again.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
 async function getCityName(longitude, latitude){
  if (latitude === undefined && longitude === undefined) {
    alert("Someting Went wrong");
  } else {
    try {
      const url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;
      const option = {
        method: "GET",
      };
      const response = await fetch(url, option);
      const data = await response.json();
      const cityName = data.address.city;
      return cityName;
    } catch (error) {
      alert("Something went wrong");
    }
  }
};

async function getSunStatsByLocation(longitude, latitude, city) {
    const date = new Date();
    const convertedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const todaysData = await getSunData(longitude, latitude, convertedDate);
    date.setDate(date.getDate() + 1);
    const tomorrowDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const tomorrowsData = await getSunData(longitude, latitude, tomorrowDate);
    displayWeather(todaysData, tomorrowsData, city);
}

function displayWeather(todayData, tomorrowData, city) {
    const outputContainer = document.getElementById('output-container');
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      };

    const results = `<div class="container">
    <div class="todayContainer">
        <h2>Today</h2>
        <h3>${todayData.timezone}</h3>
        <div class="today">
            <div class="sunrisee">
                <h4 class="sunrise">Sunrise <img src="assets/sunrise.png" alt="Sunrise icon"> ${todayData.sunrise}</h4>
                <h5>Dusk: ${todayData.dusk}</h5>
            </div>
            <div class="sunsett">
                <h4 class="sunset">Sunset <img src="assets/sunset.png" alt="Sunset icon">${todayData.sunset}</h4>
                <h5>Dawn: ${todayData.dawn}</h5>
            </div>
        </div>
        <h3>Solar noon today is at ${tomorrowData.solar_noon}</h3>
        <h3>Length of the day today in ${city} is ${tomorrowData.day_length}</h3>
    </div>
    <div class="tomorrowContainer">
        <h2>Tomorrow</h2>
        <h3>${tomorrowData.timezone}</h3>
        <div class="tomorrow"> 
            <div class="sunrisee">
                <h4 class="sunrise">Sunrise <img src="assets/sunrise.png" alt="Sunrise icon"> ${tomorrowData.sunrise}</h4>
                <h5>Dusk: ${tomorrowData.dusk}</h5>
            </div>
            <div class="sunsett">
                <h4 class="sunset">Sunset <img src="assets/sunset.png" alt="Sunset icon">${tomorrowData.sunset}</h4>
                <h5>Dawn: ${tomorrowData.dawn}</h5>
            </div>
        </div>
        <h3>Solar noon tomorrow is at ${tomorrowData.solar_noon}</h3>
        <h3>Length of the day tomorrow in ${city} is ${tomorrowData.day_length}</h3>
    </div>
    </div> `;
    outputContainer.innerHTML = results;
}