let accountBtn = document.querySelector(".connectedButton");
accountBtn.addEventListener("click", showAccountMenu);


//accountMenu visibility changes according to 'state' element value
function showAccountMenu() {

    let accountMenu = document.querySelector(".account");

    if(accountMenu.getAttribute("state") == "hidden") { 
        accountMenu.style.display = "block"; 
        accountMenu.setAttribute("state", "show");
    }
    else{ 
        accountMenu.style.display = "none";
        accountMenu.setAttribute("state", "hidden");
    }

}

//if the account that has logged in is an administrator, the account menu has only one option and this option is to log out
function hideAccountChoices(adminRights){
    if (adminRights){
        let accountChoice = document.querySelectorAll(".accountChoice");
        accountChoice[0].style.display = "none";
        accountChoice[1].style.display = "none";
    }
}


//function that adds the info about all the tournaments that the user has joined in the account menu
function addMyTournaments(tournaments){
    let accountList = document.querySelector("#tournaments .accountList");
    for (tour of tournaments){
        let listItem = document.createElement("li");
        listItem.className = 'accountListItem';

        let title = document.createElement('span');
        title.innerHTML = 'Τουρνουά: '+ tour.title
        listItem.appendChild(title);

        let startdate = document.createElement('span');
        startdate.innerHTML = 'Έναρξη: ' + tour.startdate;
        listItem.appendChild(startdate);

        let enddate = document.createElement('span');
        enddate.innerHTML = 'Λήξη: '+ tour.enddate;
        listItem.appendChild(enddate);

        let location = window.location.href;
        location = "/"+location.split("/").pop();  //location parameter is used so we can redirect to the same page when we cancel a tournament participation 

        let tournamentCancelBtn = document.createElement('button');
        let tournamentCancelHref = document.createElement('a');
        tournamentCancelHref.innerHTML = 'Ακύρωση';
        tournamentCancelHref.style.color = "grey";
        tournamentCancelHref.style['-webkit-text-stroke-width'] = '0.6px';
        tournamentCancelHref.style['-webkit-text-stroke-color'] = 'grey';
        tournamentCancelHref.href = '/cancelJoinTournament?tournamentid='+tour.tournamentid+'&location='+location;
        tournamentCancelBtn.appendChild(tournamentCancelHref);
        listItem.appendChild(tournamentCancelBtn);

        accountList.appendChild(listItem);
        listItem.style.display = 'flex';
        listItem.style.flexDirection = 'column';
        listItem.style.paddingTop = '10px';

    }
}

//function that adds the info about all the court reservations that the user has made in the account menu
function addMyReservations(reservations){

    let accountList = document.querySelector("#reservations .accountList");
    for (rsv of reservations){
        let listItem = document.createElement("li");
        listItem.className = 'accountListItem';

        let court = document.createElement('span');
        court.innerHTML = 'Γήπεδο: '+ rsv.courtid;
        listItem.appendChild(court);

        let bookingDate = document.createElement('span');
        bookingDate.innerHTML = 'Ημερομηνία: '+ rsv.reservationdate;
        listItem.appendChild(bookingDate);

        let bookingTime = document.createElement('span');
        bookingTime.innerHTML = 'Ώρα: '+ rsv.reservationtime;
        listItem.appendChild(bookingTime);

        let location = window.location.href;
        location = "/"+location.split("/").pop();  //location parameter is used so we can redirect to the same page when we cancel a court reservation 

        let reservationCancelBtn = document.createElement('button');
        let reservationCancelHref = document.createElement('a');
        reservationCancelHref.innerHTML = 'Ακύρωση';
        reservationCancelHref.style.color = "grey";
        reservationCancelHref.style['-webkit-text-stroke-width'] = '0.6px';
        reservationCancelHref.style['-webkit-text-stroke-color'] = 'grey';
        reservationCancelHref.href = '/cancelReservation?reservationid='+rsv.reservationid+'&location='+location;
        reservationCancelBtn.appendChild(reservationCancelHref);
        listItem.appendChild(reservationCancelBtn);

        accountList.appendChild(listItem);
        listItem.style.display = 'flex';
        listItem.style.flexDirection = 'column';
        listItem.style.paddingTop = '10px';

    }
}


//fetches the list with the tournaments the user has joined in as json objects
let fetchUserTournaments = () => { 
    fetch('/tournaments/userTournaments')     //the fetched result is a list of strings
    .then(
        (response) => response.json()   //we turn the list of strings into a list of jason objects
        .then((json) => renderUserTournaments(json))
    )
}

//gets the list with the json objects and calls addMyTournaments to build the user's tournaments of the database
let renderUserTournaments = (tournaments) => {
    addMyTournaments(tournaments);
}


//fetches the list with the court reservations the user has made as json object
let fetchUserReservations = () => { 
    fetch('/booking/userReservations')     //the fetched result is a list of strings
    .then(
        (response) => response.json()   //we turn the list of strings into a list of jason objects
        .then((json) => renderUserReservations(json))
    )
}

//gets the list with the json objects and calls addMyReservations to build the user's reservations of the database
let renderUserReservations = (reservations) => {
    addMyReservations(reservations);
}



let fetchAdminRights = () => { 
    fetch('/getAdminRights')     //the fetched result is a list of strings
    .then(
        (response) => response.json()   //we turn the list of strings into a list of jason objects
        .then((json) => renderAdminRights(json))
    )
}

let renderAdminRights = (adminRights) => {
    hideAccountChoices(adminRights[0].adminrights);
}



window.addEventListener('DOMContentLoaded', (event) => { 
    fetchUserReservations();
    fetchUserTournaments();
    fetchAdminRights();
});