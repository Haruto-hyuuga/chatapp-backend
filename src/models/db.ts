import { Pool } from "pg";
//  ⚠️ Warning
// Do not use `#` in the database password.
// Using `#` fucks up PostgreSQL connection URLs and can cause connection errors.
// Use only letters, numbers, `_` or `-` in the password.

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// const pool = new Pool({
//   user: "postgres",
//   password: "admin",
//   host: "localhost",
//   port: 5432,
//   database: "chatapp_db",
// });

export default pool;
