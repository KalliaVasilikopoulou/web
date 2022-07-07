const monthNums = {0: "Ιανουάριος", 1: "Φεβρουάριος", 2: "Μάρτιος", 3: "Απρίλιος", 4: "Μάιος", 5: "Ιούνιος", 6: "Ιούλιος", 7: "Αύγουστος", 8: "Σεπτέμβριος", 9: "Οκτώβριος", 10: "Νοέμβριος", 11: "Δεκέμβριος"}
const monthNumsEnglish = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'}

let existing_months =[];
let mode;
let modal;


//makes all month and tournament rows in page
//if there are no tournaments, a text appers that informs the user that there are no tournaents
function appendMonthsTournaments(tournaments) {
    if (tournaments.length === 0 ) {
        let field = document.querySelector('.tournament_rows');
        let infoRow = document.createElement('div');
        infoRow.style.padding = "100px";
        infoRow.appendChild(document.createTextNode("Δεν έχουν καταχωρηθεί πληροφορίες για επερχόμενα τουρνουά..."));
        field.appendChild(infoRow);

        let board = document.querySelector('.board_row table');
        let boardRow = document.createElement('tr');
        let boardCell = document.createElement('td');
        boardCell.colSpan = '5';
        boardCell.style.padding = "20px";
        boardCell.appendChild(document.createTextNode("Δεν έχουν καταχωρηθεί πληροφορίες για επερχόμενα τουρνουά..."));
        boardRow.appendChild(boardCell);
        board.appendChild(boardRow);

        return;
    }
    
    for (let tour of tournaments){
        tour.startdate = new Date(tour.startdate);
        let tourMonth = tour.startdate.getMonth();
        let existing = false;

        for (month of existing_months){
            if (tourMonth === month){
                newTournamentField_NE(tour,tourMonth);
                existing = true;
            }
        }

        if (existing === true) continue;

        existing_months.push(tourMonth);

    let field = document.querySelector('.tournament_rows');

    let tourInfoRow = document.createElement('div');
    tourInfoRow.className = 'tournaments_info_row';

    tourInfoRow.setAttribute('id', `month${tourMonth}`);

    let monthRow = document.createElement("div"); 
    monthRow.className = "month_row"; 


    let month_title_field = document.createElement('div');
    month_title_field.className = 'month_title';
    let text_field = document.createElement('h4');
    month_title_field.appendChild(text_field);
    monthRow.append(month_title_field);

    
    //month buttons element that contains all the buttons for the management of each month (delete month button)
    //this field has id with value = the name of the corresponding month
    let monthButtons = document.createElement('div');
    monthButtons.className = 'month_buttons';
    monthRow.appendChild(monthButtons);

    let deleteMonthBtn = document.createElement('span');
    deleteMonthBtn.className = 'month_delete';
    monthButtons.appendChild(deleteMonthBtn);

    tourInfoRow.appendChild(monthRow);


    field.appendChild(tourInfoRow);
    addMonthTitleDB(tourInfoRow.id, monthNums[tourMonth]);
    addMonthDeleteBtn(tourInfoRow.id, monthNumsEnglish[tourMonth]);
    newTournamentField_NE(tour,tourMonth);

    }
}

//adds the field with the title of the month to the page
function addMonthTitleDB(monthId, monthName) {

    let field = document.getElementById(monthId).querySelector('.month_row .month_title h4');

    let text = document.createTextNode(monthName);
    field.appendChild(text);

}

//creates new field for a tournament
function newTournamentField_NE(tour, tourMonth) {

    tournament_row = createTournamentRow_NE();
    let month = document.getElementById("month"+tourMonth);
    month.appendChild(tournament_row);
    addTournamentTitleDB(tournament_row.id, tour.tournamentid, tour.title);
    addTournamentDetailsDB(tournament_row.id, tour.details);
    addTournamentPosterDB(tournament_row.id, tour.poster);
    addTournamentDeleteBtn(tournament_row.id, tour.tournamentid);
    addTournamentEditBtn(tournament_row.id, tour.tournamentid);
}


//creates the field that will contain the title, the details and the poster of each tournament
//this field, also, contains the buttons that wll be used for the management of each tournament (delete tournament button, edit tournament button)
function createTournamentRow_NE() { 

    let row = document.createElement('div');
    row.className = 'tournament_row';

    let tournaments_list = document.getElementsByClassName('tournament_row');
    for (let i in tournaments_list)
        tournaments_list[i].id = 'tournament'+i;
    let tournaments_counter = tournaments_list.length;
    row.setAttribute('id', `tournament${tournaments_counter}`);

    let infoRow = document.createElement("div"); 
    infoRow.className = "info_row";

    let description = document.createElement('div');
    description.className = 'tournament_description';
    infoRow.appendChild(description);

    let text = document.createElement('div');
    text.className = 'tournament_text';
    description.appendChild(text);
    
    let title = document.createElement('h4');
    title.className = 'tournament_title';
    text.appendChild(title);
    
    let details = document.createElement('p');
    details.className = 'tournament_details';
    text.appendChild(details);

    let poster = document.createElement('div');
    poster.className = 'tournament_poster';
    description.appendChild(poster);


    //tournament management buttons

    let tournamentButtons = document.createElement('div');
    tournamentButtons.className = 'tournament_buttons';
    infoRow.appendChild(tournamentButtons);

    let deleteTournamentBtn = document.createElement('span');
    deleteTournamentBtn.className = 'tournament_delete';
    tournamentButtons.appendChild(deleteTournamentBtn);

    let editTournamentBtn = document.createElement('span');
    editTournamentBtn.className = 'tournament_edit';
    tournamentButtons.appendChild(editTournamentBtn);

    row.appendChild(infoRow);

    return row
}


//creates a field that will contain the title of each tournament
//this field has id with value = the id of the corresponding tournament
function addTournamentTitleDB(tourRowId, tourId, tourTitle) {

        let tournament = document.getElementById(tourRowId);
        tournament.querySelector('.info_row').setAttribute("id", tourId);
        let field = document.getElementById(tourId).querySelector('.tournament_description .tournament_text .tournament_title');
        let text = document.createTextNode(tourTitle);
        field.appendChild(text);
}


//creates a field that will contain the details of each tournament
//if there are no descriptions for a tournament, a textnode with a general text will be created and added to the page instead
function addTournamentDetailsDB(tourId, tourDetails) { 

        let tournament = document.getElementById(tourId);
        let field = tournament.querySelector('.info_row .tournament_description .tournament_text .tournament_details');
        let text = document.createTextNode(tourDetails);
        if (tourDetails === "") text = document.createTextNode('Δεν υπάρχει περιγραφή... Για να ενημερωθείτε για το τουρνουά, επικοινωνήστε μαζί μας μέσω τηλεφώνου ή e-mail.');
        field.appendChild(text);

}


//creates a field that will contain the poster of each tournament
//if there is no poster for a tournament, a textnode with a general text will be created and added to the page instead
function addTournamentPosterDB(tourId, tourPoster) { 

    let tournament = document.getElementById(tourId);
    let field = tournament.querySelector('.info_row .tournament_description .tournament_poster');
    let poster = document.createElement('img');
    if (tourPoster === null) {
        poster = document.createTextNode('Δεν υπάρχει εικόνα...');
    }
    else poster.src = tourPoster;
    field.appendChild(poster);

}


//creates delete nutton for each tournament of the database
//this button contains a link to another page
//at the other page a request message to delete the tournament with the given id is sent each time
function addTournamentDeleteBtn(tourRowId, tourId) {

    let tournament = document.getElementById(tourRowId);
    let field = tournament.querySelector('.info_row .tournament_buttons .tournament_delete');

    btn = document.createElement("div");
    btn.className = "admin_button";
    btn.id = tourId;
    let deleteTournButton = document.createElement("button"); 
    deleteTournButton.setAttribute("id", "deleteTournamentBtn"); 
    let deleteTournHref = document.createElement("a");
    deleteTournHref.href = '/deleteTournamentSelect?tournamentid='+tourId;
    deleteTournHref.style.textDecoration = "none";
    deleteTournHref.style.color = "white";
    deleteTournButton.appendChild(deleteTournHref);
    deleteTournHref.appendChild(document.createTextNode("Διαγραφή τουρνουά"));
    btn.appendChild(deleteTournButton);
    field.appendChild(btn);
}


//creates edit nutton for each tournament of the database
//this button contains a link to another page
//at the other page a request message to edit the tournament with the given id is sent each time
function addTournamentEditBtn(tourRowId, tourId) {

    let tournament = document.getElementById(tourRowId);
    let field = tournament.querySelector('.info_row .tournament_buttons .tournament_edit');

    btn = document.createElement("div");
    btn.className = "admin_button";
    btn.id = tourId;
    let editTournButton = document.createElement("button"); 
    editTournButton.setAttribute("id", "editTournamentBtn");
    let editTournHref = document.createElement("a");
    editTournHref.href = '/editTournamentSelect?tournamentid='+tourId;
    editTournHref.style.textDecoration = "none";
    editTournHref.style.color = "white";
    editTournHref.appendChild(document.createTextNode("Επεξεργασία τουρνουά"));
    editTournButton.appendChild(editTournHref);
    btn.appendChild(editTournButton);
    field.appendChild(btn);
}


//creates delete nutton for each month that corresponds to the start date each tournament of the database
//this button contains a link to another page
//at the other page a request message to delete the month with the given id is sent each time
function addMonthDeleteBtn (tourInfoRowId, monthId) {

    let tourInfoRow = document.getElementById(tourInfoRowId);
    let field = tourInfoRow.querySelector('.month_row .month_buttons .month_delete');

    btn = document.createElement("div");
    btn.className = "admin_button";
    btn.id = monthId;
    let deleteMonthButton = document.createElement("button"); 
    deleteMonthButton.setAttribute("id", "deleteMonthBtn");
    let deleteMonthHref = document.createElement("a");
    deleteMonthHref.href = '/deleteMonthSelect?monthid='+monthId;
    deleteMonthHref.style.textDecoration = "none";
    deleteMonthHref.style.color = "white";
    deleteMonthHref.appendChild(document.createTextNode("Διαγραφή μήνα"));
    deleteMonthButton.appendChild(deleteMonthHref);
    btn.appendChild(deleteMonthButton);
    field.appendChild(btn);

}


//creates the table of the tournamentsAdmin page (creates the headers)
const rowLength = 5;

function addTableHeaders() { 
    
    //makes table's title (static)
    let table_field = document.querySelector(".board"); 
    let title = document.querySelector(".board #board_title");
    let board_headers = document.querySelectorAll("#board_headers th");

    let headers = [{"header_id": "start_date", "header_name" : "Ημερομηνία Έναρξης"},
                    {"header_id" : "end_date", "header_name" : "Ημερομηνία Λήξης"}, 
                    {"header_id" : "title", "header_name" : "Τίτλος Τουρνουά"},	
                    {"header_id" : "join_right", "header_name" : "Επίπεδο Ικανοτήτων"},
                    {"header_id" : "age", "header_name" : "Ηλικιακή Κατηγορία"}]
    for (let i = 0; i<5; i++) { 

        board_headers[i].className = "table_header";
        let text = document.createTextNode(headers[i].header_name);
        board_headers[i].appendChild(text);
        board_headers[i].setAttribute("id", headers[i].header_id);
 
    }
    
}

//create main buttons at the bottom of the tournaments list (one to add a anew tournament and one to see the comments of other user accounts when joining a tournament)

const buttons = document.querySelector(".buttons");


//add tournament button
//when clicked, the popup for tournament addition appears
let btn = document.createElement("div");
btn.className = "admin_button";
let addTournButton = document.createElement("button"); 
addTournButton.setAttribute("id", "addTournamentBtn");
addTournButton.addEventListener("click", addTournamentPopup);
addTournButton.appendChild(document.createTextNode("Προσθήκη τουρνουά"));
btn.appendChild(addTournButton);
buttons.appendChild(btn);

//show comments button
//when clicked, it directs the user to another page, theshowComments page
btn = document.createElement("div");
btn.className = "admin_button";
let showCommentsBtn = document.createElement("button"); 
showCommentsBtn.setAttribute("id", "addTournamentBtn");
showCommentsBtn.style.backgroundColor = "blueviolet";
showCommentsBtn.style.padding= "10px";
let showCommentsHref = document.createElement("a");
showCommentsHref.href = '/showComments';
showCommentsHref.style.textDecoration = "none";
showCommentsHref.style.color = "white";
showCommentsHref.style.fontWeight = "bold";
showCommentsHref.appendChild(document.createTextNode("ΔΕΙΤΕ ΤΑ ΣΧΟΛΙΑ ΤΩΝ ΧΡΗΣΤΩΝ"));
showCommentsBtn.appendChild(showCommentsHref);
btn.appendChild(showCommentsBtn);
buttons.appendChild(btn);


//function that checks what is the value of the checkValue variable
//if the value is loadEditTournament, the popup for editing of a specific tournament appears
//if the value is loadDeleteTournament, the popup for deleting of a specific tournament appears
//if the value is loadDeleteMonth, the popup for deleting of a specific month appears
function checkValue () {
    let checkValue = document.querySelector(".check_value");
    if (checkValue.innerHTML === "loadEditTournament"){
        editTournamentPopup();
        checkValue.innerHTML = null;
    }
    else if (checkValue.innerHTML === "loadDeleteTournament"){
        deleteTournamentPopup();
        checkValue.innerHTML = null;
    }
    else if (checkValue.innerHTML === "loadDeleteMonth"){
        deleteMonthPopup();
        checkValue.innerHTML = null;
    }
}


//tournaments popup funtions

//makes the modal container for adding a new tournament appear
function addTournamentPopup() {

    window.scrollTo(0,0);

    let popup = document.querySelector("#addTournament");
    modal = popup.querySelector(".modal-container");

    closeBtn = popup.querySelector(".close");
    closeBtn.addEventListener("click", closePopup);

    modal.style.zIndex = "500";
    modal.style.display = "flex";

}


//makes the modal container for deleting a specific tournament appear
function deleteTournamentPopup() { 

    let popup = document.querySelector("#deleteTournament");
    modal = popup.querySelector(".modal-container");

    closeBtn = popup.querySelector(".close");
    closeBtn.addEventListener("click", closePopup);

    modal.style.zIndex = "500";
    modal.style.display = "flex";

}


//makes the modal container for editing a specific tournament appear
function editTournamentPopup() { 

    let popup = document.querySelector("#editTournament");
    modal = popup.querySelector(".modal-container");

    closeBtn = popup.querySelector(".close");
    closeBtn.addEventListener("click", closePopup);

    modal.style.zIndex = "500";
    modal.style.display = "flex";

}


//makes the modal container for deleting a specific month appear
function deleteMonthPopup() { 

    let popup = document.querySelector("#deleteMonth");
    modal = popup.querySelector(".modal-container");

    closeBtn = popup.querySelector(".close");
    closeBtn.addEventListener("click", closePopup);

    modal.style.zIndex = "500";
    modal.style.display = "flex";

}


//hides the visible modal container
function closePopup() { 

    modal.style.zIndex = "-1";
    modal.style.display = "none";

}


//fetches the list with the tournaments as json objects
let fetchAllTournaments = () => { 
    fetch('/tournaments/allTournaments')     //the fetched result is a list of strings
    .then(
        (response) => response.json()   //we turn the list of strings into a list of jason objects
        .then((json) => renderAllTournaments(json))
    )
}

//gets the list with the json objects and calls appendMonthsTournaments to build the months and the tournaments of the database
let renderAllTournaments = (tournaments) => {
    appendMonthsTournaments(tournaments);
}

window.addEventListener('DOMContentLoaded', (event) => { 
    fetchAllTournaments();
    addTableHeaders();
    checkValue();
});


