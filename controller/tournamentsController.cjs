const dotenv = require('dotenv');
const { send } = require('express/lib/response');
dotenv.config();

const fs = require("fs");

let model = require('../model/model_pg.cjs');
// let model = require('../model/db.pg.js');
let bookingController = require ('./bookingController.cjs');

const monthsGreek = {0: 'Ιανουάριος', 1: 'Φεβρουάριος', 2: 'Μάρτιος', 3: 'Απρίλιος', 4: 'Μάιος', 5: 'Ιούνιος', 6: 'Ιούλιος', 7: 'Αύγουστος', 8: 'Σεπτέμβριος', 9: 'Οκτώβριος', 10: 'Νοέμβριος', 11: 'Δεκέμβριος'}
const monthsEnglish = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'}

let loadpopup = null;


//used to turn a list of month items with one attribute (monhtname in engish) into a list of month items with two attributes (monthname in greek and monthid in greek)
function translate (months){
    for (m of months){
        m.monthname = m.monthname.replace(/\s+/g, '');
        for (let i in monthsEnglish){
            if (monthsEnglish[i] == m.monthname){
                m.monthid = m.monthname;
                m.monthname = monthsGreek[i];
            }
        }
    }
}

//used to turn date format to yyyy-mm-dd (more readable)
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('/');
}

//uses formatDate function to turn start date and end date format of each tournament in tournaments list input into format yyyy-mm-dd
function fixDates (tournaments){
    for (tour of tournaments){
        tour.startdate = formatDate(tour.startdate);
        tour.enddate = formatDate(tour.enddate);
    }
}

//direct to tournamentForm page (also sends json object list of all tournaments of database)
function renderTournamentForm(req, res) { 
    let scripts = [];
    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            res.render('tournamentForm', {layout: 'signed', title: "Villia Tennis Club | Join A Tournament", style: "booking.css", tournaments: tournaments , scripts: scripts});
        }
    });
}

//gets all tournaments of database and sends them as response
function allTournaments(req,res) {
    model.getTournaments(function(err, rows) { 
        if(err) { 
            res.send(err);
        }
        else {
            res.send(rows);
        }
    });
}

//gets the tournament that the user selected from the database and directs to tournamentForm page, where it sends the selected tournament as json object
function addTournamentToForm (req,res) {
    let scripts = [];

    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            res.render('tournamentForm', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "booking.css", tournaments: tournaments , selectedTournament: req.query.tournamentid, scripts: scripts});
        }
    });
}

//gets tournament as request object and adds it to database and, then, redirects to tournamentsAdmin page
//if startdate ir enddate request value is null, then the current date is given to each one
function addTournamentToDB (req,res) {
    model.getTournamentsNumber(function(err, number) {
        if (err)
            return console.error(err.message);
        else{
            var todayDate = new Date().toISOString().slice(0, 10);
            if (req.body.startdate == "") req.body.startdate = todayDate;
            if (req.body.enddate == "") req.body.enddate = todayDate;
            let poster;
            if (req.file === undefined) poster= null;
            else poster = req.file.filename;
            const tournamentid = parseInt(number[0].count)+1;
            const newTournament = {"tournamentid":"TOUR_"+ tournamentid+"_"+Math.floor(Math.random() * 101), "title":req.body.title, "startdate":req.body.startdate, "enddate":req.body.enddate, "skilllevel": req.body.skilllevel, "agerestrictions": req.body.agerestrictions, "details": req.body.details, "poster": poster};

            model.addTournament(newTournament, function(addError, data) { 
                model.getTournaments(function(err, tournaments) { 
                    if(err) { 
                        res.send(err);
                    }
                    else {
                        fixDates(tournaments);
                        model.getMonths(function(err, months) {
                            if(err) { 
                                res.send(err);
                            }
                            else {
                                translate(months);
                                if (addError){
                                    console.log(addError);
                                    res.send("Τα στοιχεία που συμπληρώσατε δεν είναι εγκυρα! Ελέγξτε αν έχετε συμπληρώσει σωστά τα πεδία της φόρμας. Πηγαίνετε στην προηγούμενη σελίδα για να επαναλάβετε την προσπάθεια σας...");
                                }
                                else {
                                    console.log("form submitted");
                                    res.redirect("/tournamentsAdmin");
                                }
                            }
                        });
                    }
                });
            });
        }
    }); 
}

//gets tournament as request object and deletes it from the database and, then, redirects to tournamentsAdmin page
function deleteTournamentFromDB (req,res) {
    model.deleteTournament(req.body.tournamentid, function(err, number) {
        if (err)
            return console.error(err.message);
        else {
            cleanDisk();
            model.getTournaments(function(err, tournaments) { 
                if(err) { 
                    res.send(err);
                }
                else {
                    res.redirect("/tournamentsAdmin");
                }
            });
        }
    }); 
}

//gets month as request object and deletes every tournament that starts in this month from the database and, then, redirects to tournamentsAdmin page
function deleteMonthFromDB (req,res) {
    model.deleteMonth(req.body.monthid, function(err, month) {
        if (err)
            return console.error(err.message);
        else {
            cleanDisk();
            model.getTournaments(function(err, tournaments) { 
                if(err) { 
                    res.send(err);
                }
                else {
                    res.redirect("/tournamentsAdmin");
                }
            });
        }
    }); 
}

//gets selected tournament from database and redirects to tournamentsAdmin page with variable loadpopup = "loadEditTournament"
//when loadpopup = "loadEditTournament", the function that opens the modal container for editing of a specific tournament is triggered
function editTournamentSelect(req,res) {
    let scripts = [];
    model.getTournamentById(req.query.tournamentid, function(err, selected) { 
        if(err) { 
            res.send(err);
        }
        else {

            //Due to timezone problems, we have to manually add one day to the dates
            selected[0].startdate.setDate(selected[0].startdate.getDate()+1);
            selected[0].enddate.setDate(selected[0].enddate.getDate()+1);

            selected[0].startdate = (selected[0].startdate).toISOString().slice(0, 10);
            selected[0].enddate = (selected[0].enddate).toISOString().slice(0, 10);

            model.getTournaments(function(err, tournaments) { 
                if(err) { 
                    res.send(err);
                }
                else {
                    fixDates(tournaments);
                    model.getMonths(function(err, months) {
                        if(err) { 
                            res.send(err);
                        }
                        else {
                            translate(months);
                            loadpopup = "loadEditTournament";
                            res.render('tournamentsAdmin', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournamentsAdmin.css", tournaments: tournaments, months: months ,selected: selected[0], loadpopup: loadpopup, scripts: scripts});
                        }
                    });
                }
            });
        }
    });
}



//gets selected tournament from database and redirects to tournamentsAdmin page with variable loadpopup = "loadDeleteTournament"
//when loadpopup = "loadDeleteTournament", the function that opens the modal container for deleting of a specific tournament is triggered
function deleteTournamentSelect(req,res) {
    let scripts = [];
    model.getTournamentById(req.query.tournamentid, function(err, selected) { 
        if(err) { 
            res.send(err);
        }
        else {
            fixDates(selected);
            model.getTournaments(function(err, tournaments) { 
                if(err) { 
                    res.send(err);
                }
                else {
                    fixDates(tournaments);
                    model.getMonths(function(err, months) {
                        if(err) { 
                            res.send(err);
                        }
                        else {
                            translate(months);
                            loadpopup = "loadDeleteTournament";
                            res.render('tournamentsAdmin', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournamentsAdmin.css", tournaments: tournaments, months: months ,selected: selected[0], loadpopup: loadpopup, scripts: scripts});
                        }
                    });
                }
            });
        }
    });
}

//gets number of tournaments that the selected month contains from database and redirects to tournamentsAdmin page with variable loadpopup = "loadDeleteMonth"
//when loadpopup = "loadDeleteMonth", the function that opens the modal container for deleting of a specific month and all the tournaments that it contains is triggered
//function translate is called for selected month, so we can make the month obejct more usable (monthname = the attribute that equals the name of the month in greek and monthid = the attribute that equals the name of the month in english)
function deleteMonthSelect(req,res) {
    let scripts = [];
    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            fixDates(tournaments);
            model.getMonths(function(err, months) {
                if(err) { 
                    res.send(err);
                }
                else {
                    model.getMonthTournaments(req.query.monthid, function(err, tournamentsCount) { 
                        if(err) { 
                            res.send(err);
                        }
                        else {
                            selectedMonth = [{monthname: req.query.monthid}];
                            translate(selectedMonth);
                            selectedMonth[0].tournamentsCount = tournamentsCount[0].count;
                            loadpopup = "loadDeleteMonth";
                            res.render('tournamentsAdmin', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournamentsAdmin.css", tournaments: tournaments, months: months ,selected: selectedMonth[0], loadpopup: loadpopup, scripts: scripts});
                        }});
                }
            });
        }
    });
}



//gets all new tournament values as request object and updates the tournament with id = request.tournamentid  at the database (new values = the values from the request body) and, then, redirects to tournamentsAdmin page
//if startdate ir enddate request value is null, then the current date is given to each one
function editTournamentAtDB (req,res) {
    req.body = JSON.parse(JSON.stringify(req.body));
    model.getTournamentsNumber(function(err, number) {
        if (err)
            return console.error(err.message);
        else{
            var todayDate = new Date().toISOString().slice(0, 10);
            if (req.body.startdate == "") req.body.startdate = todayDate;
            if (req.body.enddate == "") req.body.enddate = todayDate;
            let poster;
            if (req.file === undefined) poster= null;
            else poster = req.file.filename;
            const newTournament = {"tournamentid": req.body.tournamentid, "title":req.body.title, "startdate":req.body.startdate, "enddate":req.body.enddate, "skilllevel": req.body.skilllevel, "agerestrictions": req.body.agerestrictions, "details": req.body.details, "poster": poster};
            
            model.updateTournament(newTournament, function(editError, data) {
                model.getTournaments(function(err, tournaments) { 
                    if(err) { 
                        res.send(err);
                    }
                    else {
                        fixDates(tournaments);
                        model.getMonths(function(err, months) {
                            if(err) { 
                                res.send(err);
                            }
                            else {
                                translate(months);
                                if (editError){
                                    console.log(editError);
                                    res.send(err);
                                }
                                else {
                                    cleanDisk();
                                    console.log("form submitted");
                                    res.redirect("/tournamentsAdmin");
                                }
                                
                            }
                        });
                    }
                });
            });
        }
    }); 
}

//directs to tournamentsAdmin page and sends all tournaments stored at database
//fixedDates function is used at all tournaments' start dates and end dates to change the format of the dates
function renderTournamentAdmin(req, res) { 
    let scripts = [{script: '/scripts/tournamentPopup.cjs'}]; 
    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            fixDates(tournaments);
            model.getMonths(function(err, months) {
                if(err) { 
                    res.send(err);
                }
                else {
                    model.getUserTournaments(req.session.loggedUserId, function(err, myTournaments) {
                        if(err) { 
                            res.send(err);
                        }
                        else {
                            translate(months);
                            fixDates(myTournaments);
                            res.render('tournamentsAdmin', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournamentsAdmin.css", tournaments: tournaments , myTournaments: myTournaments, months: months, scripts: scripts});
                        }
            });
        }
    });
}})
}



//directs to tournaments page and sends all tournaments stored at database
//fixedDates function is used at all tournaments' start dates and end dates to change the format of the dates
function renderTournament(req, res) { 
    let scripts = [{script: '/scripts/tournamentPopup.cjs'}]; 
    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            fixDates(tournaments);
            model.getMonths(function(err, months) {
                if(err) { 
                    res.send(err);
                }
                else {
                    model.getUserTournaments(req.session.loggedUserId, function(err, myTournaments) {
                        if(err) { 
                            res.send(err);
                        }
                        else {
                            translate(months);
                            fixDates(myTournaments);
                            res.render('tournaments', {layout: 'signed', title: "Villia Tennis Club | Tournaments", style: "tournaments.css", tournaments: tournaments, myTournaments: myTournaments , months: months, reservations: bookingController.accountReservations, scripts: scripts});
                        }
                    });
                }
            });
        }
    });
}


//checks if the user that has logged in as a simple user or an administrator and directs to different pages each time
// if simple user -> direct to tournaments page
// if administrator -> direct to tournamentsAdmin page
function renderChoice (req, res) { 
    if(req.session.adminRights) { 
        renderTournamentAdmin(req, res);
    }
    else{
        renderTournament(req, res);
    }
}


//checks if the account that requested to join the tournament is an administrator or not
//if account = admin: redirect to tournamentForm page (admin account can not join tournaments, it cant just modify them)
//else: check if account already joined in the same tournament (variable joined is true if account already joined in the same tournament)
//join tournament if if not joined, else just change comments and replace them with the new ones the user made on the new tournament participation form
function joinTournament (req,res) {
    model.getAdminRights(req.session.loggedUserId, function(err, adminRights) {
        if(err) { 
            res.send(err);
        }
        else {
            if (adminRights[0].adminrights) {
                res.redirect("/tournamentForm");
            }
            else {
                model.searchJoin(req.session.loggedUserId, req.body.tournamentid, function(searchErr, joined) {
                    if (searchErr){
                        res.send(searchErr);
                    }
                    else {
                        model.joinTournament(joined, req.session.loggedUserId, req.body.tournamentid, req.body.comments, function(err, join) {
                            if (err)
                                return console.error(err.message);
                            else {
                                if(err) { 
                                    res.send(err);
                                }
                                else {
                                    res.redirect("/tournamentForm");
                                }
                            }
                        }); 
                    }});
            }
        }
    });
}


//deletes tournament join row at join table of database with participantid = the participant id of the request and tournamentid = the tournament id of the request
function cancelJoinTournament (req,res) {
    model.cancelJoinTournament(req.session.loggedUserId, req.query.tournamentid, function(err, cancelJoinTournament) {
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

//directs to showComments page and sends all comments at join table stored at database (if there are any comments -> emptyJoin variable checks if any comment exists)
function rendershowComments(req,res) {
    let scripts = [];
    model.getAllJoins(function(err, joins) {
        if(err) { 
            res.send(err);
        }
        else {
            let emptyJoin=1;
            for (let j in joins)
                if (joins[j].comments != "")
                    emptyJoin=0;
            if (emptyJoin) joins = null;
            res.render('tournamentComments', {layout: 'signed', title: "Villia Tennis Club | Tournament Comments", style: "tournamentComments.css", joins: joins , scripts: scripts});
        }
    });
}


//gets all tournaments that the user account with id = the id of the request, fixes dates formats of tournaments with fixDates function and sends the json objects in a list as response
function renderUserTournaments(req,res) {
    model.getUserTournaments(req.session.loggedUserId, function(err, myTournaments) {
        if(err) { 
            res.send(err);
        }
        else {
            fixDates(myTournaments);
            res.send (myTournaments);
        }
    });
}



let allImages;
let imagesInUse;
let imagesNotUsed;

//called every time a tournament is deleted or modified (or a whole month is deleted)
//checks if the images that are in the files folder are in the database
//if an image is in the files folder but not in the database (this means that we don't need it), it deletes it
function cleanDisk() {
    imagesInUse = [];
    allImages = fs.readdirSync("public/files/");
    for (let i in allImages) allImages[i]= "public/files/"+allImages[i];
    model.getTournaments(function(err, tournaments) { 
        if(err) { 
            res.send(err);
        }
        else {
            for (let tour of tournaments) {
                if (tour.poster != null)
                    imagesInUse.push("public/"+tour.poster);
            }

            imagesNotUsed = allImages.filter( function( el ) {
                return !imagesInUse.includes( el );
            } );

            for (let path of imagesNotUsed) fs.unlinkSync(path);
            
        }
    });
};



exports.renderTournament = renderTournament;
exports.renderTournamentForm = renderTournamentForm;
exports.allTournaments = allTournaments;
exports.addTournamentToForm = addTournamentToForm;
exports.addTournamentToDB = addTournamentToDB;
exports.deleteTournamentFromDB = deleteTournamentFromDB;
exports.deleteMonthFromDB = deleteMonthFromDB;
exports.editTournamentSelect = editTournamentSelect;
exports.editTournamentAtDB = editTournamentAtDB;
exports.renderChoice = renderChoice;
exports.joinTournament = joinTournament;
exports.renderUserTournaments = renderUserTournaments;
exports.deleteTournamentSelect = deleteTournamentSelect;
exports.deleteMonthSelect = deleteMonthSelect;
exports.cancelJoinTournament = cancelJoinTournament;
exports.rendershowComments = rendershowComments;