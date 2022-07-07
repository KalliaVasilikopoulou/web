//used express for apis
const express = require('express');
const app = express();

const dotenv = require('dotenv'); 
dotenv.config(); 

const exphbs = require('express-handlebars');

app.use(express.urlencoded({extended: false}));

const currentSession = require("./app-setup/app_setup_session.cjs");
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

const routes = require('./routes/routes.cjs');
app.use('/', routes);

//set default layout of website to main.hbs
app.engine('hbs', exphbs.engine({
  extname: 'hbs', 
  defaultLayout: 'main.hbs', 
}));

app.set('view engine', 'hbs');

module.exports = app;
