let table = document.querySelector(".table");

const tableWidth = 14;  //we have 13 rows for each hour of the table and 1 row fot the days
const tableHeight = 8;  //we have 7 rows for each day of the table and 1 row for the hours
let currentCourt;       //the court we currently see at the page
let hoursArray = [];    //here we store the hours of the table

//when a booking state changes (booking slot is not available anymore), the changeBooking function fetches the results given at the /booking/change page with the date and time of the slot that changed
let changeBooking = (event) => { 
    let date = event.target.getAttribute("date"); 
    let time = event.target.getAttribute("time");
    let datetime = date+time;
    let modal_form = document.querySelector("#accept_decline .modal-container");
    modal_form.style.zIndex = "-1";
    modal_form.style.display = "none";
    fetch('/booking/change/' + datetime)
    .then(
        (response) => response.json()
        .then((json) => fillCells(json))
    )
}

//when a booking state changes (booking slot is now available), the deleteBooking function fetches the results given at the /booking/delete page with the date and time of the slot that changed
let deleteBooking = (event) => { 
    let date = event.target.getAttribute("date"); 
    let time = event.target.getAttribute("time");
    let datetime = date+time;
    let modal_form = document.querySelector("#accept_decline .modal-container");
    modal_form.style.zIndex = "-1";
    modal_form.style.display = "none";

    fetch('/booking/delete/' + datetime)
    .then(
        (response) => response.json()
        .then((json) => fillCells(json))
    )
}


//function used to hide the popups when cancel button is pressed
let closeForm = () => { 
    let modal_form = document.querySelector("#accept_decline .modal-container");
    modal_form.style.zIndex = "-1";
    modal_form.style.display = "none";
}


//confirmForm enables the modal container for the confirmantion of the slot availability change
//if the given command value is "delete", then the slot availability changes from unavailable to available (deletes reservation)
//if the given command value is "change", then the slot availability changes from available to unavailable (adds reservation)
let confirmForm = (date, time, command) => { 
    let modal_form = document.querySelector("#accept_decline .modal-container");
    modal_form.style.zIndex = "500";
    modal_form.style.display = "flex";
    let proceedWithChange = modal_form.querySelector("#proceedBtn"); 
    proceedWithChange.setAttribute("date", date);
    proceedWithChange.setAttribute("time", time);
    if(command=="delete"){ 
        proceedWithChange.addEventListener("click", deleteBooking);
    }
    else if(command=="change"){ 
        proceedWithChange.addEventListener("click", changeBooking);
    }
    let cancelChange = modal_form.querySelector("#cancelBtn");
    cancelChange.addEventListener("click", closeForm);
}


//calls confirm form for the specific slot with command = "change"
let getIdForBookingChange = (event) => { 
    confirmForm(event.target.getAttribute("date"), event.target.getAttribute("time"), "change");
}


//calls confirm form for the specific slot with command = "delete"
let getIdForBookingDelete = (event) => { 
    confirmForm(event.target.getAttribute("date"), event.target.getAttribute("time"), "delete");
}


//function used to fill the slots of the tables, according to the availability of each slot
//available slots have a different symbol from unavailable slots
//at the beginning, all slots have availability = 'true'
//if a reservation with the same date and time with a specific slot exists, then this slot has availability = 'false'
let fillCells = (reservations) => { 

    const data = document.querySelectorAll(".data_row td"); 

    for (let i of data) { 

        let data_date = i.getAttribute("date");
        let data_time = i.getAttribute("time");

        i.setAttribute("availability", "true");
        for (let k of reservations) { 
            if (k.reservationdate == data_date) {
                if(k.reservationtime == data_time) { 
                    i.setAttribute("availability", "false");
                    break;
                } 
            }
        }
    }

    for (let cell of data) { 
        if(cell.getAttribute("availability") == "true") { 
            cell.innerHTML = "&#10003;";
            cell.style.color = "#19E600";
            cell.style.backgroundColor = '#f5f7f9';
            cell.addEventListener("click", getIdForBookingChange)   //an available slot has event listener that adds new reservation when clicked (and it turns into unavailable slot)
        }
        else if (cell.getAttribute("availability") == "false") { 
            cell.innerHTML = "&#88;";
            cell.style.color = "#FF2E2E";
            cell.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            cell.addEventListener("click", getIdForBookingDelete)   //an unavailable slot has event listener that deletes a specific reservation when clicked (and it turns into available slot)
        }
    }

}

//sets the time value of each cell of the table, according to the hour cell (first row) of the column it belongs in
let identifyDataColumns = () => { 

    const datarows = document.querySelectorAll(".data_row"); 

    for (let i of datarows) { 
        let cells = i.querySelectorAll("td"); 
        let counter = 0;
        for (let k of cells) { 
            k.setAttribute("time", hoursArray[counter]);
            counter++;
        }
    }
    fetchReservations();

}

//fills the first row of the table with the given tablehour values of the hourslots objects
let fillHourRow = (hourslots) => {

    const data_length = hourslots.length;
    const hours = document.querySelector(".hours");
    let children = hours.children;

    for (let i = 0; i<data_length; i++) {

        let cell = children[i+1];
        let hour = hourslots[i].tablehour;
        hoursArray.push(hour);
        let text = document.createTextNode(hour);
        let p = document.createElement('p'); 
        p.appendChild(text);
        cell.appendChild(p);
    }
    identifyDataColumns();
}

//ccreates the text that the first column (the column with the dates) contains
//the date of each cell of the first row is a date between the current date and the date after 7 days
let fillDayColumn = () => { 

    const month_cell = document.querySelector(".hours .cell0"); 
    let text = document.createTextNode("Για την επόμενη εβδομάδα");
    month_cell.append(text);
    
    const days = document.querySelectorAll(".data_row .cell0");
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let cellDate = new Date();

    for (let i = 0; i<days.length; i++) { 
        cellDate.setDate(new Date().getDate() + i);
        let text = document.createTextNode(cellDate.toLocaleDateString('el-GR', options));
        days[i].append(text);
    }

}

//creates the cells of each row and adds date value to each cell, where date is a date between the current date and the date after 7 days
let fillRow = (day, row) => { 

    let rowDate = new Date();
    rowDate.setDate(new Date().getDate() + (day-1));
    rowDate = rowDate.toISOString().slice(0,10);

    let cell = document.createElement("th");

    cell.style.width = "20%";

    for (let i = 0; i<tableWidth; i++) { 
        if (i != 0) { 
            cell = document.createElement("td");
            cell.style.colSpan = "1";
            cell.setAttribute("date", rowDate);
        }
        cell.classList.add(`cell${i}`);
        cell.classList.add("bookingTableCell");

        row.appendChild(cell);
    }

}

//sets class names to rows (first row has different class name from the rest)
let makeTable = () => {

    for (let i = 0; i<tableHeight; i++) { 
        let row = document.createElement("tr");
        if (i == 0) { 
            row.className = "hours";
        }
        else { 
            row.className = "data_row"
        }
        fillRow(i, row);
        table.appendChild(row);
    }

    fillDayColumn();
}

//gets the hours that will fill the first row of the table and calls fillHourRow function
let renderTablehours = (hourslots) => { 
    fillHourRow(hourslots);
}

//gets the reservations of the current court and calls fillCells function
let renderCells = (reservations) => { 
    fillCells(reservations);
}

//gets the number of the current court and sets current court = this number
function setCourt(court) { 
    currentCourt = court;
    fetchTablehours();
}

//fetches all reservations for current court
let fetchReservations = () => { 
    fetch('booking/availability')
    .then( 
        (response) => response.json()
        .then(
            (json) => renderCells(json)
        )
    )
}

//fetches the number of the current court from the bookingController
let fetchCurrentCourt = () => { 
    fetch('/booking/courts')
    .then(
        (response) => response.json()
        .then(
            (json) => setCourt(json)
        )
    )
}

//gets the hours of the table that are stored in the database
let fetchTablehours = () => { 
    fetch('/booking/hours')
    .then(
        (response) => response.json()
        .then((json) => renderTablehours(json))
    )
}

window.addEventListener('DOMContentLoaded', (event) => { 
    makeTable();
    fetchCurrentCourt();
});


