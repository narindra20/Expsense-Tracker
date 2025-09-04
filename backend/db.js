// connexion de postgresql

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "expense_db",
  password: "Narindra1703!",
  port: 5432,
});

export default pool;

