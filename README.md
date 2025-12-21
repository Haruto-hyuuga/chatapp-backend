# chatapp-backend

backend for chatapp, written in nodejs using typescript.

### NPM pakages:

`npm install express bcrypt jsonwebtoken pg`

- express → HTTP server framework
- bcrypt → password hashing
- jsonwebtoken → JWT auth
- pg → PostgreSQL client

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

## this whole code in tsconfig.json

```
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",

    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",

    "types": ["node"],
    "skipLibCheck": true,

    "sourceMap": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```
