'use strict';
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://gfevvhwqsavrtm:3c8f404acb3fe6c905c9642cfe83e86e402619452cc982c3df3f98b5a77b4258@ec2-34-253-119-24.eu-west-1.compute.amazonaws.com:5432/dpuf5u3e1dc5g',
    ssl: { rejectUnauthorized: false }
    // user: process.env.PG_USER,
    // host: process.env.PG_HOST,
    // database: process.env.PG_DATABASE,
    // password: process.env.PG_PASSWORD,
    // port: process.env.PG_PORT,
    // idleTimeoutMillis: 0,
    // connectionTimeoutMillis: 0
});

client.connect((err) => {
    if (err)
        throw err;
});

module.exports = client