const hiddenUnitsMenu = document.querySelector('.unitsOptionsMenu');
const units = document.querySelector('.units');
const searcBar = document.querySelector('#searcBar');
const searchLoading = document.querySelector('.searchLoading');
const searchInProgress = document.querySelector('.searchInProgress');
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

            searchLoading.prepend(element);
            console.log(element);
        })
    }
    else {
        addSearchInProgressInfographics('Not found.....');
    }
}


async function replaceWeather(latitude, longitude){
    const response = await fetchWeather(latitude, longitude);
    return
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
searcBar.addEventListener('click', (e)=>{
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
    button.classList.add('selectedElement');
    
    replaceWeather(latitude, longitude)
    searchLoading.replaceChildren();
    searchLoading.classList.add('hidden')
    console.log(e);
})


units.addEventListener('click', () => {
    console.log('options operned')
    hiddenUnitsMenu.classList.toggle('hidden')
})

window.addEventListener('click', (e)=>{
const click = e.target.closest(".searchLoading");
const click2 = e.target.closest('#searcBar');
    if(click || click2){
        return;
    }
    else{
    removeAllSearchSuggestions()
    searchLoading.classList.add('hidden');
    }
})