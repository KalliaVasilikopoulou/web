const bcrypt = require("bcrypt"); 
const dotenv = require("dotenv");

let userModel = require("../model/model_pg.cjs");
// let userModel = require('../model/db.pg.js');


//function used when the complete button of the sign up popup gets clicked
//variable check used so we can check if the user filled all the fields of the form (all fields are necessary to be filled)
//if registration is successful, then redirect to login page
let register = (req, res) => {
    let check = true; 
    for (let key of Object.keys(req.body)) {
        if(req.body[key] == "") { 
            check = false;
            break;
        }
    }
    if (check) { 
        userModel.registerUser(req.body.username, req.body.password, req.body.email, req.body.fullname, (err, result, message) => { 
            if(err) { 
                res.render('signup', {layout: 'formslayout', message:err});
            }
            else if (message) { 
                res.render('signup', {layout: 'formslayout', message:message});
            }
            else { 
                res.redirect('/login');
            }
        })        
    }
    else{ 
        let message_load = "Συμπληρώστε όλα τα πεδία";
        res.render('signup', {layout: 'formslayout', message:message_load})
    }

}



//function used when the complete button of the login popup gets clicked
//variable check used so we can check if the user filled all the fields of the form (all fields are necessary to be filled)
//if login is successful, then we check if the user exists in the database
//if the user does not exist, redirect to login with login error message (no such user)
//if the user exists, check if the given password matches the password of the account at the database with the same username
//if it matches, create a new session for the specific user and redirect to the main page
//else, redirect to login with login error message (wrong password)
let login = (req, res, next) => { 
    let check = true;
    for (let key of Object.keys(req.body)) {
        if(req.body[key] == "") { 
            check = false;
            break;
        }
    }
    if(check){
        userModel.getUserByUsername(req.body.username, (err, user) => { 
            if (user == undefined || user == "") { 
                let message = "Δεν βρέθηκε ο χρήστης"
                res.render('login',{layout: 'formslayout', message: message});
            }
            else { 
                const match = bcrypt.compare(req.body.password, user.accountpassword, (err, match) => { 
                    if (match) { 
                        req.session.loggedUserId = user.accountid;
                        req.session.loggedUserName = user.accountname;
                        req.session.adminRights = user.adminrights;
                        req.session.newSession = true;
                        res.redirect('/');
                        next();
                    }
                    else { 
                        let message = "Ο κωδικός πρόσβασης είναι λάθος"
                        res.render('login',{layout: 'formslayout', message: message});
                    }
                })
            }
        })        
    }
    else{ 
        res.render('login',{layout: 'formslayout', message: "Συμπληρώστε όλα τα πεδία"});
    }

}

//destroys session for the user that requested logout
let logout = (req, res) => { 
    req.session.destroy(); 
    res.redirect('/');
}

//when trying to access a specific page that you can only access if you have an account, this function will check if a session for the specific user exists
//if it does not exist (and the url of the current page is not the url for the login nor sign up page), then redirect to login page
let checkAuthenticated = (req, res, next) => { 
    if (req.session.loggedUserId){ 
        next();
    }
    else{ 
        console.log("user not authenticated")
        if ((req.originalUrl == '/login') || (req.originalUrl == '/register')) { 
            next(); 
        }
        else {  
            res.redirect('/login');
        }
    }
}


//get the admin rights for the specific user from the accounts table database
let getAdminRights = (req, res) => { 
    userModel.getAdminRights(req.session.loggedUserId, function(err, adminRights) {
        if(err) { 
            res.send(err);
        }
        else {
            res.send (adminRights);
        }
    });
}


module.exports = {register, login, logout, checkAuthenticated, getAdminRights};