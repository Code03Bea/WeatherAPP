const apiKey = 'c65c6b2a12msh6b1fb5fc797130ap1bc6c7jsnc6817ca58031'; // Your API key
let isCelsius = true;

function getWeather() {
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Please enter a city');
        return;
    }

    // Construct the URL for the specific city
    const currentWeatherUrl = `https://open-weather13.p.rapidapi.com/city/${city}/EN`;
    fetchWeatherData(currentWeatherUrl);
}

function fetchWeatherData(currentWeatherUrl) {
    $.ajax({
        url: currentWeatherUrl,
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'open-weather13.p.rapidapi.com',
            'x-rapidapi-key': apiKey
        }
    }).done(function (data) {
        displayWeather(data);
        saveToLocalStorage(data);
    }).fail(function () {
        alert('Error fetching current weather data. Please try again.');
    });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod !== 200) {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = isCelsius ? Math.round(data.main.temp - 273.15) : Math.round((data.main.temp - 273.15) * 9/5 + 32);
        const feelsLike = isCelsius ? Math.round(data.main.feels_like - 273.15) : Math.round((data.main.feels_like - 273.15) * 9/5 + 32);
        const description = data.weather[0].description; 
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const windSpeed = Math.round(data.wind.speed * 3.6); // Convert from m/s to km/h
        const humidity = data.main.humidity;

        // Format the date and time
        const date = new Date(data.dt * 1000);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        const formattedDate = date.toLocaleDateString('en-US', options);

        const temperatureHTML = `
            <p>${temperature}°${isCelsius ? 'C' : 'F'}</p>
            <p>Feels like: ${feelsLike}°${isCelsius ? 'C' : 'F'}</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            <p>Wind: ${windSpeed} KMPH</p>
            <p>Humidity: ${humidity}%</p>
            <p>${formattedDate}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block'; 
    }
}

function toggleTemperature() {
    isCelsius = !isCelsius;

    const city = document.getElementById('city').value.trim();
    if (city) {
        getWeather(); 
    } else {
        const savedData = JSON.parse(localStorage.getItem('weatherData'));
        if (savedData) {
            displayWeather(savedData);
        }
    }
}

function saveToLocalStorage(data) {
    const weatherData = {
        name: data.name,
        main: {
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            pressure: data.main.pressure,
            humidity: data.main.humidity
        },
        weather: data.weather,
        wind: data.wind,
        dt: data.dt
    };

    localStorage.setItem('weatherData', JSON.stringify(weatherData));
}

window.onload = function() {
    const savedData = JSON.parse(localStorage.getItem('weatherData'));
    if (savedData) {
        displayWeather(savedData);
    }
};

// Event listeners for the search button and temperature toggle
document.getElementById('search-button').addEventListener('click', getWeather);
document.getElementById('toggle-temp').addEventListener('click', toggleTemperature);