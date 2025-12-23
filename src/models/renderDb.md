When hosting databse on render

# 1: Create Postgres on Render

Fill like this then Click Create Database:

- Name => chatapp-postgres
- Region => Singapore (same as backend)
- PostgreSQL => Version Default
- Plan => Free
- Database => leave default
- User leave => default

## 2: wait till done you will get

- Internal Database URL
- External Database URL

## 3: Add env variable to backend service

Add:
`DATABASE_URL` = postgres://user:password@host:5432/dbname (Internal Database URL)

# Local schema Migration

tables and stuff are created in local and copied to render (best way to do acc to me)

❯ `sudo systemctl start postgresql`

❯ `sudo -iu postgres`

write schema in file named schema.sql you can check file is by cmd ls

```
pg_dump \
 --schema-only \
 --no-owner \
 --no-privileges \
 chatapp_db > schema.sql

```

❯ optional: read schema file: `less schema.sql`

finally copy schema to render (will take long time wait for output):
**Use External Database URL**

❯ `psql "postgres://USER:PASSWORD@HOST:5432/DBNAME" < schema.sql`

## now do remember free tier db from render does get deleted after 1 month
