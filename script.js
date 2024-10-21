const apiKey = '9f274cb0b895a4d5172392c81ead9a4b';  // Replace with your OpenWeather API Key 
const geminiApiKey = 'AIzaSyCwftpGuGGQd9QgQbbp9j17EbdusQFR0vE'; // Replace with your Gemini API Key

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchButton').addEventListener('click', getWeatherData);
    document.getElementById('sendButton').addEventListener('click', handleChatQuery);
    document.getElementById('chatbotButton').addEventListener('click', () => {
        document.getElementById('chatbotModal').style.display = 'block';
    });
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('chatbotModal').style.display = 'none';
    });
    window.onclick = (event) => {
        if (event.target === document.getElementById('chatbotModal')) {
            document.getElementById('chatbotModal').style.display = 'none';
        }
    };
});

async function getWeatherData() {
    const city = document.getElementById('citySearch').value;
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    try {
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const currentWeatherData = await currentWeatherResponse.json();

        if (currentWeatherResponse.ok) {
            displayCurrentWeather(currentWeatherData);
            get5DayForecast(currentWeatherData.coord.lat, currentWeatherData.coord.lon);
        } else {
            throw new Error(currentWeatherData.message);
        }
    } catch (error) {
        alert(error.message);
    }
}

function displayCurrentWeather(data) {
    document.getElementById('temperature').innerText = data.main.temp;
    document.getElementById('feelsLike').innerText = data.main.feels_like;
    document.getElementById('humidity').innerText = data.main.humidity;
    document.getElementById('windSpeed').innerText = data.wind.speed;
    document.getElementById('weatherDescription').innerText = data.weather[0].description;
    document.getElementById('visibility').innerText = (data.visibility / 1000).toFixed(1);
    document.getElementById('cloudiness').innerText = data.clouds.all + '%';
    document.getElementById('sunrise').innerText = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    document.getElementById('sunset').innerText = new Date(data.sys.sunset * 1000).toLocaleTimeString();
}

// Fetch and Display 5-Day Weather Forecast
async function get5DayForecast(lat, lon) {
    try {
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        if (forecastResponse.ok) {
            displayForecast(forecastData);
            displayCharts(forecastData);
        } else {
            throw new Error(forecastData.message);
        }
    } catch (error) {
        alert(error.message);
    }
}

function displayForecast(data) {
    const forecastDays = data.list.filter(item => item.dt_txt.endsWith("12:00:00"));
    for (let i = 0; i < forecastDays.length; i++) {
        const day = forecastDays[i];
        const forecastDayDiv = document.getElementById(`day${i + 1}`);
        if (forecastDayDiv) {
            forecastDayDiv.innerHTML = `
                <h4>${new Date(day.dt * 1000).toLocaleDateString()}</h4>
                <p>Temp: ${day.main.temp} °C</p>
                <p>${day.weather[0].description}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon" />
            `;
        }
    }
}

function displayCurrentWeather(data) {
    // Update elements with the API data
    document.getElementById('temperature').innerText = data.main.temp;
    document.getElementById('feelsLike').innerText = data.main.feels_like;
    document.getElementById('humidity').innerText = data.main.humidity;
    document.getElementById('windSpeed').innerText = data.wind.speed;
    document.getElementById('weatherDescription').innerText = data.weather[0].description;
    document.getElementById('visibility').innerText = (data.visibility / 1000).toFixed(1); // Convert meters to kilometers
    document.getElementById('cloudiness').innerText = data.clouds.all + '%';

    // Convert sunrise/sunset from Unix timestamp to local time
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    document.getElementById('sunrise').innerText = sunriseTime;
    document.getElementById('sunset').innerText = sunsetTime;

    // Set background image based on weather condition for Temperature & Weather
    const weatherCondition = data.weather[0].main.toLowerCase();
    const tempWeatherContainer = document.querySelector('.temperature-weather');
    const detailsContainer = document.querySelector('.details');
    const sunriseSunsetContainer = document.querySelector('.sunrise-sunset');

    if (weatherCondition.includes('storm')) {
        tempWeatherContainer.style.backgroundImage = 'url("storm.jpeg")'; 
        detailsContainer.style.backgroundImage = 'url("humidity2.jpeg")';
        sunriseSunsetContainer.style.backgroundImage = 'url("sunrise1.jpeg")';
    } else if (weatherCondition.includes('clear')) {
        tempWeatherContainer.style.backgroundImage = 'url("clearsky.jpg")'; 
        detailsContainer.style.backgroundImage = 'url("humidity2.jpeg")';
        sunriseSunsetContainer.style.backgroundImage = 'url("sunrise3.jpeg")';
    } else if (weatherCondition.includes('rain')) {
        tempWeatherContainer.style.backgroundImage = 'url("rain.jpeg")';
        detailsContainer.style.backgroundImage = 'url("humidity2.jpeg")';
        sunriseSunsetContainer.style.backgroundImage = 'url("sunrise2.jpeg")';
    } else if (weatherCondition.includes('cloud')) {
        tempWeatherContainer.style.backgroundImage = 'url("cloudysky.jpeg")'; 
        detailsContainer.style.backgroundImage = 'url("humidity2.jpeg")';
        sunriseSunsetContainer.style.backgroundImage = 'url("sunrise2.jpeg")';
    } else if (weatherCondition.includes('snow')) {
        tempWeatherContainer.style.backgroundImage = 'url("snow.jpg")'; 
        detailsContainer.style.backgroundImage = 'url("humidity2.jpeg")';
        sunriseSunsetContainer.style.backgroundImage = 'url("sunrise3.jpeg")';
    } else if (data.main.temp > 30) {
        tempWeatherContainer.style.backgroundImage = 'url("hotweather.jpeg")';
        detailsContainer.style.backgroundImage = 'url("humidity2.jpeg")';
        sunriseSunsetContainer.style.backgroundImage = 'url("sunrise1.jpeg")'; 
    }
    else if (data.main.temp > 10 && data.main.temp <= 30) {
        tempWeatherContainer.style.backgroundImage = 'url("fog.jpeg")';
        detailsContainer.style.backgroundImage = 'url("humidity2.jpeg")';
    } 
    else if (data.main.temp < 10) {
        tempWeatherContainer.style.backgroundImage = 'url("snow.jpg")';
        detailsContainer.style.backgroundImage = 'url("humidity2.jpeg")';
        sunriseSunsetContainer.style.backgroundImage = 'url("sunrise3.jpeg")';
    }

    
    else {
        tempWeatherContainer.style.backgroundImage = '';
        detailsContainer.style.backgroundImage = '';
        sunriseSunsetContainer.style.backgroundImage = '';
    }

}

async function get5DayForecast(lat, lon) {
    try {
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        if (forecastResponse.ok) {
            displayForecast(forecastData);
            displayCharts(forecastData);
        } else {
            throw new Error(forecastData.message);
        }
    } catch (error) {
        alert(error.message);
    }
}

function displayCharts(data) {
    const temperatures = data.list.map(item => item.main.temp);
    const dates = data.list.map(item => new Date(item.dt * 1000).toLocaleDateString());
    const weatherConditions = data.list.map(item => item.weather[0].main);

    const doughnutChartCanvas = document.getElementById('doughnutChart').getContext('2d');
    const lineChartCanvas = document.getElementById('lineChart').getContext('2d');
    const barChartCanvas = document.getElementById('barChart').getContext('2d');

    const conditionCounts = {};
    weatherConditions.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });

    new Chart(doughnutChartCanvas, {
        type: 'doughnut',
        data: {
            labels: Object.keys(conditionCounts),
            datasets: [{
                label: 'Weather Conditions',
                data: Object.values(conditionCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'],
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 1.2,
        }
    });

    new Chart(lineChartCanvas, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                fill: false,
                borderColor: 'rgba(76, 159, 213, 1)',
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 2,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(barChartCanvas, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(76, 159, 213, 0.7)',
                borderColor: 'rgba(76, 159, 213, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 2,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function handleChatQuery() {
    const query = document.getElementById('chatInput').value.toLowerCase();
    const chatOutput = document.getElementById('chat-output');
    
    const city = extractCityFromQuery(query);

    if (query.includes('weather') && city) {
        const weatherResponse = await fetchWeather(city);
        chatOutput.innerHTML += `<p><strong>Bot:</strong> The weather in ${city} is ${weatherResponse.description}, ${weatherResponse.temperature}°C.</p>`;
    } else if (!city && query.includes('weather')) {
        chatOutput.innerHTML += `<p><strong>Bot:</strong> Please specify a city name for the weather query.</p>`;
    } else {
        const geminiResponse = await fetchGeminiApi(query);
        chatOutput.innerHTML += `<p><strong>Bot:</strong> ${geminiResponse.answer}</p>`;
    }

    document.getElementById('chatInput').value = ''; 
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

function extractCityFromQuery(query) {
    const cityPattern = /in\s([a-zA-Z\s]+)/;  
    const match = query.match(cityPattern);
    return match ? match[1].trim() : null;
}

async function fetchWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return {
        description: data.weather[0].description,
        temperature: data.main.temp
    };
}

async function fetchGeminiApi(query) {
    return { answer: "Sorry, I can only answer weather-related queries at the moment." };
}
