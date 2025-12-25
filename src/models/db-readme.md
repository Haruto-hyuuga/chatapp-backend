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

### 5. Create your tables

first do run these (once per db):
Enables cryptographic functions: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
verify this func: `SELECT gen_random_uuid();`

#### user table

```
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> if u want profile pictures

```
ALTER TABLE users
ADD COLUMN profile_url TEXT NOT NULL
    DEFAULT 'https://your-cdn.com/avatars/default.png',
ADD COLUMN profile_updated_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP;

```

> IF you want gemini interaction service

`ALTER TABLE users ADD COLUMN gemini_interaction_id TEXT;`

#### conversation table

```
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    participant_one UUID NOT NULL REFERENCES users(id),
    participant_two UUID NOT NULL REFERENCES users(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (participant_one <> participant_two)
);
```

#### message table

```
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    conversation_id UUID NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,

    sender_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### contacts table

```
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    contact_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_user_contact
        UNIQUE (user_id, contact_id),

    CONSTRAINT no_self_contact
        CHECK (user_id <> contact_id)
);
```

> supporting indexes

`CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);`

`CREATE INDEX IF NOT EXISTS idx_contacts_contact_id ON contacts(contact_id);`

#### Check tables: `\dt`

You should see: `users`

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

# more cmds

## Switch Database

```sql
\c database_name
```

---

## List All Tables

```sql
\dt
```

List tables in a specific schema:

```sql
\dt schema_name.*
```

---

## Describe Table Structure

Shows columns, types, nullability, defaults:

```sql
\d table_name
```

Detailed structure (indexes, constraints, storage):

```sql
\d+ table_name
```

---

## View Table Data (Rows)

View all rows:

```sql
SELECT * FROM table_name;
```

Limit rows:

```sql
SELECT * FROM table_name LIMIT 10;
```

---

## List Table Columns Only

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'table_name';
```

---

## List Indexes

```sql
\di
```

Indexes of a specific table:

```sql
\di table_name*
```

---

## List Constraints (PK, FK, UNIQUE)

```sql
\d table_name
```

Or via SQL:

```sql
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'table_name'::regclass;
```

---

## List Views

```sql
\dv
```

---

## List Sequences

```sql
\ds
```

---

## List Functions

```sql
\df
```

---

## List Rules

```sql
\dr
```

Rules for a table:

```sql
SELECT rulename, definition
FROM pg_rules
WHERE tablename = 'table_name';
```

---

## Show Table Size

```sql
\d+ table_name
```

Or:

```sql
SELECT pg_size_pretty(pg_total_relation_size('table_name'));
```

---

---

## Helpful Meta Commands

```sql
\?     -- all psql commands
\h     -- SQL help
\x     -- toggle expanded output
```
