const dotenv = require('dotenv');
dotenv.config();

const app = require('./app.cjs');

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