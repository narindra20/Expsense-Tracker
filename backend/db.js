
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",       
  host: "localhost",      
  database: "personal_expense_tracker",
  password: "angela",
  port: 5432,
});

module.exports = pool;
