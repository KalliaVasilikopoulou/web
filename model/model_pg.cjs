'use strict';
const sql = require('./db.pg.js');
const bcrypt = require('bcrypt');


//use it to create admin account (at start.cjs)
let createAdmin = (username,callback) => { 

    const query = { 
        text: 
        `UPDATE account
        SET adminrights = 'true'
        WHERE accountname = '${username}';`
    }

    sql.query(query, (err, res) => { 

        if(err) { 
            console.log(err.stack)
            callback(err.stack)
        }
        else { 
            callback(null, res.rows)
        }

    });
}


//used by logincontroller

//gets all info of account from database according to username input and sends them as response
let getUserByUsername = (username, callback) => { 

    const query = { 
        text: 
        `SELECT * FROM account WHERE accountname = $1`, 
        values: [username],
    }

    sql.query(query, (err, user) => { 

        if(err) { 
            console.log(err.stack)
            callback(err.stack)
        }
        else { 
            callback(null, user.rows[0])
        }

    });
}

//checks if account with given username value already exists
//if account with given username value does not exist, it adds account with given values to database
let registerUser = (username, password, email, fullname, callback) => { 

    getUserByUsername(username, async(err, userIdbyUsername) => { 

        if(userIdbyUsername != undefined) { 
            callback(null, null, "Υπάρχει ήδη χρήστης με αυτό το όνομα")
        }
        else { 
            try{ 
                const hashedPassword = await bcrypt.hash(password, 10);

                const query = { 
                    text: 
                    `INSERT INTO account(AccountName, AccountPassword, Email, FullName, AdminRights) 
                    VALUES ($1, $2, $3, $4,'false') RETURNING accountid`,
                    values: [username, hashedPassword, email, fullname]
                }

                sql.query(query, (err, result) => {
                    if (err)
                        callback(err.stack, null);
                    else {
                        callback(null, result.rows[0].accountid)
                    }
                })
            }   
            catch { 
                console.log(err)
                callback(err)
            }
        }
    })
}

//gets adminrights value from database according to username input and sends it as response
let getAdminRights = (accountid, callback) => {
    const query = { 
        text: 
        `select distinct adminrights 
        from account
        where accountid = '${accountid}';`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

//used by booking controller

//gets all hours from the table tabletimes of the database and sends them as response
let getTablehours = (callback) => { 

    const query = { 
        text: 
        `SELECT tablehour FROM tabletimes ORDER BY tabletimeid;`
    }

    sql.query(query, (err, tablehours) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, tablehours.rows);
        }
    })
}


//adds reservation with given values as inputs at the database reservation table
let bookSlot = (userid, date, time, courtid, callback) => { 
    
    //used for testing
    //need to uncomment command below before runnig command  $ npm test
    if (userid == null) {userid=2}

    const query = { 
        text: 
        `INSERT INTO reservation(reservationdate, reservationtime, reserveeid, courtid)
        VALUES ($2, $3, $1, $4)
        RETURNING *`,
        values: [userid, date, time, courtid]
    }

    sql.query(query, (err, row) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, row);
        }
    })

}

//adds reservation with given values as inputs at the database reservation table
let changeSlotAvailability = (userid, date, time, courtid, callback) => { 

    const query = { 
        text: 
        `INSERT INTO reservation (reservationdate, reservationtime, courtid, reserveeid) 
        VALUES ($1, $2, $3, $4)`,
        values: [date, time, courtid, userid],
    }

    sql.query(query, (err, state) => { 
        if(err){ 
            callback(err.stack)
        }
        else{ 
            callback(null, true);
        }
    })

}

//deletes reservation with given values from reservation table of database
let deleteReservation = (date, time, courtid, callback) => { 

    const query = { 
        text: 
        `DELETE 
        FROM reservation 
        WHERE reservationdate = $1 AND reservationtime = $2 AND courtid = $3`, 
        values: [date, time, courtid],
    }

    sql.query(query, (err, state) => { 
        if(err){ 
            callback(err.stack)
        }
        else{ 
            callback(null, true);
        }
    })

}

//gets all reservations from database reservation table (for a specific court) where courtid = the given id of the court
let courtReservations = (courtid, callback) => { 
    
    const query = { 
        text: 
        `SELECT * 
        FROM reservation 
        WHERE courtid = $1`, 
        values: [courtid],
    }

    sql.query(query, function(err, reservations){ 
        if(err) { 
            callback(err.stack)
        }
        else{ 
            callback(null, reservations.rows)
        }
    })

}

//gets all reservations from database reservation table (for a specific account) where reserveeid = the given id of the user
let accountReservations = (userid, callback) => { 

    const query = { 
        text: 
        `SELECT * 
        FROM reservation
        WHERE reserveeid = $1`,
        values: [userid],
    }

    sql.query(query, (err, reservations) => { 
        if(err){ 
            callback(err.stack)
        }
        else { 
            callback(null, reservations.rows)
        }
    })
}

//deletes a specific reservation that an account has made previously
let cancelReservation= (reserveeid, reservationid, callback) => {
    const query = { 
        text: 
        `delete from reservation where reserveeid = ${reserveeid} and reservationid = '${reservationid}';`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  
        }
    })

}



//used by tournament controller 

//gets all values of all tournaments and sends them (as response) as a list of json objects
let getTournaments = (callback) => {
    const query = { 
        text: 
        `select tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster from tournament ORDER BY startdate;`
    }


    sql.query(query, (err, tournaments) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, tournaments.rows)  //returns results as rows
        }
    })

}

//gets all values of a tournament with a specific id and sends them (as response) as a list that contains one json object
let getTournamentById = (tournamentId, callback) => {
    const query = { 
        text: 
        `select * from tournament where tournamentid = '${tournamentId}';`
    }


    sql.query(query, (err, tournament) => { 
        if(err) { 
            callback(err.stack);
        }
        else {
            callback(null, tournament.rows)  //returns results as rows
        }
    })

}

//gets the number of all the tournaments that the tournament table contains
let getTournamentsNumber = (callback) => {
    const query = { 
        text: 
        `select count(*) from tournament;`
    }


    sql.query(query, (err, tournaments) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, tournaments.rows)  //returns results as rows
        }
    })

}

//adds new tournament to database tournament table
//if title is null, it adds a general title value
//if tournament poster is null: it adds null value to the poster column
//else: the path of the poster at the files folder is added to poster column
let addTournament = (newTournament, callback) => {
    if (newTournament.title == '') newTournament.title = 'Επερχόμενο Τουρνουά (untitled)';
    if (newTournament.skilllevel == '') newTournament.skilllevel = null;
    if (newTournament.agerestrictions == '') newTournament.agerestrictions = null;

    let query;
    if (newTournament.poster == null)
        query = { 
            text: 
            `insert into tournament (tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster)
            values ('${newTournament.tournamentid}','${newTournament.title}', '${newTournament.startdate}', '${newTournament.enddate}', ${newTournament.skilllevel}, ${newTournament.agerestrictions}, '${newTournament.details}', ${newTournament.poster});`
        }
    else
    query = { 
        text: 
        `insert into tournament (tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster)
        values ('${newTournament.tournamentid}','${newTournament.title}', '${newTournament.startdate}', '${newTournament.enddate}', ${newTournament.skilllevel}, ${newTournament.agerestrictions}, '${newTournament.details}', '${newTournament.poster}');`
    }

    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

//deletes tournament with given id from database tournament table
let deleteTournament = (tournamentid, callback) => {
    const query = { 
        text: 
        `delete from tournament where tournamentid = '${tournamentid}';`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

//gets all months (month in english as monthname) that correspond to the start dates of the tournaments that the database tournament table contains
let getMonths = (callback) => {
    const query = { 
        text: 
        `select distinct monthname from 
        (select distinct startdate, TO_CHAR(DATE(startdate), 'Month') as monthname FROM tournament order by startdate) as orderedmonths;`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

//deletes all tournaments with startdates that correspond to the given month (given monthid)
let deleteMonth = (monthid, callback) => {
    const query = { 
        text: 
        `delete from tournament where translate(TO_CHAR(DATE(startdate), 'Month'), ' ', '') in ('${monthid}');`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

//gets all tournaments that have startdates that correspond to the given month (given monthid)
let getMonthTournaments = (monthid, callback) => {
    const query = { 
        text: 
        `select count(*) from tournament where translate(TO_CHAR(DATE(startdate), 'Month'), ' ', '') in ('${monthid}');`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

//updates tournament at tournament table of database with given values
//if title is null, it adds a general title value
//if tournament poster is null: the old poster value doesn't change
//else: the path of the poster at the files folder is added to poster column
let updateTournament = (newTournament, callback) => {
    if (newTournament.title == '') newTournament.title = 'Επερχόμενο Τουρνουά (untitled)';
    if (newTournament.skilllevel == '') newTournament.skilllevel = null;
    if (newTournament.agerestrictions == '') newTournament.agerestrictions = null;
    
    let query;
    if (newTournament.poster == null)
        query = { 
            text:
            `update tournament
                set title = '${newTournament.title}', startdate = '${newTournament.startdate}', enddate = '${newTournament.enddate}', skilllevel = ${newTournament.skilllevel}, agerestrictions = ${newTournament.agerestrictions}, details = '${newTournament.details}'
                where tournamentid = '${newTournament.tournamentid}';`
        }
    else
        query = { 
            text:
            `update tournament
                set title = '${newTournament.title}', startdate = '${newTournament.startdate}', enddate = '${newTournament.enddate}', skilllevel = ${newTournament.skilllevel}, agerestrictions = ${newTournament.agerestrictions}, details = '${newTournament.details}', poster = '${newTournament.poster}'
                where tournamentid = '${newTournament.tournamentid}';`
        }
    
    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

//gets all values of row of table joins at database with participantid = the participant id of the request and tournamentid = the tournament id of the request
let searchJoin = (participantid, tournamentid, callback) => {
    const query = { 
        text: 
        `select * from joins where participantid = ${participantid} and tournamentid = '${tournamentid}';`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  
        }
    })

}

//checks if participant has already joined in the same tournament
//if yes: the function updates the comment value with the given one
//if no: the function adds new row in the joins table if the database with the given values
let joinTournament= (joined, participantid, tournamentid, comments, callback) => {
        let query;
        if (joined.length == 0)
            query = { 
                text: 
                `insert into joins(participantid, tournamentid, comments)
                VALUES (${participantid}, '${tournamentid}', '${comments}');`
            };
        else
            query = { 
                text: 
                `update joins
                set comments = '${comments}'
                where participantid = ${participantid} and tournamentid = '${tournamentid}';`
            };
    
    
        sql.query(query, (err, res) => { 
            if(err) { 
                callback(err.stack);
            }
            else { 
                callback(null, res.rows)  
            }
        })
}


//deletes a specific join request at a specific tournament that an account has made previously
let cancelJoinTournament= (participantid, tournamentid, callback) => {
    const query = { 
        text: 
        `delete from joins where participantid = ${participantid} and tournamentid = '${tournamentid}';`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  
        }
    })

}


//gets all the tournaments that a specific account has joined in and sends them as response
let getUserTournaments = (participantid, callback) => {
    const query = { 
        text: 
        `select distinct * 
        from joins join tournament on joins.tournamentid = tournament.tournamentid
        where joins.participantid = '${participantid}';`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

//gets all account name , title and comments of all the join requests that have been made and stored in the join table of the database
let getAllJoins = (callback) => {
    const query = { 
        text: 
        `select distinct accountname, title, comments 
        from account join (joins join tournament on joins.tournamentid = tournament.tournamentid) on accountid=participantid;`
    }


    sql.query(query, (err, res) => { 
        if(err) { 
            callback(err.stack);
        }
        else { 
            callback(null, res.rows)  //returns results as rows
        }
    })

}

module.exports = {createAdmin, getUserByUsername, registerUser, getAdminRights,
                  getTablehours, bookSlot, changeSlotAvailability, deleteReservation, courtReservations, accountReservations, cancelReservation, 
                  getTournaments, getTournamentById, getTournamentsNumber, addTournament, deleteTournament, getMonths, deleteMonth, updateTournament, joinTournament, getUserTournaments, getMonthTournaments, cancelJoinTournament, getAllJoins, searchJoin};