const hiddenUnitsMenu = document.querySelector('.unitsOptionsMenu');
const units = document.querySelector('.units');
const searcBar = document.querySelector('#searcBar');
const searchLoading = document.querySelector('.searchLoading');
const searchInProgress = document.querySelector('.searchInProgress');

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const weatherIconCodes = {
    0: "icon-sunny.webp",

    1: "icon-sunny.webp",
    2: "icon-partly-cloudy.webp",
    3: "icon-overcast.webp",

    45: "icon-fog.webp",
    48: "icon-fog.webp",

    51: "icon-drizzle.webp",
    53: "icon-drizzle.webp",
    55: "icon-drizzle.webp",

    61: "rain.png",
    63: "rain.png",
    65: "rain.png",

    80: "icon-rain.webp",
    81: "icon-rain.webp",
    82: "icon-rain.webp",

    95: "icon-storm.webp",
    96: "icon-storm.webp",
    99: "icon-storm.webp",
};

async function fetchWeather(latitude, longitude) {
    try {
        const a = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation`);
        const responseBody = await a.json();
        console.log(responseBody);
        return responseBody;
    }
    catch (e) {
        console.log(e);
    }
}

async function fetchGetCordinates(name) {
    try {
        const a = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=5&language=en&format=json`);
        const responseBody = await a.json();
        console.log(responseBody);
        return responseBody;
    }
    catch (e) {
        console.log(e);
    }
}
function addSearchInProgressInfographics(infoToShow) {
    const element = searchInProgress.cloneNode(true);
    element.innerText = infoToShow;
    element.classList.remove('hidden')
    searchLoading.prepend(element);
}
function removeAllSearchSuggestions() {
    searchLoading.replaceChildren()
}

function addSearchSuggestion(apiResponse) {
    if (apiResponse.results) {
        let resultsArray = [...(apiResponse.results)]

        resultsArray.forEach((a) => {
            const name = a.name ?? "";
            const state = a.admin1 ?? "";
            const country = a.country ?? "";
            const latitude = a.latitude ?? "";
            const longitude = a.longitude ?? "";

            const element = searchInProgress.cloneNode(true);
            element.classList.remove('hidden')
            element.innerText = `${name} ,${state} ,${country}`;
            element.dataset.latitude = latitude
            element.dataset.longitude = longitude
            element.dataset.place = name + ", " + country;
            searchLoading.prepend(element);
            console.log(element);
        })
    }
    else {
        addSearchInProgressInfographics('Not found.....');
    }
}


function replaceCurrentWeatherCard(response, currPlace) {

    const feelsLikeCard = document.querySelector(".feelsLikeCard");
    const humidityCard = document.querySelector(".humidityCard");
    const mmCard = document.querySelector(".mmCard");
    const windCard = document.querySelector(".windCard");
    const currTemp = document.querySelector(".currTemp");
    const place = document.querySelector(".place");
    const graphic = document.querySelector('.graphic');

    feelsLikeCard.innerText = response.current.apparent_temperature + "°";;
    humidityCard.innerText = response.current.relative_humidity_2m + "%";
    windCard.firstChild.textContent = response.current.wind_speed_10m;
    mmCard.firstChild.textContent = response.current.precipitation;
    currTemp.innerText = response.current.temperature_2m + "°";
    place.innerText = currPlace;
    const weathercode = response.current.weather_code;
    console.log('weathercode', weathercode)
    graphic.src = `./assets/images/${weatherIconCodes[weathercode]}`;

}

function replaceDailyForecast(response) {
    const forecastCard = document.querySelectorAll('.forecastCard');

    forecastCard.forEach((a, i) => {
        const date = new Date(response.daily.time[i]);
        a.children[0].textContent = days[date.getDay()]
        a.children[1].src = weatherIconCodes[response.daily.weather_code[i]]
        const tempContainer = a.children[2];

        tempContainer.children[0].textContent = response.daily.temperature_2m_max[i] + "°";
        tempContainer.children[1].textContent = response.daily.temperature_2m_min[i] + "°";
    })



}





async function setWeather(latitude, longitude, place) {
    const response = await fetchWeather(latitude, longitude);
    replaceCurrentWeatherCard(response, place);
    replaceDailyForecast(response);
}



searcBar.addEventListener('input', async (e) => {
    console.log(e.target.value);
    let searchedPlace = e.target.value;
    try {
        addSearchInProgressInfographics('⌛︎ Search in progress...');
        let apiResponse = await fetchGetCordinates(searchedPlace);
        console.log(apiResponse);
        removeAllSearchSuggestions();
        await addSearchSuggestion(apiResponse);
    }

    catch (e) {
        console.log(e);
    }
})
searcBar.addEventListener('click', (e) => {
    searchLoading.classList.remove('hidden');
    console.log(e);
});

searchLoading.addEventListener('click', (e) => {

    const button = e.target.closest(".searchInProgress");
    if (!button) {
        return;
    }
    const latitude = button.dataset.latitude;
    const longitude = button.dataset.longitude;
    const place = button.dataset.place;
    button.classList.add('selectedElement');

    setWeather(latitude, longitude, place)
    searchLoading.replaceChildren();
    searchLoading.classList.add('hidden')
    console.log(e);
})


units.addEventListener('click', () => {
    console.log('options operned')
    hiddenUnitsMenu.classList.toggle('hidden')
})

window.addEventListener('click', (e) => {
    const click = e.target.closest(".searchLoading");
    const click2 = e.target.closest('#searcBar');
    if (click || click2) {
        return;
    }
    else {
        removeAllSearchSuggestions()
        searchLoading.classList.add('hidden');
    }
})