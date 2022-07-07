//when the page is reloaded, the tournament that the user selected gets the attribute selected='true' in the options list
function selectedTournament () {

    let select = document.querySelector("select");
    let selection = select.id;
    let options = select.querySelectorAll("option");
    for (option of options){
        if (option.id === selection){
            option.selected = true;
        }
    }
    
}


window.addEventListener('DOMContentLoaded', (event) => { 
    selectedTournament();
});