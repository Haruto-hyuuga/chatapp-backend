## INSTALL postgresql

`sudo pacman -S postgresql`

> donnow about windows

## CONFIG IT

> step 1) switch to postgres system user (prompt will change do not panic)

`sudo -iu postgres`

> step 2) Initialize the database cluster, (This runs only once in your lifetime per install)

`initdb --locale=en_US.UTF-8 -D /var/lib/postgres/data`

> step 3) exit, yes type exit to exit step 1

## START/STOP SERVICE

- Start PostgreSQL service: `sudo systemctl start postgresql`
- To check status if its running: `sudo systemctl status postgresql` (to exit type q)
- to stop service: `sudo systemctl stop postgresql`
- to force kill: `sudo systemctl kill postgresql`

## WORKING

### Enter PostgreSQL and understand where you are

run: `sudo -iu postgres`

then: `psql`

You should see: `postgres=#`

This means:
You are logged in as postgres user
You are inside the default database called postgres

---

### 1. List databases

Inside psql, run: `\l`

### 2. Create database for your app

`CREATE DATABASE chatapp_db;`

Verify: `\l`
You should now see: `chatapp_db`

### 4. Switch to your database

`\c chatapp_db`

Prompt becomes: `chatapp_db=#`

> Now everything you do affects only this database.

### 5. Create your first table (users)

first do run these:
Enables cryptographic functions: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
verify this func: `SELECT gen_random_uuid();`

```
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Check tables: `\dt`

You should see: `users`

### 6. Understand this table (important)

Column Meaning:

id Auto number
username User name
email Must be unique
created_at Auto timestamp

> PostgreSQL enforces rules, not your code.

### 7. Insert data

```
INSERT INTO users (username, email)
VALUES ('alice', 'alice@test.com');
```

```
INSERT INTO users (username, email)
VALUES ('bob', 'bob@test.com');
```

### 8. Read data

`SELECT \* FROM users;`

You should see rows printed.
This is real stored data, not memory.

### 9. Try a rule violation (to learn)

```
INSERT INTO users (username, email)
VALUES ('alice2', 'alice@test.com');
```

It will fail.
Why?
Because email is UNIQUE.
PostgreSQL protects your data.

### 10. Update data

```
UPDATE users
SET username = 'alice_updated'
WHERE id = 1;
```

Check: `SELECT \* FROM users;`

### 11. Delete data

`DELETE FROM users WHERE id = 2;`

Check: `SELECT \* FROM users;`

### — Exit PostgreSQL `\q`
