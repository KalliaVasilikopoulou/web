const session = require("express-session");

let currentSession = 

    session({
        name: process.env.SESSION_SECRET || 'session-name',
        secret: process.env.SESSION_SECRET || 'session-secret',
        resave: false,
        saveUninitialized: false,
        cookie:{ 
            maxAge: 1000*60*60, //cookie lasts for an hour
            sameSite: true,
        }
    })

module.exports = currentSession;