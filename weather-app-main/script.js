const hiddenUnitsMenu = document.querySelector('.unitsOptionsMenu');
const units = document.querySelector('.units');






units.addEventListener('click', ()=>{
    console.log('options operned')
    hiddenUnitsMenu.classList.toggle('hidden')
})