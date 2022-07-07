const express = require('express');
const router = express.Router();
const multer = require("multer");

const dotenv = require('dotenv');
dotenv.config();


//multer is used so that the posters of the images will be stored in the local disk

//Configuration for Multer
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
    if ((file.mimetype.split("/")[1] === "png") || (file.mimetype.split("/")[1] === "jpg") || (file.mimetype.split("/")[1] === "jpeg")) {
      cb(null, true);
    } else {
      console.log("Wrong file type: ", file.mimetype.split("/")[1]);
      cb(new Error("Not a PNG or JPG File!!"), false);
    }
};

//Calling the "multer" Function
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });


const tournamentsController = require('../controller/tournamentsController.cjs'); 

const bookingController = require('../controller/bookingController.cjs');

const loginController = require('../controller/loginController.cjs');


//page render

router.route('/').get((req, res) => { 
    if(req.session.loggedUserId) { 
        res.render('index',{layout: 'signed.hbs', title : "Villia Tennis Club", style: "index.css"});
    }
    else { 
        res.render('index',{title : "Villia Tennis Club", style: "index.css"});
    } 
});

router.route('/tennis').get((req, res) => { 
    if(req.session.loggedUserId){ 
        let scripts = [];
        res.render('tennis', {layout: 'signed.hbs', title: "Villia Tennis Club | Tennis", style: "tennis.css", scripts: scripts});
    }
    else{ 
        let scripts = [];
        res.render('tennis', {title: "Villia Tennis Club | Tennis", style: "tennis.css", scripts: scripts});        
    }

});

router.route('/lessons').get((req, res) => { 
    if(req.session.loggedUserId){ 
        let scripts = []; 
        res.render('lessons', {layout: 'signed.hbs', title: "Villia Tennis Club | Lessons", style: "lessons.css", scripts: scripts}); 
    }
    else { 
        let scripts = [];
        res.render('lessons', {title: "Villia Tennis Club | Lessons", style: "lessons.css", scripts: scripts});        
    }
});

router.route('/spaces').get((req, res) => { 
    if(req.session.loggedUserId) { 
        let scripts = [];
        res.render('spaces', {layout: 'signed.hbs', title: "Villia Tennis Club | Spaces", style: "spaces.css", scripts: scripts});
    }
    else{ 
        let scripts = [];
        res.render('spaces', {title: "Villia Tennis Club | Spaces", style: "spaces.css", scripts: scripts}); 
    }
});

router.route('/courts').get((req, res) => { 
    if(req.session.loggedUserId) { 
        let scripts = [];
        res.render('courts', {layout: 'signed.hbs', title: "Villia Tennis Club | Courts", style: "courts.css", scripts: scripts});
    }
    else{ 
        let scripts = [];
        res.render('courts', {title: "Villia Tennis Club | Courts", style: "courts.css", scripts: scripts});
    }
});

router.route('/restaurant').get((req, res) => { 
    if(req.session.loggedUserId) { 
        let scripts = []; 
        res.render('restaurant', {layout: 'signed.hbs', title: "Villia Tennis Club | Restaurant", style: "restaurant.css", scripts: scripts})
    }
    else{ 
        let scripts = []; 
        res.render('restaurant', {title: "Villia Tennis Club | Restaurant", style: "restaurant.css", scripts: scripts})
    }
})

router.route('/pool').get((req, res) => { 
    if(req.session.loggedUserId) { 
        let scripts = []; 
        res.render('pool', {layout: 'signed.hbs', title: "Villia Tennis Club | Pool", style: "pool.css", scripts: scripts})
    }
    else{ 
        let scripts = []; 
        res.render('pool', {title: "Villia Tennis Club | Pool", style: "pool.css", scripts: scripts})
    }
})

router.route('/medicalFacilities').get((req, res) => { 
    if(req.session.loggedUserId) { 
        let scripts = []; 
        res.render('medicalFacilities', {layout: 'signed.hbs', title: "Villia Tennis Club | Medical Facilities", style: "medicalFacilities.css", scripts: scripts})
    }
    else{ 
        let scripts = []; 
        res.render('medicalFacilities', {title: "Villia Tennis Club | Medical Facilities", style: "medicalFacilities.css", scripts: scripts})
    }
})

router.route('/login').get((req, res) => { 
    res.render('login', {layout: 'formslayout.hbs', title: "Login"})
});

router.route('/signup').get((req, res) => { 
    res.render('signup', {layout: 'formslayout.hbs', title: "Signup"})
});

router.get('/logout', loginController.logout);

//account form routers
router.post('/loginForm', loginController.login, bookingController.setGlobal);
router.post('/registerForm', loginController.register);

//account routers
router.get('/getAdminRights', loginController.checkAuthenticated, loginController.getAdminRights);

//booking routers 
router.get('/booking', loginController.checkAuthenticated, bookingController.renderChoice);
router.get('/booking/courts/next', bookingController.increment);
router.get('/booking/courts/previous', bookingController.decrement);
router.get('/booking/hours', bookingController.tablehours);
router.get('/booking/courts', bookingController.getCurrentCourt);
router.get('/booking/availability', bookingController.getReservations);
router.get('/booking/make/:datetime', bookingController.makeBooking, bookingController.getReservations);
router.get('/booking/delete/:datetime', bookingController.deleteBooking, bookingController.getReservations);
router.get('/booking/change/:datetime', bookingController.changeBooking, bookingController.getReservations);
router.get('/booking/userReservations', loginController.checkAuthenticated, bookingController.getAccountReservations);
router.get('/cancelReservation' , loginController.checkAuthenticated, bookingController.cancelReservation);

//tournament routers
router.get('/tournaments', loginController.checkAuthenticated, tournamentsController.renderChoice);
router.get('/tournamentsAdmin', loginController.checkAuthenticated, tournamentsController.renderChoice);
router.get('/tournamentForm', tournamentsController.renderTournamentForm);
router.get('/tournaments/allTournaments', tournamentsController.allTournaments);
router.get('/selectedTournament', tournamentsController.addTournamentToForm);
router.post('/tournamentsAdmin/addTournamentToDB' , upload.single('poster'), tournamentsController.addTournamentToDB);
router.post('/tournamentsAdmin/deleteTournamentFromDB' , tournamentsController.deleteTournamentFromDB);
router.get('/deleteTournamentSelect' , tournamentsController.deleteTournamentSelect);
router.post('/tournamentsAdmin/deleteMonthFromDB' , tournamentsController.deleteMonthFromDB);
router.get('/deleteMonthSelect' , tournamentsController.deleteMonthSelect);
router.get('/editTournamentSelect' , tournamentsController.editTournamentSelect);
router.post('/tournamentsAdmin/editTournamentAtDB' , upload.single('poster'), tournamentsController.editTournamentAtDB);
router.post('/tournamentForm/joinTournament' , tournamentsController.joinTournament);
router.get('/tournaments/userTournaments', loginController.checkAuthenticated, tournamentsController.renderUserTournaments);
router.get('/cancelJoinTournament', loginController.checkAuthenticated, tournamentsController.cancelJoinTournament);
router.get('/showComments', loginController.checkAuthenticated, tournamentsController.rendershowComments);

module.exports = router;

