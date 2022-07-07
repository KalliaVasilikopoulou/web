const request = require("supertest");

//used express for apis
const express = require('express');
const app = express();

const dotenv = require('dotenv'); 
dotenv.config(); 

const exphbs = require('express-handlebars');

app.use(express.urlencoded({extended: false}));

const currentSession = require("../app-setup/app_setup_session.cjs");
app.use(currentSession);

//public folder for public files
app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.userId = req.session.loggedUserId;
  res.locals.userName = req.session.loggedUserName;
  res.locals.adminRights = req.session.adminRights;
  res.locals.newSession = req.session.newSession;
  next();
})

const routes = require('../routes/routes.cjs');
app.use('/', routes);

//set default layout of website to main.hbs
app.engine('hbs', exphbs.engine({
  extname: 'hbs', 
  defaultLayout: 'main.hbs', 
}));

app.set('view engine', 'hbs');

module.exports = app;

var assert = require('assert');


//login controller

  //when login is succesful, we get redirected to the URL of the main page ('/'), so we expect to get 302 response code
  //302 response code means that the resource requested has been temporarily moved to the URL given by the Location header
  test("check if loginForm route works when logged in as simple user", done => {
    request(app)
    .post("/loginForm")
    .type("form")
    .send({username: 'kallia', password: 'kallia'})
    .expect("Content-Type", "text/plain; charset=utf-8") //check if redirect to main page
    .expect(302, done);
  });

  //requests to /signUpForm are similar to the ones that are sent at /loginForm



//tournaments controller

test("check if allTournaments route works", done => {
  request(app)
    .get("/tournaments/allTournaments")
    .expect("Content-Type", /json/)
    .expect(200, done);
});

test("check if userTournaments route works when not logged in", () => {
  request(app)
    .get("/showComments")
    .expect("Content-Type", "text/html; charset=utf-8") ; //check if redirect to login page
});


test("check if userTournaments route works when logged in", () => {
    request(app)
    .get("/tournaments/userTournaments")
    .expect("Content-Type", /json/);
});


test("check if showComments route works", () => {
    request(app)
    .post("/tournamentForm/joinTournament")
    .type("form")
    .send({participantid: 2, tournamentid: "TOUR_3_26", comments: "newcomment"})
    .then(() => {
      request(app)
      .get("/showComments")
      .expect("Content-Type", "text/html; charset=utf-8");
    });
});


//need to delete all previous tournaments and create tournament with id = 'TOUR_3_26" and a random title (required) to work
test("check if editTournamentAtDB route works when logged in", done => {
      request(app)
      .post("/tournamentsAdmin/editTournamentAtDB")
      .type("form")
      .send({tournamentid: 'TOUR_3_26', title: 'tour1', startdate: '', enddate: '', skilllevel: '1', agerestrictions: '2', details: '', poster:''})
      .then(() => {
        request(app)
        .get("/tournaments/allTournaments")
        .expect((res) => assert.equal(res.body.length, 1, 'expect body to contain only one tournament json object'))
        .expect(200, done);
      });
  });



  test("check if deleteTournamentFromDB route works when logged in", done => {
        request(app)
        .post("/tournamentsAdmin/deleteTournamentFromDB")
        .type("form")
        .send({tournamentid: 'TOUR_3_26'})
        .then(() => {
          request(app)
          .get("/tournaments/allTournaments")
          .expect([], done);
        });
    });


test("check if addTournamentToDB route works when logged in", done => {
      request(app)
      .post("/tournamentsAdmin/addTournamentToDB")
      .type("form")
      .send({title: 'tour2', startdate: '', enddate: '', skilllevel: '1', agerestrictions: '2', details: '', poster:''})
      .then(() => {
        request(app)
        .get("/tournaments/allTournaments")
        .expect("Content-Type", /json/)
        .expect(200, done);
    });
});
  

//needs to be changed according to current month
test("check if deleteMonthFromDB route works when logged in", done => {
      request(app)
      .post("/tournamentsAdmin/deleteMonthFromDB")
      .type("form")
      .send({monthid: 'July'})
      .then(() => {
        request(app)
        .get("/tournaments/allTournaments")
        .expect([], done);
      });
  });




  test("check if /booking/hours route works", done => {
    request(app)
      .get("/booking/hours")
      .expect("Content-Type", /json/)
      .expect([{tablehour:"7:30"},{tablehour:"8:40"},{tablehour:"9:50"},{tablehour:"11:00"},{tablehour:"12:10"},{tablehour:"13:20"},{tablehour:"14:30"},{tablehour:"15:40"},{tablehour:"16:50"},{tablehour:"18:00"},{tablehour:"19:10"},{tablehour:"20:20"},{tablehour:"21:30"}], done);
  });


  test("check if /booking/courts route works", done => {
    request(app)
      .get("/booking/courts")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect({}, done);    //at this URL only a text is sent, not json objects, so, we expect to see {} at this URL
  });


  //need to have no reservations (delete existing reservations before running test)


  test("check if /booking/availability route works", done => {
    request(app)
      .get("/booking/availability")
      .expect("Content-Type", /json/)
      .expect([], done);
  });


//need to uncomment reserveeid default value at model_pg.cjs file
test("check if make booking route works", done => {
    request(app)
      .get("/booking/make/2022-07-057:30")
      .expect("Content-Type", /json/)
      .expect((res) => assert.equal(res.body.length, 1, 'expect body to contain only one reservation json object'))
      .expect(200, done);
  });


//URL /booking/change/:datetime has the same functionality as /booking/make/:datetime


  test("check if delete booking route works", done => {
    request(app)
      .get("/booking/delete/2022-07-057:30")
      .expect("Content-Type", /json/)
      .expect([], done);
  });


  //URL /cancelReservation has the same functionality as /booking/delete/:datetime