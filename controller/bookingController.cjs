const dotenv = require('dotenv');
dotenv.config();

let model = require('../model/model_pg.cjs');
// let model = require('../model/db.pg.js');

const max = 4;  //the club has a total of 4 courts
const min = 1;  //first (initial) court
let courtVariable = min;    //courtVariable variable is the variable used for the number of the current court
let accountReservations = [];
let currentAccountReservations = [];

/** 
*@description used when pressing "next" button in booking page to show next court page
*/
function increment(req, res) { 
    if (courtVariable == max){ 
        courtVariable = max;
    }
    else{ 
        courtVariable++;
    }
    res.redirect('/booking');
}

/** 
*@description used when pressing "previous" button in booking page to show previous court page
*/
function decrement(req, res) { 
    if(courtVariable == min) { 
        courtVariable = min;
    }
    else { 
        courtVariable--;
    }
    res.redirect('/booking');
}

/**
 * @description called by booking(Admin)Main - fetches booking slot hours from datatable to render them - intention was for admin to be able to change them 
 */
function tablehours(req, res) { 
    model.getTablehours(function(err, rows) { 
        if(err) { 
            res.send(err);
        }
        else { 
            res.send(rows);
        }
    });
}

/** 
 * @description used by bookingAdmin in case time slot needs to be set unavailable - reservation is made for admin account, although admin is not supposed to make reservations
 */
function changeBooking(req, res, next) { 
    let courtid = `C_${courtVariable}`;
    let date = req.params.datetime.substring(0, 10);
    let time = req.params.datetime.substring(10);
    model.changeSlotAvailability(req.session.loggedUserId, date, time, courtid, function(err, rows) { 
        if(err) { 
            res.send(err); 
        }
        else{ 
            next();
        }
    })
}

/**
 * @description used by bookingAdmin to delete existing reservation
 */
function deleteBooking(req, res, next) { 
    let courtid = `C_${courtVariable}`;
    let date = req.params.datetime.substring(0, 10);
    let time = req.params.datetime.substring(10);
    model.deleteReservation(date, time, courtid, function(err, rows) { 
        if (err) { 
            res.send(err);
        }
        else { 
            next();
        }
    })
}

/**
 * @description used by bookingMain to make reservation 
 */
function makeBooking(req, res, next) {
    let courtid = `C_${courtVariable}`;
    let date = req.params.datetime.substring(0, 10);
    let time = req.params.datetime.substring(10);
    model.bookSlot(req.session.loggedUserId, date, time, courtid, function(err, result) { 
        if(err) { 
            res.send(err);
        }
        else{ 
            result.rows[0].courtid = result.rows[0].courtid.substr(2);
            accountReservations.push(result.rows[0]);
            next();
        }
    })
}

/**
 * @description returns courtVariable, used by booking(Admin)Main
 */
function getCurrentCourt(req, res) { 
    res.send(`${courtVariable}`);
}

/**
 * @description returns all reservations (all attributes) of current court
 */
function getReservations(req, res) { 
    let courtId = `C_${courtVariable}`;
    model.courtReservations(courtId, (err, rows) => {
        if(err) { 
            res.send(err);
        }
        else {
            res.send(rows);
        }
    });
}


/**
 * @description returns all reservations (all attributes) of logged user
 */
function getAccountReservations(req, res, next) {
    model.accountReservations(req.session.loggedUserId, (err, rows) => { 
        if(err) { 
            res.send(err); 
        }
        else {
            currentAccountReservations = [];
            for (let i of rows) { 
                i.courtid = i.courtid.substr(2);
                currentAccountReservations.push(i);
            }
            res.send(currentAccountReservations);
        }
    })
}

//deletes specific reservation from reservation table of database for a specific user
function cancelReservation (req,res) {
    model.cancelReservation(req.session.loggedUserId, req.query.reservationid, function(err, cancelReservation) {
        if (err)
            return console.error(err.message);
        else {
            if(err) { 
                res.send(err);
            }
            else {
                res.redirect(req.query.location);
            }
        }
    }); 
}

//when logged in, get account reservations
function setGlobal(req, res, next) { 
    accountReservations = currentAccountReservations;
    exports.accountReservations = accountReservations;
}


// render page

function renderBookingAdmin(req, res) { 
    let scripts = [];
    res.render('bookingAdmin', {layout: 'signed.hbs', title: "Villia Tennis Club | Booking", style: "/booking.css", courtVariable: courtVariable, scripts: scripts, reservations: accountReservations});
}

function renderBooking(req, res) { 
    let scripts = [];
    res.render('booking', {layout: 'signed.hbs', title: "Villia Tennis Club | Booking", style: "/booking.css", courtVariable: courtVariable, scripts: scripts, reservations: accountReservations});
}


//when renderChoise gets called, initial court is set to be court 1
//checks if the user that has logged in as a simple user or an administrator and directs to different pages each time
// if simple user -> direct to booking page
// if administrator -> direct to bookingAdmin page
function renderChoice(req, res) { 

    if(req.session.newSession == true) { 
        courtVariable = 1; 
        req.session.newSession = false;
    }

    if(req.session.adminRights) { 
        renderBookingAdmin(req, res);
    }
    else{ 
        renderBooking(req, res);
    }
}

exports.increment = increment;
exports.decrement = decrement;
exports.tablehours = tablehours;
exports.renderBookingAdmin = renderBookingAdmin;
exports.deleteBooking = deleteBooking;
exports.makeBooking = makeBooking;
exports.getCurrentCourt = getCurrentCourt;
exports.getReservations = getReservations;
exports.renderChoice = renderChoice;
exports.getAccountReservations = getAccountReservations;
exports.setGlobal = setGlobal;
exports.changeBooking = changeBooking;
exports.cancelReservation = cancelReservation;
