// 'use strict';
// const { Client } = require('pg');

// const client = new Client({
//     user: process.env.PG_USER,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DATABASE,
//     password: process.env.PG_PASSWORD,
//     port: process.env.PG_PORT,
//     idleTimeoutMillis: 0,
//     connectionTimeoutMillis: 0
// });

// client.connect((err) => {
//     if (err)
//         throw err;
// });

// module.exports = client








/////////////KNEX/////////////////////


// // const pg = require('knex');
// const options = {
//     client: 'postgres',
//     connection: {
//         database: 'db',
//         connectionString: process.env.DATABASE_URL || 'https://data.heroku.com/dataclips/myuyvblbtehgbranaxcpokofmrwq',
//         ssl: { rejectUnauthorized: false }
//     }
// }

// const pg = require('knex')(options);

// //used by logincontroller

// //gets all info of account from database according to username input and sends them as response
// let getUserByUsername = (username, callback) => { 

//     // const query = { 
//     //     text: 
//     //     `SELECT * FROM account WHERE accountname = $1`, 
//     //     values: [username],
//     // }

//     // sql.query(query, (err, user) => { 

//     //     if(err) { 
//     //         console.log(err.stack)
//     //         callback(err.stack)
//     //     }
//     //     else { 
//     //         callback(null, user.rows[0])
//     //     }

//     // });


//     pg.select('*').from('account').where('accountname', username)
//     .then((user) => callback(null, user.rows[0]), (err) => callback(err, null));

// }

// //checks if account with given username value already exists
// //if account with given username value does not exist, it adds account with given values to database
// let registerUser = (username, password, email, fullname, callback) => { 

//     getUserByUsername(username, async(err, userIdbyUsername) => { 

//         if(userIdbyUsername != undefined) { 
//             callback(null, null, "Υπάρχει ήδη χρήστης με αυτό το όνομα")
//         }
//         else { 
//             try{ 
//                 const hashedPassword = await bcrypt.hash(password, 10);

//                 // const query = { 
//                 //     text: 
//                 //     `INSERT INTO account(AccountName, AccountPassword, Email, FullName, AdminRights) 
//                 //     VALUES ($1, $2, $3, $4,'false') RETURNING accountid`,
//                 //     values: [username, hashedPassword, email, fullname]
//                 // }

//                 // sql.query(query, (err, result) => {
//                 //     if (err)
//                 //         callback(err.stack, null);
//                 //     else {
//                 //         callback(null, result.rows[0].accountid)
//                 //     }
//                 // })

//                 pg('account').insert({accountname: username, accountpassword: hashedPassword, email: email, fullname: fullname, adminrights: 'false'}).returning('accountid')
//                 .then((res) => callback(null, res.rows[0].accountid), (err) => callback(err, null));


//             }   
//             catch { 
//                 console.log(err)
//                 callback(err)
//             }
//         }
//     })
// }

// //gets adminrights value from database according to username input and sends it as response
// let getAdminRights = (accountid, callback) => {
//     // const query = { 
//     //     text: 
//     //     `select distinct adminrights 
//     //     from account
//     //     where accountid = '${accountid}';`
//     // }


//     // sql.query(query, (err, res) => { 
//     //     if(err) { 
//     //         callback(err.stack);
//     //     }
//     //     else { 
//     //         callback(null, res.rows)  //returns results as rows
//     //     }
//     // })

//     pg.select(pg.raw(('distinct on ("adminrights")'))).from('account').where('accountid', accountid)
//     .then((res) => callback(null, res.rows), (err) => callback(err, null));

// }

// //used by booking controller

// //gets all hours from the table tabletimes of the database and sends them as response
// let getTablehours = (callback) => { 

//     // const query = { 
//     //     text: 
//     //     `SELECT tablehour FROM tabletimes ORDER BY tabletimeid;`
//     // }

//     // sql.query(query, (err, tablehours) => { 
//     //     if(err) { 
//     //         callback(err.stack);
//     //     }
//     //     else { 
//     //         callback(null, tablehours.rows);
//     //     }
//     // })

//     pg.select('tablehour').from('tabletimes').orderBy(['tabletimeid'])
//     .then((tablehours) => callback(null, tablehours.rows), (err) => callback(err, null));
// }


// //adds reservation with given values as inputs at the database reservation table
// let bookSlot = (userid, date, time, courtid, callback) => { 
    
//     //used for testing
//     //need to uncomment command below before runnig command  $ npm test
//     if (userid == null) {userid=2}

//     // const query = { 
//     //     text: 
//     //     `INSERT INTO reservation(reservationdate, reservationtime, reserveeid, courtid)
//     //     VALUES ($2, $3, $1, $4)
//     //     RETURNING *`,
//     //     values: [userid, date, time, courtid]
//     // }

//     // sql.query(query, (err, row) => { 
//     //     if(err) { 
//     //         callback(err.stack);
//     //     }
//     //     else { 
//     //         callback(null, row);
//     //     }
//     // })

//     pg('reservation').insert({reservationdate: date , reservationtime: time, reserveeid: userid, courtid: courtid}).returning('accountid')
//     .then((row) => callback(null, row), (err) => callback(err, null));

// }

// //adds reservation with given values as inputs at the database reservation table
// let changeSlotAvailability = (userid, date, time, courtid, callback) => { 

//     // const query = { 
//     //     text: 
//     //     `INSERT INTO reservation (reservationdate, reservationtime, courtid, reserveeid) 
//     //     VALUES ($1, $2, $3, $4)`,
//     //     values: [date, time, courtid, userid],
//     // }

//     // sql.query(query, (err, state) => { 
//     //     if(err){ 
//     //         callback(err.stack)
//     //     }
//     //     else{ 
//     //         callback(null, true);
//     //     }
//     // })


//     pg('reservation').insert({reservationdate: date , reservationtime: time, reserveeid: userid, courtid: courtid}).returning('accountid')
//     .then((row) => callback(null, row), (err) => callback(err, null));

// }

// //deletes reservation with given values from reservation table of database
// let deleteReservation = (date, time, courtid, callback) => { 

//     const query = { 
//         text: 
//         `DELETE 
//         FROM reservation 
//         WHERE reservationdate = $1 AND reservationtime = $2 AND courtid = $3`, 
//         values: [date, time, courtid],
//     }

//     sql.query(query, (err, state) => { 
//         if(err){ 
//             callback(err.stack)
//         }
//         else{ 
//             callback(null, true);
//         }
//     })

// }

// //gets all reservations from database reservation table (for a specific court) where courtid = the given id of the court
// let courtReservations = (courtid, callback) => { 
    
//     const query = { 
//         text: 
//         `SELECT * 
//         FROM reservation 
//         WHERE courtid = $1`, 
//         values: [courtid],
//     }

//     sql.query(query, function(err, reservations){ 
//         if(err) { 
//             callback(err.stack)
//         }
//         else{ 
//             callback(null, reservations.rows)
//         }
//     })

// }

// //gets all reservations from database reservation table (for a specific account) where reserveeid = the given id of the user
// let accountReservations = (userid, callback) => { 

//     const query = { 
//         text: 
//         `SELECT * 
//         FROM reservation
//         WHERE reserveeid = $1`,
//         values: [userid],
//     }

//     sql.query(query, (err, reservations) => { 
//         if(err){ 
//             callback(err.stack)
//         }
//         else { 
//             callback(null, reservations.rows)
//         }
//     })
// }

// //deletes a specific reservation that an account has made previously
// let cancelReservation= (reserveeid, reservationid, callback) => {
//     const query = { 
//         text: 
//         `delete from reservation where reserveeid = ${reserveeid} and reservationid = '${reservationid}';`
//     }


//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  
//         }
//     })

// }



// //used by tournament controller 

// //gets all values of all tournaments and sends them (as response) as a list of json objects
// let getTournaments = (callback) => {
//     const query = { 
//         text: 
//         `select tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster from tournament ORDER BY startdate;`
//     }


//     sql.query(query, (err, tournaments) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, tournaments.rows)  //returns results as rows
//         }
//     })

// }

// //gets all values of a tournament with a specific id and sends them (as response) as a list that contains one json object
// let getTournamentById = (tournamentId, callback) => {
//     const query = { 
//         text: 
//         `select * from tournament where tournamentid = '${tournamentId}';`
//     }


//     sql.query(query, (err, tournament) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else {
//             callback(null, tournament.rows)  //returns results as rows
//         }
//     })

// }

// //gets the number of all the tournaments that the tournament table contains
// let getTournamentsNumber = (callback) => {
//     const query = { 
//         text: 
//         `select count(*) from tournament;`
//     }


//     sql.query(query, (err, tournaments) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, tournaments.rows)  //returns results as rows
//         }
//     })

// }

// //adds new tournament to database tournament table
// //if title is null, it adds a general title value
// //if tournament poster is null: it adds null value to the poster column
// //else: the path of the poster at the files folder is added to poster column
// let addTournament = (newTournament, callback) => {
//     if (newTournament.title == '') newTournament.title = 'Επερχόμενο Τουρνουά (untitled)';
//     if (newTournament.skilllevel == '') newTournament.skilllevel = null;
//     if (newTournament.agerestrictions == '') newTournament.agerestrictions = null;

//     let query;
//     if (newTournament.poster == null)
//         query = { 
//             text: 
//             `insert into tournament (tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster)
//             values ('${newTournament.tournamentid}','${newTournament.title}', '${newTournament.startdate}', '${newTournament.enddate}', ${newTournament.skilllevel}, ${newTournament.agerestrictions}, '${newTournament.details}', ${newTournament.poster});`
//         }
//     else
//     query = { 
//         text: 
//         `insert into tournament (tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster)
//         values ('${newTournament.tournamentid}','${newTournament.title}', '${newTournament.startdate}', '${newTournament.enddate}', ${newTournament.skilllevel}, ${newTournament.agerestrictions}, '${newTournament.details}', '${newTournament.poster}');`
//     }

//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  //returns results as rows
//         }
//     })

// }

// //deletes tournament with given id from database tournament table
// let deleteTournament = (tournamentid, callback) => {
//     const query = { 
//         text: 
//         `delete from tournament where tournamentid = '${tournamentid}';`
//     }


//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  //returns results as rows
//         }
//     })

// }

// //gets all months (month in english as monthname) that correspond to the start dates of the tournaments that the database tournament table contains
// let getMonths = (callback) => {
//     const query = { 
//         text: 
//         `select distinct monthname from 
//         (select distinct startdate, TO_CHAR(DATE(startdate), 'Month') as monthname FROM tournament order by startdate) as orderedmonths;`
//     }


//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  //returns results as rows
//         }
//     })

// }

// //deletes all tournaments with startdates that correspond to the given month (given monthid)
// let deleteMonth = (monthid, callback) => {
//     const query = { 
//         text: 
//         `delete from tournament where translate(TO_CHAR(DATE(startdate), 'Month'), ' ', '') in ('${monthid}');`
//     }


//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  //returns results as rows
//         }
//     })

// }

// //gets all tournaments that have startdates that correspond to the given month (given monthid)
// let getMonthTournaments = (monthid, callback) => {
//     const query = { 
//         text: 
//         `select count(*) from tournament where translate(TO_CHAR(DATE(startdate), 'Month'), ' ', '') in ('${monthid}');`
//     }


//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  //returns results as rows
//         }
//     })

// }

// //updates tournament at tournament table of database with given values
// //if title is null, it adds a general title value
// //if tournament poster is null: the old poster value doesn't change
// //else: the path of the poster at the files folder is added to poster column
// let updateTournament = (newTournament, callback) => {
//     if (newTournament.title == '') newTournament.title = 'Επερχόμενο Τουρνουά (untitled)';
//     if (newTournament.skilllevel == '') newTournament.skilllevel = null;
//     if (newTournament.agerestrictions == '') newTournament.agerestrictions = null;
    
//     let query;
//     if (newTournament.poster == null)
//         query = { 
//             text:
//             `update tournament
//                 set title = '${newTournament.title}', startdate = '${newTournament.startdate}', enddate = '${newTournament.enddate}', skilllevel = ${newTournament.skilllevel}, agerestrictions = ${newTournament.agerestrictions}, details = '${newTournament.details}'
//                 where tournamentid = '${newTournament.tournamentid}';`
//         }
//     else
//         query = { 
//             text:
//             `update tournament
//                 set title = '${newTournament.title}', startdate = '${newTournament.startdate}', enddate = '${newTournament.enddate}', skilllevel = ${newTournament.skilllevel}, agerestrictions = ${newTournament.agerestrictions}, details = '${newTournament.details}', poster = '${newTournament.poster}'
//                 where tournamentid = '${newTournament.tournamentid}';`
//         }
    
//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  //returns results as rows
//         }
//     })

// }

// //gets all values of row of table joins at database with participantid = the participant id of the request and tournamentid = the tournament id of the request
// let searchJoin = (participantid, tournamentid, callback) => {
//     const query = { 
//         text: 
//         `select * from joins where participantid = ${participantid} and tournamentid = '${tournamentid}';`
//     }


//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  
//         }
//     })

// }

// //checks if participant has already joined in the same tournament
// //if yes: the function updates the comment value with the given one
// //if no: the function adds new row in the joins table if the database with the given values
// let joinTournament= (joined, participantid, tournamentid, comments, callback) => {
//         let query;
//         if (joined.length == 0)
//             query = { 
//                 text: 
//                 `insert into joins(participantid, tournamentid, comments)
//                 VALUES (${participantid}, '${tournamentid}', '${comments}');`
//             };
//         else
//             query = { 
//                 text: 
//                 `update joins
//                 set comments = '${comments}'
//                 where participantid = ${participantid} and tournamentid = '${tournamentid}';`
//             };
    
    
//         sql.query(query, (err, res) => { 
//             if(err) { 
//                 callback(err.stack);
//             }
//             else { 
//                 callback(null, res.rows)  
//             }
//         })
// }


// //deletes a specific join request at a specific tournament that an account has made previously
// let cancelJoinTournament= (participantid, tournamentid, callback) => {
//     const query = { 
//         text: 
//         `delete from joins where participantid = ${participantid} and tournamentid = '${tournamentid}';`
//     }


//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  
//         }
//     })

// }


// //gets all the tournaments that a specific account has joined in and sends them as response
// let getUserTournaments = (participantid, callback) => {
//     const query = { 
//         text: 
//         `select distinct * 
//         from joins join tournament on joins.tournamentid = tournament.tournamentid
//         where joins.participantid = '${participantid}';`
//     }


//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  //returns results as rows
//         }
//     })

// }

// //gets all account name , title and comments of all the join requests that have been made and stored in the join table of the database
// let getAllJoins = (callback) => {
//     const query = { 
//         text: 
//         `select distinct accountname, title, comments 
//         from account join (joins join tournament on joins.tournamentid = tournament.tournamentid) on accountid=participantid;`
//     }


//     sql.query(query, (err, res) => { 
//         if(err) { 
//             callback(err.stack);
//         }
//         else { 
//             callback(null, res.rows)  //returns results as rows
//         }
//     })

// }

// module.exports = {getUserByUsername, registerUser, getAdminRights, 
//                   getTablehours, bookSlot, changeSlotAvailability, deleteReservation, courtReservations, accountReservations, cancelReservation, 
//                   getTournaments, getTournamentById, getTournamentsNumber, addTournament, deleteTournament, getMonths, deleteMonth, updateTournament, joinTournament, getUserTournaments, getMonthTournaments, cancelJoinTournament, getAllJoins, searchJoin};




// ////////KNEX-END/////////////////////////


// const knex = require('knex');
// module.exports = knex ({
//     client: 'postgres',
//     connection: {
//         user: process.env.PG_USER,
//         host: "db",
//         database: process.env.PG_DATABASE,
//         password: process.env.PG_PASSWORD,
//         port: process.env.PG_PORT,
//         // idleTimeoutMillis: 0,
//         // connectionTimeoutMillis: 0
//     }
// })





//////////////// FIRST POOL ATTEMPT ///////////////////////////

// 'use strict';
// const { Pool } = require('pg');

// const pool = new Pool({
//         connectionString: process.env.DATABASE_URL || 'https://data.heroku.com/dataclips/myuyvblbtehgbranaxcpokofmrwq',
//         ssl: { rejectUnauthorized: false }
// })


// async function connect() {
//     try {
//         const client = await pool.connect();
//         return client
//     }
//     catch(e) {
//         console.error(`Failed to connect ${e}`)
//     }
// }



// //gets all info of account from database according to username input and sends them as response
// async function getUserByUsername (username, callback) { 

//      const sql = { 
//         text: 
//         `SELECT * FROM account WHERE accountname = $1`, 
//         values: [username],
//     }

//         try { 
//             const client = await connect();
//             const res = await client.query(sql);
//             await client.release();
//             callback(null, res.rows[0])
//         }catch(err) { 
//             console.log(err.stack)
//             callback(err.stack)
//         }

// }

// //checks if account with given username value already exists
// //if account with given username value does not exist, it adds account with given values to database
// async function registerUser (username, password, email, fullname, callback)  { 

//     getUserByUsername(username, async(err, userIdbyUsername) => { 

//         if(userIdbyUsername != undefined) { 
//             callback(null, null, "Υπάρχει ήδη χρήστης με αυτό το όνομα")
//         }
//         else { 
//             try{ 
//                 const hashedPassword = await bcrypt.hash(password, 10);

//                  const sql = { 
//                     text: 
//                     `INSERT INTO account(AccountName, AccountPassword, Email, FullName, AdminRights) 
//                     VALUES ($1, $2, $3, $4,'false') RETURNING accountid`,
//                     values: [username, hashedPassword, email, fullname]
//                 }

//                 try { 
//                     const client = await connect();
//                     const res = await client.query(sql);
//                     await client.release();
//                     callback(null, res.rows[0].accountid)
//                 }catch(err) { 
//                     console.log(err.stack)
//                     callback(err.stack)
//                 }
//             }   
//             catch { 
//                 console.log(err)
//                 callback(err)
//             }
//         }
//     })
// }

// //gets adminrights value from database according to username input and sends it as response
// async function getAdminRights (accountid, callback)  {
//      const sql = { 
//         text: 
//         `select distinct adminrights 
//         from account
//         where accountid = '${accountid}';`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //used by booking controller

// //gets all hours from the table tabletimes of the database and sends them as response
// async function getTablehours (callback)  { 

//      const sql = { 
//         text: 
//         `SELECT tablehour FROM tabletimes ORDER BY tabletimeid;`
//     }

//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }
// }


// //adds reservation with given values as inputs at the database reservation table
// async function bookSlot (userid, date, time, courtid, callback)  { 
    
//     //used for testing
//     //need to uncomment command below before runnig command  $ npm test
//     if (userid == null) {userid=2}

//      const sql = { 
//         text: 
//         `INSERT INTO reservation(reservationdate, reservationtime, reserveeid, courtid)
//         VALUES ($2, $3, $1, $4)
//         RETURNING *`,
//         values: [userid, date, time, courtid]
//     }

//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //adds reservation with given values as inputs at the database reservation table
// async function changeSlotAvailability (userid, date, time, courtid, callback)  { 

//      const sql = { 
//         text: 
//         `INSERT INTO reservation (reservationdate, reservationtime, courtid, reserveeid) 
//         VALUES ($1, $2, $3, $4)`,
//         values: [date, time, courtid, userid],
//     }

//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, true)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }
// }

// //deletes reservation with given values from reservation table of database
// async function deleteReservation (date, time, courtid, callback)  { 

//      const sql = { 
//         text: 
//         `DELETE 
//         FROM reservation 
//         WHERE reservationdate = $1 AND reservationtime = $2 AND courtid = $3`, 
//         values: [date, time, courtid],
//     }

//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, true)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }
// }

// //gets all reservations from database reservation table (for a specific court) where courtid = the given id of the court
// async function courtReservations (courtid, callback)  { 
    
//      const sql = { 
//         text: 
//         `SELECT * 
//         FROM reservation 
//         WHERE courtid = $1`, 
//         values: [courtid],
//     }

//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //gets all reservations from database reservation table (for a specific account) where reserveeid = the given id of the user
// async function accountReservations (userid, callback)  { 

//      const sql = { 
//         text: 
//         `SELECT * 
//         FROM reservation
//         WHERE reserveeid = $1`,
//         values: [userid],
//     }

//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }
// }

// //deletes a specific reservation that an account has made previously
// async function cancelReservation (reserveeid, reservationid, callback)  {
//      const sql = { 
//         text: 
//         `delete from reservation where reserveeid = ${reserveeid} and reservationid = '${reservationid}';`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }



// //used by tournament controller 

// //gets all values of all tournaments and sends them (as response) as a list of json objects
// async function getTournaments (callback)  {
//      const sql = { 
//         text: 
//         `select tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster from tournament ORDER BY startdate;`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //gets all values of a tournament with a specific id and sends them (as response) as a list that contains one json object
// async function getTournamentById (tournamentId, callback)  {
//      const sql = { 
//         text: 
//         `select * from tournament where tournamentid = '${tournamentId}';`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //gets the number of all the tournaments that the tournament table contains
// async function getTournamentsNumber (callback)  {
//      const sql = { 
//         text: 
//         `select count(*) from tournament;`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //adds new tournament to database tournament table
// //if title is null, it adds a general title value
// //if tournament poster is null: it adds null value to the poster column
// //else: the path of the poster at the files folder is added to poster column
// async function addTournament (newTournament, callback)  {
//     if (newTournament.title == '') newTournament.title = 'Επερχόμενο Τουρνουά (untitled)';
//     if (newTournament.skilllevel == '') newTournament.skilllevel = null;
//     if (newTournament.agerestrictions == '') newTournament.agerestrictions = null;

//     let sql;
//     if (newTournament.poster == null)
//         sql = { 
//             text: 
//             `insert into tournament (tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster)
//             values ('${newTournament.tournamentid}','${newTournament.title}', '${newTournament.startdate}', '${newTournament.enddate}', ${newTournament.skilllevel}, ${newTournament.agerestrictions}, '${newTournament.details}', ${newTournament.poster});`
//         }
//     else
//     sql = { 
//         text: 
//         `insert into tournament (tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster)
//         values ('${newTournament.tournamentid}','${newTournament.title}', '${newTournament.startdate}', '${newTournament.enddate}', ${newTournament.skilllevel}, ${newTournament.agerestrictions}, '${newTournament.details}', '${newTournament.poster}');`
//     }

//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //deletes tournament with given id from database tournament table
// async function deleteTournament (tournamentid, callback)  {
//      const sql = { 
//         text: 
//         `delete from tournament where tournamentid = '${tournamentid}';`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //gets all months (month in english as monthname) that correspond to the start dates of the tournaments that the database tournament table contains
// async function getMonths (callback)  {
//      const sql = { 
//         text: 
//         `select distinct monthname from 
//         (select distinct startdate, TO_CHAR(DATE(startdate), 'Month') as monthname FROM tournament order by startdate) as orderedmonths;`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //deletes all tournaments with startdates that correspond to the given month (given monthid)
// async function deleteMonth (monthid, callback)  {
//      const sql = { 
//         text: 
//         `delete from tournament where translate(TO_CHAR(DATE(startdate), 'Month'), ' ', '') in ('${monthid}');`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }
// }

// //gets all tournaments that have startdates that correspond to the given month (given monthid)
// async function getMonthTournaments (monthid, callback)  {
//      const sql = { 
//         text: 
//         `select count(*) from tournament where translate(TO_CHAR(DATE(startdate), 'Month'), ' ', '') in ('${monthid}');`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //updates tournament at tournament table of database with given values
// //if title is null, it adds a general title value
// //if tournament poster is null: the old poster value doesn't change
// //else: the path of the poster at the files folder is added to poster column
// async function updateTournament (newTournament, callback)  {
//     if (newTournament.title == '') newTournament.title = 'Επερχόμενο Τουρνουά (untitled)';
//     if (newTournament.skilllevel == '') newTournament.skilllevel = null;
//     if (newTournament.agerestrictions == '') newTournament.agerestrictions = null;
    
//     let sql;
//     if (newTournament.poster == null)
//         sql = { 
//             text:
//             `update tournament
//                 set title = '${newTournament.title}', startdate = '${newTournament.startdate}', enddate = '${newTournament.enddate}', skilllevel = ${newTournament.skilllevel}, agerestrictions = ${newTournament.agerestrictions}, details = '${newTournament.details}'
//                 where tournamentid = '${newTournament.tournamentid}';`
//         }
//     else
//         sql = { 
//             text:
//             `update tournament
//                 set title = '${newTournament.title}', startdate = '${newTournament.startdate}', enddate = '${newTournament.enddate}', skilllevel = ${newTournament.skilllevel}, agerestrictions = ${newTournament.agerestrictions}, details = '${newTournament.details}', poster = '${newTournament.poster}'
//                 where tournamentid = '${newTournament.tournamentid}';`
//         }
    
//         try { 
//             const client = await connect();
//             const res = await client.query(sql);
//             await client.release();
//             callback(null, res.rows)
//         }catch(err) { 
//             console.log(err.stack)
//             callback(err.stack)
//         }

// }

// //gets all values of row of table joins at database with participantid = the participant id of the request and tournamentid = the tournament id of the request
// async function searchJoin (participantid, tournamentid, callback)  {
//      const sql = { 
//         text: 
//         `select * from joins where participantid = ${participantid} and tournamentid = '${tournamentid}';`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }
// }

// //checks if participant has already joined in the same tournament
// //if yes: the function updates the comment value with the given one
// //if no: the function adds new row in the joins table if the database with the given values
// async function joinTournament (joined, participantid, tournamentid, comments, callback)  {
//         let sql;
//         if (joined.length == 0)
//             sql = { 
//                 text: 
//                 `insert into joins(participantid, tournamentid, comments)
//                 VALUES (${participantid}, '${tournamentid}', '${comments}');`
//             };
//         else
//             sql = { 
//                 text: 
//                 `update joins
//                 set comments = '${comments}'
//                 where participantid = ${participantid} and tournamentid = '${tournamentid}';`
//             };
    
    
//             try { 
//                 const client = await connect();
//                 const res = await client.query(sql);
//                 await client.release();
//                 callback(null, res.rows)
//             }catch(err) { 
//                 console.log(err.stack)
//                 callback(err.stack)
//             }
// }


// //deletes a specific join request at a specific tournament that an account has made previously
// async function cancelJoinTournament (participantid, tournamentid, callback)  {
//      const sql = { 
//         text: 
//         `delete from joins where participantid = ${participantid} and tournamentid = '${tournamentid}';`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }


// //gets all the tournaments that a specific account has joined in and sends them as response
// async function getUserTournaments (participantid, callback)  {
//      const sql = { 
//         text: 
//         `select distinct * 
//         from joins join tournament on joins.tournamentid = tournament.tournamentid
//         where joins.participantid = '${participantid}';`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// //gets all account name , title and comments of all the join requests that have been made and stored in the join table of the database
// async function getAllJoins (callback)  {
//      const sql = { 
//         text: 
//         `select distinct accountname, title, comments 
//         from account join (joins join tournament on joins.tournamentid = tournament.tournamentid) on accountid=participantid;`
//     }


//     try { 
//         const client = await connect();
//         const res = await client.query(sql);
//         await client.release();
//         callback(null, res.rows)
//     }catch(err) { 
//         console.log(err.stack)
//         callback(err.stack)
//     }

// }

// module.exports = {getUserByUsername, registerUser, getAdminRights, 
//                   getTablehours, bookSlot, changeSlotAvailability, deleteReservation, courtReservations, accountReservations, cancelReservation, 
//                   getTournaments, getTournamentById, getTournamentsNumber, addTournament, deleteTournament, getMonths, deleteMonth, updateTournament, joinTournament, getUserTournaments, getMonthTournaments, cancelJoinTournament, getAllJoins, searchJoin};


                  /////////////////////////////////////////////////////////////////////////////////////////






'use strict';
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'https://data.heroku.com/dataclips/myuyvblbtehgbranaxcpokofmrwq',
    ssl: { rejectUnauthorized: false }
})


// async function connect() {
// try {
//     const client = await pool.connect();
//     return client
// }
// catch(e) {
//     console.error(`Failed to connect ${e}`)
// }
// }



//gets all info of account from database according to username input and sends them as response
async function getUserByUsername (username, callback) { 

const sql = { 
    text: 
    `SELECT * FROM account WHERE accountname = $1`, 
    values: [username],
}

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        //return console.error('Error executing query', err.stack)
        callback(err, null);
      }
      console.log(result.rows[0]);
      callback(null, result.rows[0]);
    })
  })

}

//checks if account with given username value already exists
//if account with given username value does not exist, it adds account with given values to database
async function registerUser (username, password, email, fullname, callback)  { 

getUserByUsername(username, async(err, userIdbyUsername) => { 

    if(userIdbyUsername != undefined) { 
        callback(null, null, "Υπάρχει ήδη χρήστης με αυτό το όνομα")
    }
    else { 
        try{ 
            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = { 
                text: 
                `INSERT INTO account(AccountName, AccountPassword, Email, FullName, AdminRights) 
                VALUES ($1, $2, $3, $4,'false') RETURNING accountid`,
                values: [username, hashedPassword, email, fullname]
            }

            pool.connect((err, client, release) => {
                if (err) {
                  return console.error('Error acquiring client', err.stack)
                }
                client.query(sql, (err, result) => {
                  release()
                  if (err) {
                    //return console.error('Error executing query', err.stack)
                    callback(err,null)
                  }
                  console.log(result.rows);
                  callback(null, result.rows[0].accountid);
                })
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
async function getAdminRights (accountid, callback)  {
const sql = { 
    text: 
    `select distinct adminrights 
    from account
    where accountid = '${accountid}';`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null);
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

//used by booking controller

//gets all hours from the table tabletimes of the database and sends them as response
async function getTablehours (callback)  { 

const sql = { 
    text: 
    `SELECT tablehour FROM tabletimes ORDER BY tabletimeid;`
}

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })
}


//adds reservation with given values as inputs at the database reservation table
async function bookSlot (userid, date, time, courtid, callback)  { 

//used for testing
//need to uncomment command below before runnig command  $ npm test
if (userid == null) {userid=2}

const sql = { 
    text: 
    `INSERT INTO reservation(reservationdate, reservationtime, reserveeid, courtid)
    VALUES ($2, $3, $1, $4)
    RETURNING *`,
    values: [userid, date, time, courtid]
}

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result);
      callback(null, result);
    })
  })

}

//adds reservation with given values as inputs at the database reservation table
async function changeSlotAvailability (userid, date, time, courtid, callback)  { 

const sql = { 
    text: 
    `INSERT INTO reservation (reservationdate, reservationtime, courtid, reserveeid) 
    VALUES ($1, $2, $3, $4)`,
    values: [date, time, courtid, userid],
}

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(true);
      callback(null, true);
    })
  })
}

//deletes reservation with given values from reservation table of database
async function deleteReservation (date, time, courtid, callback)  { 

const sql = { 
    text: 
    `DELETE 
    FROM reservation 
    WHERE reservationdate = $1 AND reservationtime = $2 AND courtid = $3`, 
    values: [date, time, courtid],
}

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(true);
      callback(null, true);
    })
  })
}

//gets all reservations from database reservation table (for a specific court) where courtid = the given id of the court
async function courtReservations (courtid, callback)  { 

const sql = { 
    text: 
    `SELECT * 
    FROM reservation 
    WHERE courtid = $1`, 
    values: [courtid],
}

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

//gets all reservations from database reservation table (for a specific account) where reserveeid = the given id of the user
async function accountReservations (userid, callback)  { 

const sql = { 
    text: 
    `SELECT * 
    FROM reservation
    WHERE reserveeid = $1`,
    values: [userid],
}

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })
}

//deletes a specific reservation that an account has made previously
async function cancelReservation (reserveeid, reservationid, callback)  {
const sql = { 
    text: 
    `delete from reservation where reserveeid = ${reserveeid} and reservationid = '${reservationid}';`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}



//used by tournament controller 

//gets all values of all tournaments and sends them (as response) as a list of json objects
async function getTournaments (callback)  {
const sql = { 
    text: 
    `select tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster from tournament ORDER BY startdate;`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

//gets all values of a tournament with a specific id and sends them (as response) as a list that contains one json object
async function getTournamentById (tournamentId, callback)  {
const sql = { 
    text: 
    `select * from tournament where tournamentid = '${tournamentId}';`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

//gets the number of all the tournaments that the tournament table contains
async function getTournamentsNumber (callback)  {
const sql = { 
    text: 
    `select count(*) from tournament;`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

//adds new tournament to database tournament table
//if title is null, it adds a general title value
//if tournament poster is null: it adds null value to the poster column
//else: the path of the poster at the files folder is added to poster column
async function addTournament (newTournament, callback)  {
if (newTournament.title == '') newTournament.title = 'Επερχόμενο Τουρνουά (untitled)';
if (newTournament.skilllevel == '') newTournament.skilllevel = null;
if (newTournament.agerestrictions == '') newTournament.agerestrictions = null;

let sql;
if (newTournament.poster == null)
    sql = { 
        text: 
        `insert into tournament (tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster)
        values ('${newTournament.tournamentid}','${newTournament.title}', '${newTournament.startdate}', '${newTournament.enddate}', ${newTournament.skilllevel}, ${newTournament.agerestrictions}, '${newTournament.details}', ${newTournament.poster});`
    }
else
sql = { 
    text: 
    `insert into tournament (tournamentid, title, startdate, enddate, skilllevel, agerestrictions, details, poster)
    values ('${newTournament.tournamentid}','${newTournament.title}', '${newTournament.startdate}', '${newTournament.enddate}', ${newTournament.skilllevel}, ${newTournament.agerestrictions}, '${newTournament.details}', '${newTournament.poster}');`
}

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

//deletes tournament with given id from database tournament table
async function deleteTournament (tournamentid, callback)  {
const sql = { 
    text: 
    `delete from tournament where tournamentid = '${tournamentid}';`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

//gets all months (month in english as monthname) that correspond to the start dates of the tournaments that the database tournament table contains
async function getMonths (callback)  {
const sql = { 
    text: 
    `select distinct monthname from 
    (select distinct startdate, TO_CHAR(DATE(startdate), 'Month') as monthname FROM tournament order by startdate) as orderedmonths;`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

//deletes all tournaments with startdates that correspond to the given month (given monthid)
async function deleteMonth (monthid, callback)  {
const sql = { 
    text: 
    `delete from tournament where translate(TO_CHAR(DATE(startdate), 'Month'), ' ', '') in ('${monthid}');`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })
}

//gets all tournaments that have startdates that correspond to the given month (given monthid)
async function getMonthTournaments (monthid, callback)  {
const sql = { 
    text: 
    `select count(*) from tournament where translate(TO_CHAR(DATE(startdate), 'Month'), ' ', '') in ('${monthid}');`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

//updates tournament at tournament table of database with given values
//if title is null, it adds a general title value
//if tournament poster is null: the old poster value doesn't change
//else: the path of the poster at the files folder is added to poster column
async function updateTournament (newTournament, callback)  {
if (newTournament.title == '') newTournament.title = 'Επερχόμενο Τουρνουά (untitled)';
if (newTournament.skilllevel == '') newTournament.skilllevel = null;
if (newTournament.agerestrictions == '') newTournament.agerestrictions = null;

let sql;
if (newTournament.poster == null)
    sql = { 
        text:
        `update tournament
            set title = '${newTournament.title}', startdate = '${newTournament.startdate}', enddate = '${newTournament.enddate}', skilllevel = ${newTournament.skilllevel}, agerestrictions = ${newTournament.agerestrictions}, details = '${newTournament.details}'
            where tournamentid = '${newTournament.tournamentid}';`
    }
else
    sql = { 
        text:
        `update tournament
            set title = '${newTournament.title}', startdate = '${newTournament.startdate}', enddate = '${newTournament.enddate}', skilllevel = ${newTournament.skilllevel}, agerestrictions = ${newTournament.agerestrictions}, details = '${newTournament.details}', poster = '${newTournament.poster}'
            where tournamentid = '${newTournament.tournamentid}';`
    }

    pool.connect((err, client, release) => {
        if (err) {
          return console.error('Error acquiring client', err.stack)
        }
        client.query(sql, (err, result) => {
          release()
          if (err) {
            // return console.error('Error executing query', err.stack)
            callback(err, null)
          }
          console.log(result.rows);
          callback(null, result.rows);
        })
      })

}

//gets all values of row of table joins at database with participantid = the participant id of the request and tournamentid = the tournament id of the request
async function searchJoin (participantid, tournamentid, callback)  {
const sql = { 
    text: 
    `select * from joins where participantid = ${participantid} and tournamentid = '${tournamentid}';`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })
}

//checks if participant has already joined in the same tournament
//if yes: the function updates the comment value with the given one
//if no: the function adds new row in the joins table if the database with the given values
async function joinTournament (joined, participantid, tournamentid, comments, callback)  {
    let sql;
    if (joined.length == 0)
        sql = { 
            text: 
            `insert into joins(participantid, tournamentid, comments)
            VALUES (${participantid}, '${tournamentid}', '${comments}');`
        };
    else
        sql = { 
            text: 
            `update joins
            set comments = '${comments}'
            where participantid = ${participantid} and tournamentid = '${tournamentid}';`
        };


        pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }
            client.query(sql, (err, result) => {
              release()
              if (err) {
                // return console.error('Error executing query', err.stack)
                callback(err, null)
              }
              console.log(result.rows);
              callback(null, result.rows);
            })
          })
}


//deletes a specific join request at a specific tournament that an account has made previously
async function cancelJoinTournament (participantid, tournamentid, callback)  {
const sql = { 
    text: 
    `delete from joins where participantid = ${participantid} and tournamentid = '${tournamentid}';`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}


//gets all the tournaments that a specific account has joined in and sends them as response
async function getUserTournaments (participantid, callback)  {
const sql = { 
    text: 
    `select distinct * 
    from joins join tournament on joins.tournamentid = tournament.tournamentid
    where joins.participantid = '${participantid}';`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

//gets all account name , title and comments of all the join requests that have been made and stored in the join table of the database
async function getAllJoins (callback)  {
const sql = { 
    text: 
    `select distinct accountname, title, comments 
    from account join (joins join tournament on joins.tournamentid = tournament.tournamentid) on accountid=participantid;`
}


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(sql, (err, result) => {
      release()
      if (err) {
        // return console.error('Error executing query', err.stack)
        callback(err, null)
      }
      console.log(result.rows);
      callback(null, result.rows);
    })
  })

}

module.exports = {getUserByUsername, registerUser, getAdminRights, 
            getTablehours, bookSlot, changeSlotAvailability, deleteReservation, courtReservations, accountReservations, cancelReservation, 
            getTournaments, getTournamentById, getTournamentsNumber, addTournament, deleteTournament, getMonths, deleteMonth, updateTournament, joinTournament, getUserTournaments, getMonthTournaments, cancelJoinTournament, getAllJoins, searchJoin};
