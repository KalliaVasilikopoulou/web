const dotenv = require('dotenv');
dotenv.config();

const app = require('./app.cjs');



//for first time of running herocu local web (not needed later)

// const db = require('./model/db.pg.js');

// db.insertCourts(function(err,res){
//     if(err) { 
//         console.log(err);
//     }
//     else {
//         console.log('success');
//     }
// })

// db.insertTableTimes(function(err,res){
//     if(err) { 
//         console.log(err);
//     }
//     else {
//         console.log('success');
//     }
// })



//for first time of creating a new admin account (not needed later for the same account)

// const db = require('./model/model_pg.cjs');

// const username = 'kallia';  //change it to create your desired admin

// db.createAdmin(username, function(err,res){
//     if(err) { 
//         console.log(err);
//     }
//     else {
//         console.log('admin created');
//     }
// })


//website port is set in the .env file, else set to 3000
const port = process.env.PORT || '3000';

const server = app.listen(port, () => { console.log("Listening to port " + port) });

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
    });
});