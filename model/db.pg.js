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


const knex = require('knex');
module.exports = knex ({
    client: 'postgres',
    connection: {
        database: 'db',
        connectionString: process.env.DATABASE_URL || 'https://data.heroku.com/dataclips/myuyvblbtehgbranaxcpokofmrwq',
        ssl: { rejectUnauthorized: false }
    }
})