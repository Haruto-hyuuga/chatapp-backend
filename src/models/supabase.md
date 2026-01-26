## Database Connection (Supabase – IPv4 Session Pooler)

### Connection Details

- **Connection type:** URI
- **Source:** Primary database
- **Method:** Direct connection (if ipv6)

then copy your connection string and paste in your backend env variable

>> Direct database connections are **not IPv4 compatible** on the Supabase free tier, so an **indirect (pooled) connection** is required for platforms like Render. change connection method to **Session pooler** for ipv4 compatible.


