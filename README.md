# chatapp-backend

backend for https://github.com/Haruto-hyuuga/chatapp
written in nodejs using typescript.

### NPM pakages:

`npm install express bcrypt jsonwebtoken pg socket.io
`

- express → HTTP server framework
- bcrypt → password hashing
- jsonwebtoken → JWT auth
- pg → PostgreSQL client
- socket.io → live two-way connection

### Typescript

```
npm install --save-dev \
  typescript \
  @types/node \
  @types/express \
  @types/bcrypt \
  @types/jsonwebtoken \
  @types/pg

```

`npm install -D tsx`

> using tsx instead of ts-node-dev

### TypeScript runtime

`npm install -D tsx`

## Add this in pakage.json

```
 "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
```
