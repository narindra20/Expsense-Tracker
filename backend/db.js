// connexion de postgresql

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "personal_expense_tracker",
  password: "angela",
  port: 5432,
});

export default pool;

