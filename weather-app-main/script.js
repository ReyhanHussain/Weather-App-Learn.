const hiddenUnitsMenu = document.querySelector('.unitsOptionsMenu');
const units = document.querySelector('.units');
const searcBar = document.querySelector('#searcBar');


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

searcBar.addEventListener('input', (e)=>{

})


















units.addEventListener('click', () => {
    console.log('options operned')
    hiddenUnitsMenu.classList.toggle('hidden')
})