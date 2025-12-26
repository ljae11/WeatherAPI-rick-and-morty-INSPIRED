const apiKey = "dc895ce3a2a847ca943a825f1cbec3de";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const forecastDiv = document.getElementById("forecast");

searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") handleSearch();
});

function handleSearch() {
    const city = cityInput.value.trim();

  
    if (!city) {
        alert("Enter a city, Morty!");
        return;
    }

    getWeather(city);
}


window.onload = () => {
    getWeather("New york");
};


function getWeather(city) {
    if (!city) return;

    loader.style.display = "block";
    result.style.display = "block"; 
    forecastDiv.innerHTML = "";

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            loader.style.display = "none";

            if (data.cod !== "200") {
                alert("Dimension not found!");
                return;
            }

            
            for (let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                const date = new Date(day.dt_txt);

                forecastDiv.innerHTML += `
                    <div class="forecast-day">
                        <strong>${date.toLocaleDateString("en-US", { weekday: "short" })}</strong>
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                        <div>${Math.round(day.main.temp)}°C</div>
                    </div>
                `;
            }

        
            const today = data.list[0];
            document.getElementById("city").textContent = "📍 " + data.city.name;
            document.getElementById("temp").textContent = "🌡 Temp: " + today.main.temp + " °C";
            document.getElementById("feels").textContent = "🥵 Feels like: " + today.main.feels_like + " °C";
            document.getElementById("desc").textContent = "☁ Weather: " + today.weather[0].description;
            document.getElementById("humidity").textContent = "💧 Humidity: " + today.main.humidity + "%";
            document.getElementById("wind").textContent = "🌬 Wind: " + today.wind.speed + " m/s";
            document.getElementById("pressure").textContent = "🧭 Pressure: " + today.main.pressure + " hPa";

     
            const mainWeather = today.weather[0].main.toLowerCase(); 

            document.body.classList.remove("sunny", "clouds", "rain", "snow", "thunderstorm");

            if (mainWeather.includes("clear")) document.body.classList.add("sunny");
            else if (mainWeather.includes("clouds")) document.body.classList.add("clouds");
            else if (mainWeather.includes("rain") || mainWeather.includes("drizzle")) document.body.classList.add("rain");
            else if (mainWeather.includes("snow")) document.body.classList.add("snow");
            else if (mainWeather.includes("thunderstorm")) document.body.classList.add("thunderstorm");
        })
        .catch(() => {
            loader.style.display = "none";
            alert("Something went wrong!");
        });
}
