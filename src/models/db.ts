import { Pool } from "pg";

// const pool = new Pool({
//   host: "db.uccqjtdyxhwqlcsvgmky.supabase.co",
//   port: 5432,
//   database: "postgres",
//   user: "postgres",
//   password: process.env.DB_PASSWORD,
//   ssl: { rejectUnauthorized: false },
// });



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
