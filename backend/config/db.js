const { Pool } = require('pg'); 
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: '127.0.0.1',
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5435,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};